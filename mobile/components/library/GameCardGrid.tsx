import { Game } from '@/store/useGameStore';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameCardGridProps {
  game: Game;
  onPress: () => void;
  onQuickAction?: () => void;
  isFavorite?: boolean;
}
export function GameCardGrid({ game, onPress, onQuickAction, isFavorite = false }: GameCardGridProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        {game.coverUrl ? (
          <Image source={{ uri: game.coverUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.placeholderIcon}>🎮</Text>
          </View>
        )}

        {/* Favorite Badge */}
        {isFavorite && (
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteBadgeIcon}>⭐</Text>
          </View>
        )}

        {/* Quick Actions Overlay */}
        {onQuickAction && (
          <View style={styles.quickActionsOverlay}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={(e) => {
                e.stopPropagation();
                onQuickAction();
              }}
            >
              <Text style={styles.quickActionIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Game Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {game.name}
        </Text>
        {game.platforms.length > 0 && (
          <Text style={styles.platform} numberOfLines={1}>
            {game.platforms[0]}
            {game.platforms.length > 1 && ` +${game.platforms.length - 1}`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  coverContainer: {
    position: 'relative',
    aspectRatio: 0.7,
    backgroundColor: '#e9ecef',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f3f5',
  },
  placeholderIcon: {
    fontSize: 48,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  favoriteBadgeIcon: {
    fontSize: 14,
  },
  quickActionsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    alignItems: 'center',
    opacity: 0.9,
  },
  quickActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 14,
    color: '#2c3e50',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 18,
  },
  platform: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});