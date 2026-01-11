import { useMemo } from 'react';
import { Game } from '@/store/useGameStore';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';
import { borderRadius, spacing, shadows } from '@/theme/tokens';
import { getPlatformColor, getPlatformShortName, normalizePlatformName } from '@/components/game/Platforms';

interface GameCardGridProps {
  game: Game;
  onPress: () => void;
}

export function GameCardGrid({ game, onPress }: GameCardGridProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Normalize and deduplicate platforms
  const normalizedPlatforms = useMemo(() => {
    const uniquePlatforms = new Map<string, string>();
    game.platforms.forEach(platform => {
      const normalized = normalizePlatformName(platform);
      if (!uniquePlatforms.has(normalized)) {
        uniquePlatforms.set(normalized, platform);
      }
    });
    return Array.from(uniquePlatforms.values());
  }, [game.platforms]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${game.name}${game.platforms?.length > 0 ? `, verfügbar auf ${game.platforms.join(', ')}` : ''}`}
      accessibilityRole="button"
      accessibilityHint="Doppeltippen um Details anzuzeigen"
    >
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        {game.coverUrl ? (
          <Image source={{ uri: game.coverUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.placeholderIcon}>🎮</Text>
          </View>
        )}
      </View>

      {/* Game Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {game.name}
        </Text>
        <View style={styles.platformContainer}>
          {game.userPlatform ? (
            // Show user's owned platform
            <View
              style={[
                styles.platformBadge,
                { backgroundColor: getPlatformColor(game.userPlatform) }
              ]}
            >
              <Text style={styles.platformText}>
                {getPlatformShortName(game.userPlatform)}
              </Text>
            </View>
          ) : normalizedPlatforms.length > 0 ? (
            // Fallback: show available platforms
            <>
              {normalizedPlatforms.slice(0, 2).map((platform, index) => (
                <View
                  key={index}
                  style={[
                    styles.platformBadge,
                    { backgroundColor: getPlatformColor(platform) }
                  ]}
                >
                  <Text style={styles.platformText}>
                    {getPlatformShortName(platform)}
                  </Text>
                </View>
              ))}
              {normalizedPlatforms.length > 2 && (
                <Text style={styles.platformMore}>+{normalizedPlatforms.length - 2}</Text>
              )}
            </>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '48%',
    margin: '1%',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  coverContainer: {
    width: '100%',
    aspectRatio: 0.7,
    backgroundColor: colors.tertiary,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tertiary,
  },
  placeholderIcon: {
    fontSize: 48,
  },
  info: {
    padding: spacing.md,
    backgroundColor: colors.secondary,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 20,
  },
  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  platformBadge: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  platformMore: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
  },
});