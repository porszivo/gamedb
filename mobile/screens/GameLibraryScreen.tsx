import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { GameCardGrid } from '@/components/library/GameCardGrid';
import { GameCardList } from '@/components/library/GameCardList';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { EmptyLibraryState } from '@/components/library/EmptyLibraryState';
import { FloatingActionButton } from '@/components/library/FloatingActionButton';
import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'expo-router';

const FILTER_OPTIONS = ['Alle', 'Favoriten', 'Kürzlich hinzugefügt'];

export default function GameLibraryScreen() {

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Alle');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const {userLibrary} = useGameStore();

  const handleGamePress = (gameId: number) => {
    console.log('Game pressed:', gameId);
  };

  const handleQuickAction = (gameId: number) => {
    console.log('Quick action:', gameId);
  };

  const handleAddGames = () => {
    router.push('library/GameSearchScreen')
  };

  return (
    <SafeAreaView style={styles.container}>
      <LibraryHeader
        gameCount={userLibrary.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        filterOptions={FILTER_OPTIONS}
        onFilterChange={setSelectedFilter}
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
                onQuickAction={() => handleQuickAction(item.id)}
              />
            ) : (
              <GameCardList
                game={item}
                onPress={() => handleGamePress(item.id)}
                onActionPress={() => handleQuickAction(item.id)}
              />
            )
          }
          keyExtractor={(item) => item.id.toString()}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}
          ItemSeparatorComponent={
            viewMode === 'list' ? () => <View style={styles.listSeparator}/> : undefined
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <FloatingActionButton onPress={handleAddGames}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  gridContainer: {
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  listSeparator: {
    height: 12,
  },
});