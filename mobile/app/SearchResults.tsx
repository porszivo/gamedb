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
import { Game, useGameStore } from '@/store/useGameStore';
import React from 'react';
import { router } from 'expo-router';
import GameCard from '@/components/game/GameCard';

export default function SearchResults() {

  const {searchResults, isSearching, addToLibrary} = useGameStore();

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
    <GameCard game={item} onPress={() => console.log('pressed')} onAddToLibrary={() => handleAddToLibrary(item)}
              showAddButton={true}/>
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
      >
        <Text style={styles.backButtonText}>← Neue Suche</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backIconButton}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {/* Results Count */}
      {!isSearching && searchResults.length > 0 && (
        <View style={styles.resultsCountContainer}>
          <View style={styles.resultsCountBadge}>
            <Text style={styles.resultsCountText}>
              {searchResults.length} {searchResults.length === 1 ? 'Spiel' : 'Spiele'} gefunden
            </Text>
          </View>
        </View>
      )}

      {/* Content */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db"/>
          <Text style={styles.loadingText}>Suche läuft...</Text>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#2c3e50',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  resultsCountContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  resultsCountBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#e8f6f3',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  resultsCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a085',
  },
  listContent: {
    padding: 20,
  },
  separator: {
    height: 16,
  },
  gameCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  gameCardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  coverContainer: {
    marginRight: 16,
  },
  coverImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    fontSize: 32,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  platformContainer: {
    marginBottom: 6,
  },
  platformText: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  releaseDate: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  summary: {
    fontSize: 13,
    color: '#95a5a6',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  detailsButtonText: {
    color: '#495057',
    fontSize: 15,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});