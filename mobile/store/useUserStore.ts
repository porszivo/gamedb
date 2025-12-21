import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IGDBPlatform } from '@/components/game/Platforms';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSettings {
  language: string;
  platforms: IGDBPlatform[];
  themeMode: 'light' | 'dark' | 'system';
}

interface UserStore {
  userSettings: UserSettings;
  addPlatform: (platform: IGDBPlatform) => void;
  removePlatform: (platform: IGDBPlatform) => void;
  changeLanguage: (language: string) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userSettings: {language: 'de', platforms: [], themeMode: 'dark'},
      addPlatform: (platform: IGDBPlatform) => {
        const {userSettings} = get();
        let platforms = userSettings.platforms;
        if (!userSettings.platforms.find(plat => plat === platform)) {
          platforms = [...platforms, platform];
          set({userSettings: {...userSettings, platforms: platforms}});
        }
      },
      removePlatform: (platform: IGDBPlatform) => {
        const {userSettings} = get();
        let platforms = userSettings.platforms;
        set({userSettings: {...userSettings, platforms: platforms.filter(plat => plat !== platform)}});
      },
      changeLanguage: (newLanguage: string) => {
        const {userSettings} = get();
        set({userSettings: {...userSettings, language: newLanguage}});
      },
      setThemeMode: (mode: 'light' | 'dark' | 'system') => {
        const {userSettings} = get();
        set({userSettings: {...userSettings, themeMode: mode}});
      }
    }),
    {name: 'user-store', storage: createJSONStorage(() => AsyncStorage)}
  )
);