export interface IGDBGame {
  id: number;
  name: string;
  slug?: string;
  summary?: string;
  first_release_date?: number;
  cover?: {
    id: number;
    url: string;
  };
  platforms?: Array<{
    id: number;
    name: string;
  }>;
  genres?: Array<{
    id: number;
    name: string;
  }>;
}

export interface GameSearchResult {
  id: number;
  name: string;
  slug?: string;
  summary?: string;
  releaseDate?: string;
  coverUrl?: string;
  platforms: string[];
  genres: string[];
}

export interface CreateGameEntryRequest {
  gameId: number;
  platform?: string;
  status?: 'OWNED' | 'WISHLIST' | 'PLAYED' | 'COMPLETED';
  rating?: number;
  notes?: string;
}