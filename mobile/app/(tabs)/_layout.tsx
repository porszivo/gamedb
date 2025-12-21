import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

export default function BottomTabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.border,
        },
      }}
      backBehavior="order">
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          headerShown: false,
          tabBarLabel: 'Library',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="library" size={size} color={color}/>
          )
        }}/>
      <Tabs.Screen
        name="UserSettingsScreen"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="cog-outline" size={size} color={color}/>
          )
        }}/>
    </Tabs>
  );
}