import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Game, useGameStore } from '@/store/useGameStore';
import React, { useMemo } from 'react';
import { router } from 'expo-router';
import GameCard from '@/components/game/GameCard';
import { useTheme } from '@/theme/useTheme';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '@/theme/tokens';
import { ColorPalette } from '@/theme/types';

export default function SearchResults() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { searchResults, isSearching, addToLibrary, error, clearError } = useGameStore();

  const handleAddToLibrary = (game: Game) => {
    addToLibrary(game);
    Alert.alert(
      '✓ Hinzugefügt',
      `${game.name} wurde zu deiner Bibliothek hinzugefügt`,
      [
        {text: 'OK'},
        {text: 'Zur Bibliothek', onPress: () => router.back()}
      ]
    );
  };

  const renderGameCard = ({item}: { item: Game }) => (
    <GameCard
      game={item}
      onPress={() => router.push(`/GameDetailScreen?id=${item.id}`)}
      onAddToLibrary={() => handleAddToLibrary(item)}
      showAddButton={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>Keine Ergebnisse gefunden</Text>
      <Text style={styles.emptyStateText}>
        Versuche es mit einem anderen Suchbegriff oder einer anderen Plattform
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityLabel="Zurück zur Suche"
        accessibilityRole="button"
      >
        <Text style={styles.backButtonText}>← Neue Suche</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>⚠️</Text>
      <Text style={styles.emptyStateTitle}>Fehler beim Laden</Text>
      <Text style={styles.emptyStateText}>
        {error || 'Es ist ein unerwarteter Fehler aufgetreten'}
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          clearError();
          router.back();
        }}
        accessibilityLabel="Zurück und erneut versuchen"
        accessibilityRole="button"
      >
        <Text style={styles.backButtonText}>← Erneut versuchen</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backIconButton}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        accessibilityLabel="Zurück"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Search Results</Text>
        {searchResults.length > 0 && !isSearching && (
          <Text style={styles.headerSubtitle}>
            {searchResults.length} {searchResults.length === 1 ? 'game' : 'games'} found
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      {/* Content */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent}/>
          <Text style={styles.loadingText}>Suche läuft...</Text>
        </View>
      ) : error ? (
        renderErrorState()
      ) : searchResults.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator}/>}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  headerContainer: {
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
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
  listContent: {
    padding: spacing.xl,
  },
  separator: {
    height: spacing.lg,
  },
  gameCard: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.md,
  },
  gameCardContent: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  coverContainer: {
    marginRight: spacing.lg,
  },
  coverImage: {
    width: 80,
    height: 100,
    borderRadius: borderRadius.sm,
  },
  coverPlaceholder: {
    width: 80,
    height: 100,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    fontSize: fontSize.huge,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  platformContainer: {
    marginBottom: 6,
  },
  platformText: {
    fontSize: fontSize.xs + 1,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  releaseDate: {
    fontSize: fontSize.xs + 1,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  summary: {
    fontSize: fontSize.xs + 1,
    color: colors.textTertiary,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: colors.tertiary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.md - 1,
    fontWeight: fontWeight.semibold,
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.md,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md - 1,
    fontWeight: fontWeight.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: fontSize.md - 1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  backButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});