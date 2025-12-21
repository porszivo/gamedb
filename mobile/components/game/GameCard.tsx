import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Game } from '@/store/useGameStore';

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

  const releaseYear = game.releaseDate
    ? new Date(game.releaseDate).getFullYear()
    : null;

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{color: 'rgba(52, 152, 219, 0.1)'}}
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
        {game.platforms && game.platforms.length > 0 && (
          <View style={styles.platformsContainer}>
            <Text style={styles.platformsLabel}>🎮</Text>
            <Text style={styles.platformsText} numberOfLines={1}>
              {game.platforms.slice(0, 2).join(' • ')}
              {game.platforms.length > 2 && ` +${game.platforms.length - 2}`}
            </Text>
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
              <Text style={styles.addButtonText}>Zur Bibliothek</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  coverSection: {
    position: 'relative',
    height: 200,
    backgroundColor: '#1a1a2e',
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
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backdropFilter: 'blur(10px)',
  },
  yearText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 12,
    lineHeight: 26,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  genreTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c2e0ec',
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c7a9e',
  },
  platformsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  platformsLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  platformsText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
  },
  summary: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#3498db',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  addButtonIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});