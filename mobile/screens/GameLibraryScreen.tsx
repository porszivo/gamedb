import { useMemo, useState } from 'react';
import { FlatList, SectionList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GameCardGrid } from '@/components/library/GameCardGrid';
import { GameCardList } from '@/components/library/GameCardList';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { EmptyLibraryState } from '@/components/library/EmptyLibraryState';
import { FloatingActionButton } from '@/components/library/FloatingActionButton';
import { Game, useGameStore } from '@/store/useGameStore';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';

interface PlatformSection {
  title: string;
  data: Game[];
}

export default function GameLibraryScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const { userLibrary, removeFromLibrary } = useGameStore();

  // Filter games by search query
  const filteredLibrary = useMemo(() => {
    if (!searchQuery.trim()) {
      return userLibrary;
    }
    const query = searchQuery.toLowerCase().trim();
    return userLibrary.filter(game =>
      game.name.toLowerCase().includes(query)
    );
  }, [userLibrary, searchQuery]);

  // Group games by their userPlatform
  const platformSections = useMemo((): PlatformSection[] => {
    if (filteredLibrary.length === 0) {
      return [];
    }

    const platformGamesMap = new Map<string, Game[]>();

    filteredLibrary.forEach(game => {
      const platform = game.userPlatform || 'Unbekannt';
      const existing = platformGamesMap.get(platform) || [];
      platformGamesMap.set(platform, [...existing, game]);
    });

    // Convert to sections array and sort alphabetically
    return Array.from(platformGamesMap.entries())
      .map(([title, data]) => ({ title, data }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredLibrary]);

  // Check if we should show categorized view (has sections)
  const showCategorizedView = platformSections.length > 0;

  const handleGamePress = (gameId: number) => {
    router.push(`/GameDetailScreen?id=${gameId}`);
  };

  const handleDeleteGame = (game: Game) => {
    removeFromLibrary(game.id, game.userPlatform);
  };

  const handleAddGames = () => {
    router.push('/(tabs)/library/GameSearchScreen')
  };

  return (
    <SafeAreaView style={styles.container}>
      <LibraryHeader
        gameCount={userLibrary.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {userLibrary.length === 0 ? (
        <EmptyLibraryState onAddGames={handleAddGames}/>
      ) : filteredLibrary.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsIcon}>🔍</Text>
          <Text style={styles.noResultsText}>Keine Spiele gefunden für "{searchQuery}"</Text>
        </View>
      ) : showCategorizedView ? (
        <SectionList
          sections={platformSections}
          renderItem={({item, section}) => {
            // For grid mode, only render on first item - we'll render all items in the header
            if (viewMode === 'grid') {
              const isFirstItem = section.data[0]?.id === item.id;
              if (!isFirstItem) return null;

              return (
                <View style={styles.gridRow}>
                  {section.data.map(game => (
                    <GameCardGrid
                      key={game.id}
                      game={game}
                      onPress={() => handleGamePress(game.id)}
                    />
                  ))}
                </View>
              );
            }

            return (
              <GameCardList
                game={item}
                onPress={() => handleGamePress(item.id)}
                onDelete={() => handleDeleteGame(item)}
              />
            );
          }}
          renderSectionHeader={({section}) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>{section.data.length}</Text>
            </View>
          )}
          keyExtractor={(item) => `${item.id}-${item.userPlatform}`}
          contentContainerStyle={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <FlatList
          data={filteredLibrary}
          renderItem={({item}) =>
            viewMode === 'grid' ? (
              <GameCardGrid
                game={item}
                onPress={() => handleGamePress(item.id)}
              />
            ) : (
              <GameCardList
                game={item}
                onPress={() => handleGamePress(item.id)}
                onDelete={() => handleDeleteGame(item)}
              />
            )
          }
          keyExtractor={(item) => `${item.id}-${item.userPlatform}`}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FloatingActionButton onPress={handleAddGames}/>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 100,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  listSeparator: {
    height: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    backgroundColor: colors.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});