import { useUserStore } from '@/store/useUserStore';
import { IGDBPlatform } from '@/components/game/Platforms';

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      userSettings: {
        language: 'de',
        platforms: [],
        themeMode: 'system',
      },
    });
  });

  describe('initial state', () => {
    it('has default settings', () => {
      const state = useUserStore.getState();
      expect(state.userSettings.language).toBe('de');
      expect(state.userSettings.platforms).toEqual([]);
      expect(state.userSettings.themeMode).toBe('system');
    });
  });

  describe('changeLanguage', () => {
    it('changes language to English', () => {
      useUserStore.getState().changeLanguage('en');

      expect(useUserStore.getState().userSettings.language).toBe('en');
    });

    it('changes language to German', () => {
      useUserStore.getState().changeLanguage('en');
      useUserStore.getState().changeLanguage('de');

      expect(useUserStore.getState().userSettings.language).toBe('de');
    });
  });

  describe('addPlatform', () => {
    it('adds a platform to the list', () => {
      useUserStore.getState().addPlatform(IGDBPlatform.NINTENDO_SWITCH);

      const platforms = useUserStore.getState().userSettings.platforms;
      expect(platforms).toContain(IGDBPlatform.NINTENDO_SWITCH);
      expect(platforms).toHaveLength(1);
    });

    it('adds multiple platforms', () => {
      useUserStore.getState().addPlatform(IGDBPlatform.NINTENDO_SWITCH);
      useUserStore.getState().addPlatform(IGDBPlatform.PLAYSTATION_5);
      useUserStore.getState().addPlatform(IGDBPlatform.SUPER_NINTENDO);

      const platforms = useUserStore.getState().userSettings.platforms;
      expect(platforms).toHaveLength(3);
      expect(platforms).toContain(IGDBPlatform.NINTENDO_SWITCH);
      expect(platforms).toContain(IGDBPlatform.PLAYSTATION_5);
      expect(platforms).toContain(IGDBPlatform.SUPER_NINTENDO);
    });

    it('prevents duplicate platforms', () => {
      useUserStore.getState().addPlatform(IGDBPlatform.NINTENDO_SWITCH);
      useUserStore.getState().addPlatform(IGDBPlatform.NINTENDO_SWITCH);

      const platforms = useUserStore.getState().userSettings.platforms;
      expect(platforms).toHaveLength(1);
    });
  });

  describe('removePlatform', () => {
    beforeEach(() => {
      useUserStore.getState().addPlatform(IGDBPlatform.NINTENDO_SWITCH);
      useUserStore.getState().addPlatform(IGDBPlatform.PLAYSTATION_5);
      useUserStore.getState().addPlatform(IGDBPlatform.SUPER_NINTENDO);
    });

    it('removes a platform from the list', () => {
      useUserStore.getState().removePlatform(IGDBPlatform.PLAYSTATION_5);

      const platforms = useUserStore.getState().userSettings.platforms;
      expect(platforms).toHaveLength(2);
      expect(platforms).not.toContain(IGDBPlatform.PLAYSTATION_5);
    });

    it('keeps other platforms when removing one', () => {
      useUserStore.getState().removePlatform(IGDBPlatform.PLAYSTATION_5);

      const platforms = useUserStore.getState().userSettings.platforms;
      expect(platforms).toContain(IGDBPlatform.NINTENDO_SWITCH);
      expect(platforms).toContain(IGDBPlatform.SUPER_NINTENDO);
    });

    it('does nothing when removing non-existent platform', () => {
      useUserStore.getState().removePlatform(IGDBPlatform.XBOX_SERIES);

      const platforms = useUserStore.getState().userSettings.platforms;
      expect(platforms).toHaveLength(3);
    });
  });

  describe('themeMode', () => {
    it('has system as default theme mode', () => {
      expect(useUserStore.getState().userSettings.themeMode).toBe('system');
    });

    it('can be set via setState', () => {
      useUserStore.setState({
        userSettings: {
          ...useUserStore.getState().userSettings,
          themeMode: 'dark',
        },
      });

      expect(useUserStore.getState().userSettings.themeMode).toBe('dark');
    });
  });

  describe('persistence', () => {
    it('maintains state structure', () => {
      useUserStore.getState().addPlatform(IGDBPlatform.NES);
      useUserStore.getState().changeLanguage('en');

      const state = useUserStore.getState();
      expect(state.userSettings).toHaveProperty('language');
      expect(state.userSettings).toHaveProperty('platforms');
      expect(state.userSettings).toHaveProperty('themeMode');
    });
  });
});
