import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';
import { borderRadius, spacing, shadows } from '@/theme/tokens';

interface EmptyLibraryStateProps {
  onAddGames: () => void;
}

export function EmptyLibraryState({ onAddGames }: EmptyLibraryStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View testID="empty-library-state" style={styles.container}>
      <Text style={styles.icon}>🎮</Text>
      <Text style={styles.title}>No Games Yet</Text>
      <Text style={styles.text}>
        Start building your collection by adding games to your library
      </Text>
      <TouchableOpacity
        testID="empty-state-add-games-button"
        style={styles.button}
        onPress={onAddGames}
        accessibilityLabel="Spiele durchsuchen"
        accessibilityRole="button"
        accessibilityHint="Doppeltippen um zur Spielesuche zu gelangen"
      >
        <Text style={styles.buttonText}>Add Games</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.primary,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxxl,
    fontWeight: '400',
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
