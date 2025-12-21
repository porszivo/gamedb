import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IGDBPlatform } from '@/components/game/Platforms';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSettings {
  language: string;
  platforms: IGDBPlatform[];
}

interface UserStore {
  userSettings: UserSettings;
  addPlatform: (platform: IGDBPlatform) => void;
  removePlatform: (platform: IGDBPlatform) => void;
  changeLanguage: (language: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userSettings: {language: 'de', platforms: []},
      addPlatform: (platform: IGDBPlatform) => {
        const {userSettings} = get();
        let platforms = userSettings.platforms;
        if (!userSettings.platforms.find(plat => plat === platform)) {
          platforms = [...platforms, platform];
          set({userSettings: {language: userSettings.language, platforms: platforms}});
        }
      },
      removePlatform: (platform: IGDBPlatform) => {
        const {userSettings} = get();
        let platforms = userSettings.platforms;
        set({userSettings: {language: userSettings.language, platforms: platforms.filter(plat => plat !== platform)}});
      },
      changeLanguage: (newLanguage: string) => {
        const {userSettings} = get();
        set({userSettings: {language: newLanguage, platforms: userSettings.platforms}});
      }
    }),
    {name: 'user-store', storage: createJSONStorage(() => AsyncStorage)}
  )
);