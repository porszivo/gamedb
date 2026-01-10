import { View, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';
import { useMemo } from 'react';
import { spacing, fontSize, fontWeight, shadows, borderRadius } from '@/theme/tokens';
import { ColorPalette } from '@/theme/types';
import * as Haptics from 'expo-haptics';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const handleTabPress = (route: any, index: number, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // Haptic Feedback für Retro-Gaming Feel
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <View style={styles.tabBarContent}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            // Icon mapping
            let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'help';
            if (route.name === 'library') {
              iconName = 'controller-classic';
            } else if (route.name === 'UserSettingsScreen') {
              iconName = 'account-cog';
            }

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={() => handleTabPress(route, index, isFocused)}
                style={styles.tabButton}
                activeOpacity={0.8}
              >
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={24}
                    color={isFocused ? colors.accent : colors.textTertiary}
                  />
                </View>

                {/* Label */}
                <Text
                  style={[
                    styles.label,
                    isFocused && styles.labelActive
                  ]}
                  numberOfLines={1}
                >
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ColorPalette, isDark: boolean) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    ...shadows.sm,
  },
  tabBarContent: {
    flexDirection: 'row',
    height: 60,
    paddingTop: spacing.xs,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
    marginTop: 2,
  },
  labelActive: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
    color: colors.accent,
  },
});
