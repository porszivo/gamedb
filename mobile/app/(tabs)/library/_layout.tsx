import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {

  const router = useRouter();

  return <Stack
    screenOptions={{
      title: ""
    }}
  >
    <Stack.Screen name="index" />
    <Stack.Screen name="GameSearchScreen"/>
  </Stack>;
}
