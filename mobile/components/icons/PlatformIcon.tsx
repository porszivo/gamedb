import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import SVG icons as React components
import PsxIcon from '@/assets/icons/platforms/psx.svg';
import Ps2Icon from '@/assets/icons/platforms/ps2.svg';
import Ps3Icon from '@/assets/icons/platforms/ps3.svg';
import XboxIcon from '@/assets/icons/platforms/xbox.svg';
import Xbox360Icon from '@/assets/icons/platforms/xbox360.svg';
import N64Icon from '@/assets/icons/platforms/n64.svg';
import GcIcon from '@/assets/icons/platforms/gc.svg';
import WiiIcon from '@/assets/icons/platforms/wii.svg';
import WiiUIcon from '@/assets/icons/platforms/wiiu.svg';
import Ds3Icon from '@/assets/icons/platforms/3ds.svg';
import N3dsIcon from '@/assets/icons/platforms/n3ds.svg';
import NesIcon from '@/assets/icons/platforms/nes.svg';
import SnesIcon from '@/assets/icons/platforms/snes.svg';
import GbIcon from '@/assets/icons/platforms/gb.svg';
import GbcIcon from '@/assets/icons/platforms/gbc.svg';
import GbaIcon from '@/assets/icons/platforms/gba.svg';
import DreamcastIcon from '@/assets/icons/platforms/dreamcast.svg';
import PcIcon from '@/assets/icons/platforms/pc.svg';

// Map of available SVG icon components
const platformIcons: Record<string, React.FC<any>> = {
  // PlayStation
  psx: PsxIcon,
  ps2: Ps2Icon,
  ps3: Ps3Icon,

  // Xbox
  xbox: XboxIcon,
  xbox360: Xbox360Icon,

  // Nintendo Modern
  n64: N64Icon,
  gc: GcIcon,
  wii: WiiIcon,
  wiiu: WiiUIcon,
  '3ds': Ds3Icon,
  n3ds: N3dsIcon,

  // Nintendo Classic
  nes: NesIcon,
  snes: SnesIcon,
  gb: GbIcon,
  gbc: GbcIcon,
  gba: GbaIcon,

  // Sega
  dreamcast: DreamcastIcon,

  // PC
  pc: PcIcon,
};

interface PlatformIconProps {
  platform: string;
  size?: number;
  color?: string;
}

export function PlatformIcon({ platform, size = 24, color = '#FFFFFF' }: PlatformIconProps) {
  const iconKey = getPlatformIconKey(platform);
  const SvgIcon = platformIcons[iconKey];

  // If we have a custom SVG, render it
  if (SvgIcon) {
    return <SvgIcon width={size} height={size} fill={color} />;
  }

  // Fallback to Material Icons for missing platforms
  return (
    <MaterialCommunityIcons
      name="controller"
      size={size}
      color={color}
    />
  );
}

// Map platform names to icon keys
function getPlatformIconKey(platformName: string): string {
  const name = platformName.toLowerCase();

  // PlayStation
  if (name.includes('playstation 5')) return 'ps5'; // Fallback to Material
  if (name.includes('playstation 4')) return 'ps4'; // Fallback to Material
  if (name.includes('playstation 3')) return 'ps3';
  if (name.includes('playstation 2')) return 'ps2';
  if (name === 'playstation' || name.includes('playstation 1')) return 'psx';
  if (name.includes('ps vita')) return 'vita'; // Fallback to Material

  // Xbox
  if (name.includes('xbox series')) return 'xboxseries'; // Fallback to Material
  if (name.includes('xbox one')) return 'xboxone'; // Fallback to Material
  if (name.includes('xbox 360')) return 'xbox360';
  if (name.includes('xbox')) return 'xbox';

  // Nintendo Modern
  if (name.includes('switch')) return 'switch'; // Fallback to Material
  if (name.includes('wii u')) return 'wiiu';
  if (name.includes('wii') && !name.includes('u')) return 'wii';
  if (name.includes('new nintendo 3ds') || name.includes('n3ds')) return 'n3ds';
  if (name.includes('3ds')) return '3ds';
  if (name.includes('gamecube')) return 'gc';

  // Nintendo Classic
  if (name.includes('nintendo 64') || name.includes('n64')) return 'n64';
  if (name.includes('super nintendo') || name.includes('snes') || name.includes('super famicom')) return 'snes';
  if (name.includes('nes') && !name.includes('super') && !name.includes('64')) return 'nes';
  if (name.includes('game boy advance') || name.includes('gba')) return 'gba';
  if (name.includes('game boy color') || name.includes('gbc')) return 'gbc';
  if (name.includes('game boy') || name.includes('gb')) return 'gb';

  // Sega
  if (name.includes('dreamcast')) return 'dreamcast';
  if (name.includes('genesis') || name.includes('mega drive')) return 'genesis'; // Fallback to Material
  if (name.includes('saturn')) return 'saturn'; // Fallback to Material

  // PC
  if (name.includes('pc')) return 'pc';

  // Others - all fallback to Material
  if (name.includes('atari')) return 'atari';
  if (name.includes('neo geo')) return 'neogeo';

  // Default
  return 'unknown';
}
