import { PrismaClient } from '@prisma/client';
import { igdbService } from './igdbService';
import { GameSearchResult, CreateGameEntryRequest } from '../types';

const prisma = new PrismaClient();

export class GameService {
  async searchGames(searchTerm: string, platform?: string): Promise<GameSearchResult[]> {
    return igdbService.searchGames(searchTerm, platform);
  }

  async addGameToUserLibrary(userId: string, gameData: CreateGameEntryRequest) {
    // Erst das Spiel in unserer DB speichern/aktualisieren
    const gameInfo = await igdbService.getGameById(gameData.gameId);
    if (!gameInfo) {
      throw new Error('Game not found');
    }

    await prisma.game.upsert({
      where: { id: gameData.gameId },
      update: {
        name: gameInfo.name,
        slug: gameInfo.slug,
        summary: gameInfo.summary,
        releaseDate: gameInfo.releaseDate ? new Date(gameInfo.releaseDate) : null,
        coverUrl: gameInfo.coverUrl,
        platforms: gameInfo.platforms,
        genres: gameInfo.genres,
      },
      create: {
        id: gameData.gameId,
        name: gameInfo.name,
        slug: gameInfo.slug,
        summary: gameInfo.summary,
        releaseDate: gameInfo.releaseDate ? new Date(gameInfo.releaseDate) : null,
        coverUrl: gameInfo.coverUrl,
        platforms: gameInfo.platforms,
        genres: gameInfo.genres,
      }
    });

    // Dann den GameEntry für den User erstellen
    return prisma.gameEntry.create({
      data: {
        userId,
        gameId: gameData.gameId,
        platform: gameData.platform,
        status: gameData.status || 'OWNED',
        rating: gameData.rating,
        notes: gameData.notes,
      },
      include: {
        game: true
      }
    });
  }

  async getUserLibrary(userId: string) {
    return prisma.gameEntry.findMany({
      where: { userId },
      include: {
        game: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async removeGameFromLibrary(userId: string, entryId: string) {
    return prisma.gameEntry.deleteMany({
      where: {
        id: entryId,
        userId
      }
    });
  }
}

export const gameService = new GameService();