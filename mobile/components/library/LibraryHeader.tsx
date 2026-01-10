import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';
import { borderRadius, spacing, shadows } from '@/theme/tokens';

interface LibraryHeaderProps {
  gameCount: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function LibraryHeader({
                                gameCount,
                                viewMode,
                                onViewModeChange,
                                searchQuery,
                                onSearchChange,
                              }: LibraryHeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchToggle = () => {
    if (isSearchExpanded && searchQuery.length > 0) {
      onSearchChange('');
    }
    setIsSearchExpanded(!isSearchExpanded);
  };

  return (
    <View style={styles.header}>
      {/* Top Section */}
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.title}>My Games</Text>
          <Text style={styles.subtitle}>
            {gameCount} {gameCount === 1 ? 'game' : 'games'}
          </Text>
        </View>
        <View style={styles.viewModeButtons}>
          {/* Search Toggle Button */}
          <TouchableOpacity
            testID="search-toggle-button"
            style={[styles.viewModeButton, isSearchExpanded && styles.viewModeButtonActive]}
            onPress={handleSearchToggle}
            accessibilityLabel={isSearchExpanded ? "Suche schließen" : "Suche öffnen"}
            accessibilityRole="button"
            accessibilityState={{ selected: isSearchExpanded }}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={isSearchExpanded ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            testID="view-mode-grid-button"
            style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
            onPress={() => onViewModeChange('grid')}
            accessibilityLabel="Rasteransicht"
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === 'grid' }}
          >
            <MaterialCommunityIcons
              name="view-grid"
              size={20}
              color={viewMode === 'grid' ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            testID="view-mode-list-button"
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
            onPress={() => onViewModeChange('list')}
            accessibilityLabel="Listenansicht"
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === 'list' }}
          >
            <MaterialCommunityIcons
              name="view-list"
              size={20}
              color={viewMode === 'list' ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable Search Bar */}
      {isSearchExpanded && (
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            testID="library-search-input"
            style={styles.searchInput}
            placeholder="Spiele durchsuchen..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={onSearchChange}
            autoFocus
            accessibilityLabel="Suchfeld für Spiele in deiner Bibliothek"
            accessibilityHint="Tippe um deine Bibliothek zu durchsuchen"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              testID="search-clear-button"
              onPress={() => onSearchChange('')}
              accessibilityLabel="Suchtext löschen"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
  viewModeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: colors.accent,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tertiary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '400',
  },
});
