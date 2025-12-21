import axios from 'axios';
import { GameSearchResult, IGDBGame } from '../types';

class IGDBService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000;

      return this.accessToken;
    } catch (error) {
      console.error('Failed to get IGDB access token:', error);
      throw new Error('Failed to authenticate with IGDB');
    }
  }

  private async makeIGDBRequest(endpoint: string, query: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await axios.post(
      `https://api.igdb.com/v4/${endpoint}`,
      query,
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      }
    );
    return response.data;
  }

  public async searchGames(searchTerm: string, platform?: string): Promise<GameSearchResult[]> {
    let query = `
      fields name, slug, summary, first_release_date, cover.url, platforms.name, genres.name;
      search "${searchTerm}";
      where game_type = 0
    `;
    if (platform) {
      query += `& platforms.name ~ *"${platform}"`;
    }
    query += '; limit 20;';
    try {
      const games: IGDBGame[] = await this.makeIGDBRequest('games', query);

      return games.map(this.transformIGDBGame);
    } catch (error) {
      console.error('IGDB search error:', error);
      throw new Error('Failed to search games');
    }
  }

  public async getGameById(gameId: number): Promise<GameSearchResult | null> {
    const query = `
      fields name, slug, summary, first_release_date, cover.url, platforms.name, genres.name;
      where id = ${gameId};
    `;

    try {
      const games: IGDBGame[] = await this.makeIGDBRequest('games', query);

      if (games.length === 0) return null;

      return this.transformIGDBGame(games[0]);
    } catch (error) {
      console.error('IGDB get game error:', error);
      return null;
    }
  }

  private transformIGDBGame(game: IGDBGame): GameSearchResult {
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
      summary: game.summary,
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : undefined,
      coverUrl: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : undefined,
      platforms: game.platforms?.map(p => p.name) || [],
      genres: game.genres?.map(g => g.name) || []
    };
  }
}

export const igdbService = new IGDBService();