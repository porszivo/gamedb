import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { CustomTabBar } from '@/components/CustomTabBar';

export default function BottomTabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      backBehavior="order"
    >
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarLabel: 'Library',
          tabBarAccessibilityLabel: 'Switch to Library',
        }}
      />
      <Tabs.Screen
        name="UserSettingsScreen"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarAccessibilityLabel: 'Switch to Settings',
        }}
      />
    </Tabs>
  );
}