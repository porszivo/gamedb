import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useTheme } from '@/theme/useTheme';

export default function RootLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  return <Stack
    screenOptions={{
      title: "",
      headerShown: false,
      contentStyle: { backgroundColor: colors.primary }
    }}
  >
    <Stack.Screen name="index" />
    <Stack.Screen name="GameSearchScreen"/>
  </Stack>;
}
