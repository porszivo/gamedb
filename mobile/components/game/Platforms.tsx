import { platform } from 'node:os';

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
  return Object.values(IGDBPlatform).filter(v => typeof v === 'number') as IGDBPlatform[];
};

// Type for search query
export interface GameSearchQuery {
  gameName: string;
  platform?: IGDBPlatform;
}

// Platform brand colors
export const getPlatformColor = (platformName: string): string => {
  const name = normalizePlatformName(platformName).toLowerCase();

  // Sony PlayStation - Blue
  if (name.includes('playstation') || name.includes('ps vita')) {
    return '#0070CC';
  }

  // Nintendo - Red
  if (name.includes('nintendo') || name.includes('switch') || name.includes('wii') ||
      name.includes('game boy') || name.includes('nes') || name.includes('snes')) {
    return '#E60012';
  }

  // Xbox - Green
  if (name.includes('xbox')) {
    return '#107C10';
  }

  // Sega - Blue
  if (name.includes('sega') || name.includes('dreamcast') || name.includes('genesis') || name.includes('saturn')) {
    return '#0089CF';
  }

  // Atari - Orange
  if (name.includes('atari')) {
    return '#FF6B35';
  }

  // Neo Geo - Yellow/Orange
  if (name.includes('neo geo')) {
    return '#FFA500';
  }

  // Default - Gray
  return '#9CA3AF';
};

// Normalize platform names (combine regional variants)
export const normalizePlatformName = (platformName: string): string => {
  const name = platformName.toLowerCase();

  // SNES = Super Nintendo = Super Famicom
  if (name.includes('super nintendo') || name.includes('super famicom') || name.includes('snes')) {
    return 'Super Nintendo';
  }

  // NES = Famicom
  if (name.includes('nes') && !name.includes('super') && !name.includes('64') || name === 'famicom') {
    return 'NES';
  }

  // Genesis = Mega Drive
  if (name.includes('genesis') || name.includes('mega drive')) {
    return 'Genesis';
  }

  // Return original name for others
  return platformName;
};

// Platform short names for badges
export const getPlatformShortName = (platformName: string): string => {
  const name = normalizePlatformName(platformName).toLowerCase();

  // PlayStation
  if (name.includes('playstation 5')) return 'PS5';
  if (name.includes('playstation 4')) return 'PS4';
  if (name.includes('playstation 3')) return 'PS3';
  if (name.includes('playstation 2')) return 'PS2';
  if (name === 'playstation' || name.includes('playstation 1')) return 'PSX';
  if (name.includes('ps vita')) return 'VITA';

  // Xbox
  if (name.includes('xbox series')) return 'XSX';
  if (name.includes('xbox one')) return 'XB1';
  if (name.includes('xbox 360')) return '360';
  if (name.includes('xbox')) return 'XB';

  // Nintendo Modern
  if (name.includes('switch')) return 'NSW';
  if (name.includes('wii u')) return 'WiiU';
  if (name.includes('wii') && !name.includes('u')) return 'Wii';
  if (name.includes('gamecube')) return 'NGC';
  if (name.includes('new nintendo 3ds') || name.includes('n3ds')) return 'N3DS';
  if (name.includes('3ds')) return '3DS';

  // Nintendo Classic
  if (name.includes('nintendo 64') || name.includes('n64')) return 'N64';
  if (name.includes('super nintendo') || name.includes('snes') || name.includes('super famicom')) return 'SNES';
  if (name.includes('nes') && !name.includes('super') && !name.includes('64')) return 'NES';
  if (name.includes('game boy advance') || name.includes('gba')) return 'GBA';
  if (name.includes('game boy color') || name.includes('gbc')) return 'GBC';
  if (name.includes('game boy') || name.includes('gb')) return 'GB';

  // Sega
  if (name.includes('dreamcast')) return 'DC';
  if (name.includes('genesis') || name.includes('mega drive')) return 'GEN';
  if (name.includes('saturn')) return 'SAT';

  // PC
  if (name.includes('pc')) return 'PC';

  // Others
  if (name.includes('atari')) return '2600';
  if (name.includes('neo geo')) return 'NG';

  // Default: first 3-4 chars uppercase
  return platformName.substring(0, 4).toUpperCase();
};