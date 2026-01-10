import { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { GameCardGrid } from '@/components/library/GameCardGrid';
import { GameCardList } from '@/components/library/GameCardList';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { EmptyLibraryState } from '@/components/library/EmptyLibraryState';
import { FloatingActionButton } from '@/components/library/FloatingActionButton';
import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';

export default function GameLibraryScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const {userLibrary} = useGameStore();

  const handleGamePress = (gameId: number) => {
    router.push(`/GameDetailScreen?id=${gameId}`);
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
      ) : (
        <FlatList
          data={userLibrary}
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
              />
            )
          }
          keyExtractor={(item) => item.id.toString()}
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
    paddingBottom: 100, // Space for floating tab bar
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for floating tab bar
  },
  listSeparator: {
    height: 12,
  },
});