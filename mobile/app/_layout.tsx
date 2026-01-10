import { Stack } from 'expo-router';
import React from 'react';
import {StatusBar} from 'expo-status-bar';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useTheme } from '@/theme/useTheme';
import ErrorBoundary from '@/components/ErrorBoundary';

function ThemedStack() {
  const { isDark } = useTheme();

  return (
    <React.Fragment>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SearchResults"
          options={{
            presentation: "modal"
          }}
        />
      </Stack>
    </React.Fragment>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </ErrorBoundary>
  );
}