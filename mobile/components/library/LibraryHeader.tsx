import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface LibraryHeaderProps {
  gameCount: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  filterOptions: string[];
  onFilterChange: (filter: string) => void;
}

export function LibraryHeader({
                                gameCount,
                                viewMode,
                                onViewModeChange,
                                searchQuery,
                                onSearchChange,
                                selectedFilter,
                                filterOptions,
                                onFilterChange,
                              }: LibraryHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Top Section */}
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.title}>Meine Bibliothek</Text>
          <Text style={styles.subtitle}>
            {gameCount} {gameCount === 1 ? 'Spiel' : 'Spiele'}
          </Text>
        </View>
        <View style={styles.viewModeButtons}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
            onPress={() => onViewModeChange('grid')}
          >
            <Text style={styles.viewModeIcon}>▦</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
            onPress={() => onViewModeChange('list')}
          >
            <Text style={styles.viewModeIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Spiele durchsuchen..."
          placeholderTextColor="#7f8c8d"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Text style={styles.searchClear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
            onPress={() => onFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  viewModeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: '#3498db',
  },
  viewModeIcon: {
    fontSize: 18,
    color: '#495057',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  searchClear: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  filterChipActive: {
    backgroundColor: '#e8f4f8',
    borderColor: '#3498db',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  filterChipTextActive: {
    color: '#3498db',
  },
});
