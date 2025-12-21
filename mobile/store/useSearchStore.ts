import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SearchStore {
  // State
  searchHistory: string[];
  selectedPlatform: string | null;
  filters: {
    minYear?: number;
    maxYear?: number;
    genres?: string[];
  };

  // Actions
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  setSelectedPlatform: (platform: string | null) => void;
  setFilters: (filters: SearchStore['filters']) => void;
}

export const useSearchStore = create<SearchStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        searchHistory: [],
        selectedPlatform: null,
        filters: {},

        // Actions
        addToHistory: (query: string) => {
          const {searchHistory} = get();
          const newHistory = [
            query,
            ...searchHistory.filter(item => item !== query)
          ].slice(0, 10); // Nur die letzten 10 behalten

          set({searchHistory: newHistory});
        },

        clearHistory: () => set({searchHistory: []}),

        setSelectedPlatform: (platform: string | null) =>
          set({selectedPlatform: platform}),

        setFilters: (filters) => set({filters})
      }),
      {
        name: 'search-storage' // LocalStorage key
      }
    ),
    {
      name: 'search-store'
    }
  )
);