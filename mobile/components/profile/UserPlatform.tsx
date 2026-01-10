import { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPlatformLabel, IGDBPlatform } from '@/components/game/Platforms';
import React from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';

type UserPlatformProps = {
  onShowPlatformPicker: () => void;
};

export default function UserPlatform({onShowPlatformPicker}: UserPlatformProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {userSettings, removePlatform} = useUserStore();

  const handleRemovePlatform = (platform: IGDBPlatform) => {
    Alert.alert(
      'Plattform entfernen',
      `Möchtest du "${getPlatformLabel(platform)}" wirklich entfernen?`,
      [
        {text: 'Abbrechen', style: 'cancel'},
        {
          text: 'Entfernen',
          style: 'destructive',
          onPress: () => removePlatform(platform),
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🎮</Text>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Meine Plattformen</Text>
          <Text style={styles.sectionSubtitle}>
            Wähle die Plattformen, die du besitzt
          </Text>
        </View>
      </View>

      {/* Selected Platforms */}
      {userSettings.platforms.length > 0 ? (
        <View style={styles.platformsList}>
          {userSettings.platforms.map((platform, index) => (
            <View key={platform}>
              <View style={styles.platformItem}>
                <View style={styles.platformItemLeft}>
                  <View style={styles.platformIcon}>
                    <Text style={styles.platformIconText}>🎮</Text>
                  </View>
                  <Text style={styles.platformName}>
                    {getPlatformLabel(platform as IGDBPlatform)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemovePlatform(platform)}
                  style={styles.removeButton}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                  <Text style={styles.removeButtonText}>Entfernen</Text>
                </TouchableOpacity>
              </View>
              {index < userSettings.platforms.length - 1 && (
                <View style={styles.platformSeparator}/>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyPlatforms}>
          <Text style={styles.emptyPlatformsIcon}>🎯</Text>
          <Text style={styles.emptyPlatformsText}>
            Noch keine Plattformen ausgewählt
          </Text>
          <Text style={styles.emptyPlatformsSubtext}>
            Füge deine erste Plattform hinzu
          </Text>
        </View>
      )}

      {/* Add Platform Button */}
      <TouchableOpacity
        style={styles.addPlatformButton}
        onPress={() => onShowPlatformPicker()}
        activeOpacity={0.7}
      >
        <Text style={styles.addPlatformButtonIcon}>+</Text>
        <Text style={styles.addPlatformButtonText}>
          Plattform hinzufügen
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  section: {
    backgroundColor: colors.secondary,
    marginTop: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  platformsList: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.secondary,
  },
  platformItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  platformIconText: {
    fontSize: 20,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.tertiary,
    borderWidth: 1,
    borderColor: colors.error,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  platformSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },
  emptyPlatforms: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyPlatformsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyPlatformsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptyPlatformsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addPlatformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addPlatformButtonIcon: {
    fontSize: 20,
    color: '#ffffff',
    marginRight: 8,
    fontWeight: '700',
  },
  addPlatformButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});