import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import { searchGameApi } from '@/services/GameService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Game {
  id: number;
  name: string;
  platforms: string[];
  summary?: string;
  coverUrl?: string;
  releaseDate?: string;
  genres?: string[];
  userPlatform?: string; // The platform the user owns this game for
}

interface GameStore {
  searchResults: Game[];
  userLibrary: Game[];
  favorites: Game[];
  isSearching: boolean;
  error: string | null;

  searchGames: (query: string, platform?: string) => Promise<Game[]>;
  addToLibrary: (game: Game, userPlatform: string) => void;
  removeFromLibrary: (gameId: number, userPlatform?: string) => void;
  addToFavorites: (game: Game) => void;
  removeFromFavorites: (gameId: number) => void;
  clearSearchResults: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      searchResults: [],
      userLibrary: [],
      favorites: [],
      isSearching: false,
      error: null,

      searchGames: async (query: string, platform?: string) => {
        set({isSearching: true, error: null});

        try {
          const results = await searchGameApi(query, platform);
          set({searchResults: results, isSearching: false});
          return results;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Search failed',
            isSearching: false
          });
          return [];
        }
      },
      removeFromLibrary: (gameId: number, userPlatform?: string) => {
        const {userLibrary, favorites} = get();
        if (userPlatform) {
          // Remove specific platform version
          set({userLibrary: userLibrary.filter(
            game => !(game.id === gameId && game.userPlatform === userPlatform)
          )});
        } else {
          // Remove all versions of this game
          set({userLibrary: userLibrary.filter(game => game.id !== gameId)});
          set({favorites: favorites.filter(game => game.id !== gameId)});
        }
      },
      addToLibrary: (newGame: Game, userPlatform: string) => {
        const {userLibrary} = get();
        // Check if game with same ID and platform already exists
        const alreadyExists = userLibrary.some(
          game => game.id === newGame.id && game.userPlatform === userPlatform
        );
        if (!alreadyExists) {
          set({userLibrary: [...userLibrary, {...newGame, userPlatform}]});
        }
      },
      addToFavorites: (game: Game) => {
        const {favorites} = get();
        if (!favorites.some(fav => fav.id === game.id)) {
          set({favorites: [...favorites, game]});
        }
      },
      removeFromFavorites: (gameId: number) => {
        const {favorites} = get();
        set({favorites: favorites.filter(game => game.id !== gameId)});
      },
      clearSearchResults: () => {
        set({searchResults: []});
      },
      setError: (error: string | null) => set({error}),
      clearError: () => set({error: null})
    }),
    {
      name: 'game-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userLibrary: state.userLibrary,
        favorites: state.favorites,
      }),
    }
  )
);