import {
  IGDBPlatform,
  IGDBPlatformLabels,
  PlatformManufacturer,
  PlatformsByManufacturer,
  getPlatformLabel,
  getAllPlatforms,
  getPlatformsByManufacturer,
  getManufacturerColor,
  getPlatformColor,
  normalizePlatformName,
  getPlatformShortName,
} from '@/components/game/Platforms';

describe('Platforms Utilities', () => {
  describe('getPlatformLabel', () => {
    it('returns correct label for known platform', () => {
      expect(getPlatformLabel(IGDBPlatform.PLAYSTATION_5)).toBe('PlayStation 5');
      expect(getPlatformLabel(IGDBPlatform.NINTENDO_SWITCH)).toBe('Nintendo Switch');
      expect(getPlatformLabel(IGDBPlatform.XBOX_SERIES)).toBe('Xbox Series X|S');
    });

    it('returns fallback for unknown platform', () => {
      expect(getPlatformLabel(999 as IGDBPlatform)).toBe('Platform 999');
    });
  });

  describe('getAllPlatforms', () => {
    it('returns array of all platforms', () => {
      const platforms = getAllPlatforms();
      expect(Array.isArray(platforms)).toBe(true);
      expect(platforms.length).toBeGreaterThan(0);
    });

    it('returns only numeric values (enum values)', () => {
      const platforms = getAllPlatforms();
      platforms.forEach(platform => {
        expect(typeof platform).toBe('number');
      });
    });

    it('includes major platforms', () => {
      const platforms = getAllPlatforms();
      expect(platforms).toContain(IGDBPlatform.PLAYSTATION_5);
      expect(platforms).toContain(IGDBPlatform.NINTENDO_SWITCH);
      expect(platforms).toContain(IGDBPlatform.XBOX_SERIES);
      expect(platforms).toContain(IGDBPlatform.PC);
    });
  });

  describe('PlatformsByManufacturer', () => {
    it('contains all manufacturers', () => {
      expect(PlatformsByManufacturer[PlatformManufacturer.NINTENDO]).toBeDefined();
      expect(PlatformsByManufacturer[PlatformManufacturer.SONY]).toBeDefined();
      expect(PlatformsByManufacturer[PlatformManufacturer.MICROSOFT]).toBeDefined();
      expect(PlatformsByManufacturer[PlatformManufacturer.SEGA]).toBeDefined();
      expect(PlatformsByManufacturer[PlatformManufacturer.OTHER]).toBeDefined();
    });

    it('Nintendo includes Switch and retro consoles', () => {
      const nintendo = PlatformsByManufacturer[PlatformManufacturer.NINTENDO];
      expect(nintendo).toContain(IGDBPlatform.NINTENDO_SWITCH);
      expect(nintendo).toContain(IGDBPlatform.SUPER_NINTENDO);
      expect(nintendo).toContain(IGDBPlatform.NES);
      expect(nintendo).toContain(IGDBPlatform.GAME_BOY);
    });

    it('Sony includes all PlayStation consoles', () => {
      const sony = PlatformsByManufacturer[PlatformManufacturer.SONY];
      expect(sony).toContain(IGDBPlatform.PLAYSTATION_5);
      expect(sony).toContain(IGDBPlatform.PLAYSTATION_4);
      expect(sony).toContain(IGDBPlatform.PLAYSTATION_3);
      expect(sony).toContain(IGDBPlatform.PLAYSTATION_2);
      expect(sony).toContain(IGDBPlatform.PLAYSTATION_1);
    });
  });

  describe('getManufacturerColor', () => {
    it('returns Nintendo red', () => {
      expect(getManufacturerColor(PlatformManufacturer.NINTENDO)).toBe('#E60012');
    });

    it('returns Sony blue', () => {
      expect(getManufacturerColor(PlatformManufacturer.SONY)).toBe('#0070CC');
    });

    it('returns Microsoft green', () => {
      expect(getManufacturerColor(PlatformManufacturer.MICROSOFT)).toBe('#107C10');
    });

    it('returns Sega blue', () => {
      expect(getManufacturerColor(PlatformManufacturer.SEGA)).toBe('#0089CF');
    });

    it('returns gray for other', () => {
      expect(getManufacturerColor(PlatformManufacturer.OTHER)).toBe('#9CA3AF');
    });
  });

  describe('getPlatformColor', () => {
    it('returns blue for PlayStation platforms', () => {
      expect(getPlatformColor('PlayStation 5')).toBe('#0070CC');
      expect(getPlatformColor('PS4')).toBe('#0070CC');
      expect(getPlatformColor('PS Vita')).toBe('#0070CC');
    });

    it('returns red for Nintendo platforms', () => {
      expect(getPlatformColor('Nintendo Switch')).toBe('#E60012');
      expect(getPlatformColor('SNES')).toBe('#E60012');
      expect(getPlatformColor('Game Boy')).toBe('#E60012');
    });

    it('returns green for Xbox platforms', () => {
      expect(getPlatformColor('Xbox Series X')).toBe('#107C10');
      expect(getPlatformColor('Xbox One')).toBe('#107C10');
    });

    it('returns blue for Sega platforms', () => {
      expect(getPlatformColor('Dreamcast')).toBe('#0089CF');
      expect(getPlatformColor('Sega Genesis')).toBe('#0089CF');
    });

    it('returns gray for unknown platforms', () => {
      expect(getPlatformColor('Unknown Console')).toBe('#9CA3AF');
    });
  });

  describe('normalizePlatformName', () => {
    it('normalizes SNES variants', () => {
      expect(normalizePlatformName('Super Nintendo')).toBe('Super Nintendo');
      expect(normalizePlatformName('Super Famicom')).toBe('Super Nintendo');
      expect(normalizePlatformName('SNES')).toBe('Super Nintendo');
    });

    it('normalizes NES variants', () => {
      expect(normalizePlatformName('NES')).toBe('NES');
      expect(normalizePlatformName('Famicom')).toBe('NES');
    });

    it('normalizes Genesis/Mega Drive', () => {
      expect(normalizePlatformName('Sega Genesis')).toBe('Genesis');
      expect(normalizePlatformName('Mega Drive')).toBe('Genesis');
    });

    it('returns original name for other platforms', () => {
      expect(normalizePlatformName('PlayStation 5')).toBe('PlayStation 5');
      expect(normalizePlatformName('Nintendo Switch')).toBe('Nintendo Switch');
    });
  });

  describe('getPlatformShortName', () => {
    it('returns short names for PlayStation', () => {
      expect(getPlatformShortName('PlayStation 5')).toBe('PS5');
      expect(getPlatformShortName('PlayStation 4')).toBe('PS4');
      expect(getPlatformShortName('PlayStation 3')).toBe('PS3');
      expect(getPlatformShortName('PlayStation 2')).toBe('PS2');
      expect(getPlatformShortName('PlayStation')).toBe('PSX');
    });

    it('returns short names for Xbox', () => {
      expect(getPlatformShortName('Xbox Series X|S')).toBe('XSX');
      expect(getPlatformShortName('Xbox One')).toBe('XB1');
      expect(getPlatformShortName('Xbox 360')).toBe('360');
    });

    it('returns short names for Nintendo', () => {
      expect(getPlatformShortName('Nintendo Switch')).toBe('NSW');
      expect(getPlatformShortName('Nintendo Wii U')).toBe('WiiU');
      expect(getPlatformShortName('Nintendo Wii')).toBe('Wii');
      expect(getPlatformShortName('Nintendo 64')).toBe('N64');
      expect(getPlatformShortName('Super Nintendo')).toBe('SNES');
      expect(getPlatformShortName('NES')).toBe('NES');
    });

    it('returns short names for handhelds', () => {
      expect(getPlatformShortName('Game Boy Advance')).toBe('GBA');
      expect(getPlatformShortName('Game Boy Color')).toBe('GBC');
      expect(getPlatformShortName('Game Boy')).toBe('GB');
      expect(getPlatformShortName('Nintendo 3DS')).toBe('3DS');
    });

    it('returns short names for Sega', () => {
      expect(getPlatformShortName('Dreamcast')).toBe('DC');
      expect(getPlatformShortName('Sega Genesis')).toBe('GEN');
      expect(getPlatformShortName('Sega Saturn')).toBe('SAT');
    });
  });

  describe('getPlatformsByManufacturer', () => {
    it('returns array of manufacturer groups', () => {
      const groups = getPlatformsByManufacturer();
      expect(Array.isArray(groups)).toBe(true);
      expect(groups.length).toBe(5); // Nintendo, Sony, Microsoft, Sega, Other
    });

    it('each group has manufacturer and platforms', () => {
      const groups = getPlatformsByManufacturer();
      groups.forEach(group => {
        expect(group.manufacturer).toBeDefined();
        expect(Array.isArray(group.platforms)).toBe(true);
        expect(group.platforms.length).toBeGreaterThan(0);
      });
    });
  });
});
