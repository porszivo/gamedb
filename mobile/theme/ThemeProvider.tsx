import React, { useEffect, useState, useMemo, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { ThemeContext } from './ThemeContext';
import { DARK_COLORS, LIGHT_COLORS } from './colors';
import { ThemeMode, ColorPalette } from './types';
import { useUserStore } from '@/store/useUserStore';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { userSettings, setThemeMode: saveThemeMode } = useUserStore();
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  // Compute active theme based on mode
  const activeTheme = useMemo(() => {
    const themeMode = userSettings.themeMode || 'dark';
    let isDark: boolean;
    let colors: ColorPalette;

    if (themeMode === 'system') {
      isDark = systemColorScheme === 'dark';
    } else {
      isDark = themeMode === 'dark';
    }

    colors = isDark ? DARK_COLORS : LIGHT_COLORS;

    return {
      mode: themeMode,
      colors,
      isDark,
    };
  }, [userSettings.themeMode, systemColorScheme]);

  const setThemeMode = (mode: ThemeMode) => {
    saveThemeMode(mode);
  };

  const contextValue = useMemo(
    () => ({
      ...activeTheme,
      setThemeMode,
    }),
    [activeTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
