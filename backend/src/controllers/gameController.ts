import { Request, Response } from 'express';
import { gameService } from '../services/gameService';

export class GameController {
  async searchGames(req: Request, res: Response) {
    try {
      const { q: searchTerm, platform } = req.query;

      if (!searchTerm || typeof searchTerm !== 'string') {
        return res.status(400).json({ error: 'Search term is required' });
      }

      const games = await gameService.searchGames(
        searchTerm,
        platform as string
      );

      res.json( games );
    } catch (error) {
      console.error('Search games error:', error);
      res.status(500).json({ error: 'Failed to search games' });
    }
  }

  async addGameToLibrary(req: Request, res: Response) {
    try {
      const userId = req.headers['user-id'] as string; // Simplified auth for now

      if (!userId) {
        return res.status(401).json({ error: 'User ID required' });
      }

      const gameEntry = await gameService.addGameToUserLibrary(userId, req.body);
      res.status(201).json(gameEntry);
    } catch (error) {
      console.error('Add game error:', error);
      res.status(500).json({ error: 'Failed to add game to library' });
    }
  }

  async getUserLibrary(req: Request, res: Response) {
    try {
      const userId = req.headers['user-id'] as string;

      if (!userId) {
        return res.status(401).json({ error: 'User ID required' });
      }

      const library = await gameService.getUserLibrary(userId);
      res.json({ library });
    } catch (error) {
      console.error('Get library error:', error);
      res.status(500).json({ error: 'Failed to get user library' });
    }
  }

  async removeGameFromLibrary(req: Request, res: Response) {
    try {
      const userId = req.headers['user-id'] as string;
      const { entryId } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User ID required' });
      }

      await gameService.removeGameFromLibrary(userId, entryId);
      res.status(204).send();
    } catch (error) {
      console.error('Remove game error:', error);
      res.status(500).json({ error: 'Failed to remove game from library' });
    }
  }
}

export const gameController = new GameController();