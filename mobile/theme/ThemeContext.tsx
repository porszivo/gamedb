import { createContext } from 'react';
import { ThemeContextValue } from './types';
import { DARK_COLORS } from './colors';

export const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: DARK_COLORS,
  isDark: true,
  setThemeMode: () => {},
});
