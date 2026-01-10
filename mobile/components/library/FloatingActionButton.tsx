import { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';
import { shadows } from '@/theme/tokens';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      testID="fab-add-games"
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Spiele hinzufügen"
      accessibilityRole="button"
      accessibilityHint="Doppeltippen um zur Spielesuche zu gelangen"
    >
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
