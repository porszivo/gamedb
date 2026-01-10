import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Game } from '@/store/useGameStore';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';
import { useMemo } from 'react';
import { borderRadius, spacing, shadows } from '@/theme/tokens';
import { getPlatformColor, getPlatformShortName, normalizePlatformName } from '@/components/game/Platforms';

type GameCardProps = {
  game: Game,
  onAddToLibrary?: () => void,
  onPress?: () => void,
  showAddButton?: boolean
}
export default function GameCard({
                                   game,
                                   onPress,
                                   onAddToLibrary,
                                   showAddButton = true
                                 }: GameCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const releaseYear = game.releaseDate
    ? new Date(game.releaseDate).getFullYear()
    : null;

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
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{color: colors.ripple}}
    >
      {/* Cover Image mit Gradient Overlay */}
      <View style={styles.coverSection}>
        {game.coverUrl ? (
          <>
            <Image
              source={{uri: game.coverUrl}}
              style={styles.coverImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
          </>
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.placeholderIcon}>🎮</Text>
            <Text style={styles.placeholderText}>Kein Cover</Text>
          </View>
        )}

        {/* Release Year Badge */}
        {releaseYear && (
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{releaseYear}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {game.name}
        </Text>

        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <View style={styles.genresContainer}>
            {game.genres.slice(0, 3).map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Platforms */}
        {normalizedPlatforms.length > 0 && (
          <View style={styles.platformsContainer}>
            {normalizedPlatforms.slice(0, 4).map((platform, index) => (
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
            {normalizedPlatforms.length > 4 && (
              <Text style={styles.platformMore}>+{normalizedPlatforms.length - 4}</Text>
            )}
          </View>
        )}

        {/* Summary */}
        {game.summary && (
          <Text style={styles.summary} numberOfLines={3}>
            {game.summary}
          </Text>
        )}

        {/* Action Button */}
        {showAddButton && onAddToLibrary && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              onAddToLibrary();
            }}
            activeOpacity={0.8}
          >
            <View style={styles.addButtonContent}>
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Add</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  coverSection: {
    position: 'relative',
    height: 200,
    backgroundColor: colors.tertiary,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  yearBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  yearText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  genreTag: {
    backgroundColor: colors.genreTagBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.genreTagBorder,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.genreTagText,
  },
  platformsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  platformBadge: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  platformMore: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  summary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  addButtonIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: spacing.sm,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});