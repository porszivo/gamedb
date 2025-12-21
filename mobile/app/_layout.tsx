import { Stack } from 'expo-router';
import React from 'react';
import {StatusBar} from 'expo-status-bar';

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style="auto"/>
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