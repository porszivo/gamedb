import { useRef, useMemo } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Game } from '@/store/useGameStore';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';
import { borderRadius, spacing, shadows } from '@/theme/tokens';
import { getPlatformColor, getPlatformShortName, normalizePlatformName } from '@/components/game/Platforms';

interface GameCardListProps {
  game: Game;
  onPress: () => void;
  onDelete?: () => void;
  isFavorite?: boolean;
}

export function GameCardList({game, onPress, onDelete, isFavorite = false}: GameCardListProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const swipeableRef = useRef<Swipeable>(null);

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

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    const handleDelete = () => {
      swipeableRef.current?.close();
      onDelete?.();
    };

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={handleDelete}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="#FFFFFF" />
        </Animated.View>
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
          Löschen
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const cardContent = (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${game.name}${game.platforms?.length > 0 ? `, verfügbar auf ${game.platforms.join(', ')}` : ''}`}
      accessibilityRole="button"
      accessibilityHint="Doppeltippen um Details anzuzeigen"
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {game.coverUrl ? (
          <Image source={{uri: game.coverUrl}} style={styles.thumbnail} resizeMode="cover"/>
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.placeholderIcon}>🎮</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
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
              {normalizedPlatforms.slice(0, 3).map((platform, index) => (
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
              {normalizedPlatforms.length > 3 && (
                <Text style={styles.platformMore}>+{normalizedPlatforms.length - 3}</Text>
              )}
            </>
          ) : null}
        </View>
      </View>

      {/* Arrow */}
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={colors.textTertiary}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );

  // If no delete handler, render without swipeable
  if (!onDelete) {
    return cardContent;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
    >
      {cardContent}
    </Swipeable>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.tertiary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tertiary,
  },
  placeholderIcon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
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
    marginLeft: 2,
  },
  arrow: {
    marginLeft: spacing.sm,
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    marginLeft: spacing.sm,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});