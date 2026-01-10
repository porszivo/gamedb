const API_URL = 'http://localhost:3000/api/games';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;

/**
 * Custom error types for better error handling
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Delay helper for retry logic
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = REQUEST_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new TimeoutError(`Request timed out after ${timeout}ms`);
    }

    // Network error (no connection, DNS failure, etc.)
    throw new NetworkError('Netzwerkfehler. Bitte überprüfe deine Internetverbindung.');
  }
}

/**
 * Search games with retry logic and better error handling
 */
export async function searchGameApi(query: string, platform?: string): Promise<any> {
  let url = `${API_URL}/search?q=${encodeURIComponent(query)}`;
  if (platform) {
    url += `&platform=${encodeURIComponent(platform)}`;
  }

  let lastError: Error | null = null;

  // Retry logic
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(url);

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = `API-Fehler (${response.status})`;

        // Different handling for different status codes
        switch (response.status) {
          case 400:
            throw new ApiError('Ungültige Suchanfrage', response.status);
          case 404:
            throw new ApiError('API-Endpunkt nicht gefunden', response.status);
          case 429:
            throw new ApiError('Zu viele Anfragen. Bitte versuche es später erneut.', response.status);
          case 500:
          case 502:
          case 503:
            // Server errors are retryable
            if (attempt < MAX_RETRIES) {
              await delay(1000 * (attempt + 1)); // Exponential backoff
              continue;
            }
            throw new ApiError('Server-Fehler. Bitte versuche es später erneut.', response.status);
          default:
            throw new ApiError(errorMessage, response.status);
        }
      }

      // Parse JSON response
      const data = await response.json();

      // Basic validation
      if (!Array.isArray(data)) {
        console.warn('API response is not an array:', data);
        return [];
      }

      return data;

    } catch (error: any) {
      lastError = error;

      // Don't retry on non-retryable errors
      if (error instanceof ApiError && error.statusCode < 500) {
        throw error;
      }

      // Don't retry on timeout
      if (error instanceof TimeoutError) {
        throw error;
      }

      // Retry on network errors and 5xx errors
      if (attempt < MAX_RETRIES) {
        console.log(`Retry attempt ${attempt + 1}/${MAX_RETRIES}...`);
        await delay(1000 * (attempt + 1)); // Exponential backoff
        continue;
      }

      // All retries exhausted
      throw lastError || new Error('Unbekannter Fehler beim Laden der Spiele');
    }
  }

  throw lastError || new Error('Unbekannter Fehler beim Laden der Spiele');
}