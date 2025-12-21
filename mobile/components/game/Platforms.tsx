export enum IGDBPlatform {
  PC = 6,
  PLAYSTATION_5 = 167,
  PLAYSTATION_4 = 48,
  XBOX_SERIES = 169,
  XBOX_ONE = 49,
  NINTENDO_SWITCH = 130,

  PLAYSTATION_3 = 9,
  XBOX_360 = 12,
  WII = 5,
  WII_U = 41,
  NINTENDO_3DS = 37,
  PLAYSTATION_VITA = 46,

  NINTENDO_64 = 4,
  SUPER_NINTENDO = 19,
  PLAYSTATION_1 = 7,
  PLAYSTATION_2 = 8,
  DREAMCAST = 23,
  GAME_BOY_ADVANCE = 24,

  GAME_BOY = 33,
  GAME_BOY_COLOR = 22,
  NES = 18,              // Nintendo Entertainment System
  SEGA_GENESIS = 29,     // aka Mega Drive
  SEGA_SATURN = 32,
  ATARI_2600 = 59,
  NEO_GEO = 42,
}

// Display names for dropdowns
export const IGDBPlatformLabels: Record<IGDBPlatform, string> = {
  [IGDBPlatform.PC]: 'PC',
  [IGDBPlatform.PLAYSTATION_5]: 'PlayStation 5',
  [IGDBPlatform.PLAYSTATION_4]: 'PlayStation 4',
  [IGDBPlatform.XBOX_SERIES]: 'Xbox Series X|S',
  [IGDBPlatform.XBOX_ONE]: 'Xbox One',
  [IGDBPlatform.NINTENDO_SWITCH]: 'Nintendo Switch',
  [IGDBPlatform.PLAYSTATION_3]: 'PlayStation 3',
  [IGDBPlatform.XBOX_360]: 'Xbox 360',
  [IGDBPlatform.WII]: 'Nintendo Wii',
  [IGDBPlatform.WII_U]: 'Nintendo Wii U',
  [IGDBPlatform.NINTENDO_3DS]: 'Nintendo 3DS',
  [IGDBPlatform.PLAYSTATION_VITA]: 'PS Vita',
  [IGDBPlatform.NINTENDO_64]: 'Nintendo 64',
  [IGDBPlatform.SUPER_NINTENDO]: 'Super Nintendo',
  [IGDBPlatform.PLAYSTATION_1]: 'PlayStation',
  [IGDBPlatform.PLAYSTATION_2]: 'PlayStation 2',
  [IGDBPlatform.DREAMCAST]: 'Dreamcast',
  [IGDBPlatform.GAME_BOY_ADVANCE]: 'Game Boy Advance',
  [IGDBPlatform.GAME_BOY]: 'Game Boy',
  [IGDBPlatform.GAME_BOY_COLOR]: 'Game Boy Color',
  [IGDBPlatform.NES]: 'NES (Nintendo Entertainment System)',
  [IGDBPlatform.SEGA_GENESIS]: 'Sega Genesis / Mega Drive',
  [IGDBPlatform.SEGA_SATURN]: 'Sega Saturn',
  [IGDBPlatform.ATARI_2600]: 'Atari 2600',
  [IGDBPlatform.NEO_GEO]: 'Neo Geo',
};

// Helper functions
export const getPlatformLabel = (platform: IGDBPlatform): string => {
  return IGDBPlatformLabels[platform] || `Platform ${platform}`;
};

export const getAllPlatforms = (): IGDBPlatform[] => {
  const bla = Object.values(IGDBPlatform).filter(v => typeof v === 'number') as IGDBPlatform[];
  return bla;
};

// Type for search query
export interface GameSearchQuery {
  gameName: string;
  platform?: IGDBPlatform;
}