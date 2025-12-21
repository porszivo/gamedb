export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorPalette {
  // Backgrounds
  primary: string;
  secondary: string;
  tertiary: string;
  elevated: string;
  surface: string;
  surfaceVariant: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;

  // Accents
  accent: string;
  accentHover: string;
  accentPressed: string;

  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;

  // Structure
  border: string;
  borderLight: string;
  divider: string;

  // Special
  overlay: string;
  ripple: string;
  shadow: string;

  // Component-specific
  genreTagBg: string;
  genreTagBorder: string;
  genreTagText: string;
  platformBg: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ColorPalette;
  isDark: boolean;
}

export interface ThemeContextValue extends Theme {
  setThemeMode: (mode: ThemeMode) => void;
}
