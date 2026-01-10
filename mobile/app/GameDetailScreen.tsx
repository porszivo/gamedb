import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';
import { borderRadius, spacing, shadows } from '@/theme/tokens';
import { useGameStore, Game } from '@/store/useGameStore';
import { getPlatformColor, getPlatformShortName, normalizePlatformName } from '@/components/game/Platforms';

export default function GameDetailScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const params = useLocalSearchParams();

  const { userLibrary, searchResults, addToLibrary, removeFromLibrary } = useGameStore();

  // Find game from library or search results
  const gameId = Number(params.id);
  const game = useMemo(() => {
    return userLibrary.find(g => g.id === gameId) ||
           searchResults.find(g => g.id === gameId);
  }, [gameId, userLibrary, searchResults]);

  const isInLibrary = useMemo(() => {
    return userLibrary.some(g => g.id === gameId);
  }, [gameId, userLibrary]);

  // Normalize and deduplicate platforms
  const normalizedPlatforms = useMemo(() => {
    if (!game) return [];
    const uniquePlatforms = new Map<string, string>();
    game.platforms.forEach(platform => {
      const normalized = normalizePlatformName(platform);
      if (!uniquePlatforms.has(normalized)) {
        uniquePlatforms.set(normalized, platform);
      }
    });
    return Array.from(uniquePlatforms.values());
  }, [game?.platforms]);

  const handleAddToLibrary = () => {
    if (!game) return;
    addToLibrary(game);
    Alert.alert(
      '✓ Added',
      `${game.name} has been added to your library`,
      [{ text: 'OK' }]
    );
  };

  const handleRemoveFromLibrary = () => {
    if (!game) return;
    Alert.alert(
      'Remove from Library',
      `Are you sure you want to remove "${game.name}" from your library?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeFromLibrary(game.id);
            router.back();
          },
        },
      ]
    );
  };

  if (!game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Game not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const releaseYear = game.releaseDate
    ? new Date(game.releaseDate).getFullYear()
    : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backIconButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Game Details</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <View style={styles.coverSection}>
          {game.coverUrl ? (
            <Image
              source={{ uri: game.coverUrl }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <MaterialCommunityIcons
                name="controller"
                size={80}
                color={colors.textTertiary}
              />
            </View>
          )}
        </View>

        {/* Game Info */}
        <View style={styles.infoSection}>
          {/* Title */}
          <Text style={styles.gameTitle}>{game.name}</Text>

          {/* Release Year */}
          {releaseYear && (
            <View style={styles.metaRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>{releaseYear}</Text>
            </View>
          )}

          {/* Platforms */}
          {normalizedPlatforms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Platforms</Text>
              <View style={styles.platformsContainer}>
                {normalizedPlatforms.map((platform, index) => (
                  <View
                    key={index}
                    style={[
                      styles.platformBadge,
                      { backgroundColor: getPlatformColor(platform) }
                    ]}
                  >
                    <Text style={styles.platformShortText}>
                      {getPlatformShortName(platform)}
                    </Text>
                    <Text style={styles.platformText}>
                      {normalizePlatformName(platform)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Genres */}
          {game.genres && game.genres.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genres</Text>
              <View style={styles.genresContainer}>
                {game.genres.map((genre, index) => (
                  <View key={index} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Summary */}
          {game.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.summary}>{game.summary}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionBar}>
        {isInLibrary ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={handleRemoveFromLibrary}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.actionButtonText}>Remove from Library</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={handleAddToLibrary}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.actionButtonText}>Add to Library</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  coverSection: {
    width: '100%',
    aspectRatio: 0.7,
    backgroundColor: colors.tertiary,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tertiary,
  },
  infoSection: {
    padding: spacing.xl,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.lg,
  },
  metaText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  platformsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 8,
  },
  platformShortText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: colors.genreTagBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.genreTagBorder,
  },
  genreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.genreTagText,
  },
  summary: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontWeight: '400',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    backgroundColor: colors.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.xl + 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: 8,
    ...shadows.md,
  },
  addButton: {
    backgroundColor: colors.accent,
  },
  removeButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  backButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
