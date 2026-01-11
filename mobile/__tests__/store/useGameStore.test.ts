import { act } from '@testing-library/react-native';
import { useGameStore } from '@/store/useGameStore';

// Mock the GameService
jest.mock('@/services/GameService', () => ({
  searchGameApi: jest.fn(),
}));

import { searchGameApi } from '@/services/GameService';

const mockSearchGameApi = searchGameApi as jest.MockedFunction<typeof searchGameApi>;

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useGameStore.getState();
    store.clearSearchResults();
    store.clearError();
    // Clear userLibrary and favorites
    useGameStore.setState({
      userLibrary: [],
      favorites: [],
      searchResults: [],
      isSearching: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('has empty arrays and no error', () => {
      const state = useGameStore.getState();
      expect(state.searchResults).toEqual([]);
      expect(state.userLibrary).toEqual([]);
      expect(state.favorites).toEqual([]);
      expect(state.isSearching).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('searchGames', () => {
    const mockGames = [
      {
        id: 1,
        name: 'Super Mario Bros',
        platforms: ['NES'],
        coverUrl: 'https://example.com/mario.jpg',
      },
      {
        id: 2,
        name: 'The Legend of Zelda',
        platforms: ['NES', 'Game Boy'],
        coverUrl: 'https://example.com/zelda.jpg',
      },
    ];

    it('sets isSearching to true during search', async () => {
      mockSearchGameApi.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockGames), 100)));

      const searchPromise = useGameStore.getState().searchGames('Mario');

      expect(useGameStore.getState().isSearching).toBe(true);

      await searchPromise;

      expect(useGameStore.getState().isSearching).toBe(false);
    });

    it('updates searchResults on successful search', async () => {
      mockSearchGameApi.mockResolvedValue(mockGames);

      await useGameStore.getState().searchGames('Mario');

      const state = useGameStore.getState();
      expect(state.searchResults).toEqual(mockGames);
      expect(state.error).toBeNull();
    });

    it('sets error on failed search', async () => {
      mockSearchGameApi.mockRejectedValue(new Error('Network error'));

      await useGameStore.getState().searchGames('Mario');

      const state = useGameStore.getState();
      expect(state.searchResults).toEqual([]);
      expect(state.error).toBe('Network error');
    });

    it('passes platform parameter to API', async () => {
      mockSearchGameApi.mockResolvedValue([]);

      await useGameStore.getState().searchGames('Mario', '18');

      expect(mockSearchGameApi).toHaveBeenCalledWith('Mario', '18');
    });
  });

  describe('addToLibrary', () => {
    const mockGame = {
      id: 1,
      name: 'Super Mario Bros',
      platforms: ['NES', 'SNES'],
      coverUrl: 'https://example.com/mario.jpg',
    };

    it('adds game with userPlatform to library', () => {
      useGameStore.getState().addToLibrary(mockGame, 'NES');

      const state = useGameStore.getState();
      expect(state.userLibrary).toHaveLength(1);
      expect(state.userLibrary[0].id).toBe(1);
      expect(state.userLibrary[0].userPlatform).toBe('NES');
    });

    it('allows same game with different platforms', () => {
      useGameStore.getState().addToLibrary(mockGame, 'NES');
      useGameStore.getState().addToLibrary(mockGame, 'SNES');

      const state = useGameStore.getState();
      expect(state.userLibrary).toHaveLength(2);
      expect(state.userLibrary[0].userPlatform).toBe('NES');
      expect(state.userLibrary[1].userPlatform).toBe('SNES');
    });

    it('prevents duplicate game+platform combinations', () => {
      useGameStore.getState().addToLibrary(mockGame, 'NES');
      useGameStore.getState().addToLibrary(mockGame, 'NES');

      const state = useGameStore.getState();
      expect(state.userLibrary).toHaveLength(1);
    });
  });

  describe('removeFromLibrary', () => {
    const mockGame = {
      id: 1,
      name: 'Super Mario Bros',
      platforms: ['NES', 'SNES'],
    };

    beforeEach(() => {
      useGameStore.getState().addToLibrary(mockGame, 'NES');
      useGameStore.getState().addToLibrary(mockGame, 'SNES');
    });

    it('removes specific platform version when platform specified', () => {
      useGameStore.getState().removeFromLibrary(1, 'NES');

      const state = useGameStore.getState();
      expect(state.userLibrary).toHaveLength(1);
      expect(state.userLibrary[0].userPlatform).toBe('SNES');
    });

    it('removes all versions when no platform specified', () => {
      useGameStore.getState().removeFromLibrary(1);

      const state = useGameStore.getState();
      expect(state.userLibrary).toHaveLength(0);
    });
  });

  describe('favorites', () => {
    const mockGame = {
      id: 1,
      name: 'Super Mario Bros',
      platforms: ['NES'],
    };

    it('adds game to favorites', () => {
      useGameStore.getState().addToFavorites(mockGame);

      const state = useGameStore.getState();
      expect(state.favorites).toHaveLength(1);
      expect(state.favorites[0].id).toBe(1);
    });

    it('prevents duplicate favorites', () => {
      useGameStore.getState().addToFavorites(mockGame);
      useGameStore.getState().addToFavorites(mockGame);

      const state = useGameStore.getState();
      expect(state.favorites).toHaveLength(1);
    });

    it('removes game from favorites', () => {
      useGameStore.getState().addToFavorites(mockGame);
      useGameStore.getState().removeFromFavorites(1);

      const state = useGameStore.getState();
      expect(state.favorites).toHaveLength(0);
    });
  });

  describe('clearSearchResults', () => {
    it('clears search results', () => {
      useGameStore.setState({
        searchResults: [{ id: 1, name: 'Test', platforms: [] }],
      });

      useGameStore.getState().clearSearchResults();

      expect(useGameStore.getState().searchResults).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('sets error message', () => {
      useGameStore.getState().setError('Test error');

      expect(useGameStore.getState().error).toBe('Test error');
    });

    it('clears error', () => {
      useGameStore.getState().setError('Test error');
      useGameStore.getState().clearError();

      expect(useGameStore.getState().error).toBeNull();
    });
  });
});
