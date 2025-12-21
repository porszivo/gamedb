import { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Game } from '@/store/useGameStore';
import { useTheme } from '@/theme/useTheme';

interface GameCardListProps {
  game: Game;
  onPress: () => void;
  onActionPress?: () => void;
  isFavorite?: boolean;
  addedDate?: string;
}

export function GameCardList({game, onPress, onActionPress, isFavorite = false, addedDate}: GameCardListProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Cover */}
      <View style={styles.coverContainer}>
        {game.coverUrl ? (
          <Image source={{uri: game.coverUrl}} style={styles.cover} resizeMode="cover"/>
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.placeholderIcon}>🎮</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {game.name}
          </Text>
          {isFavorite && <Text style={styles.favoriteIcon}>⭐</Text>}
        </View>
        {game.platforms.length > 0 && (
          <Text style={styles.platform}>
            {game.platforms.slice(0, 2).join(', ')}
            {game.platforms.length > 2 && ` +${game.platforms.length - 2}`}
          </Text>
        )}
        {addedDate && (
          <Text style={styles.date}>
            Hinzugefügt: {new Date(addedDate).toLocaleDateString('de-DE')}
          </Text>
        )}
      </View>

      {/* Actions */}
      {onActionPress && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onActionPress();
          }}
        >
          <Text style={styles.actionIcon}>⋯</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  coverContainer: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.tertiary,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tertiary,
  },
  placeholderIcon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  platform: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  actionIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
});