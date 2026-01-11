import React, { useState, useMemo } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useUserStore } from '@/store/useUserStore';
import {
  getPlatformLabel,
  getPlatformShortName,
  IGDBPlatform,
  PlatformManufacturer,
  PlatformsByManufacturer,
  getManufacturerColor,
} from '@/components/game/Platforms';
import UserPlatform from '@/components/profile/UserPlatform';
import { useTheme } from '@/theme/useTheme';
import { ThemeMode, ColorPalette } from '@/theme/types';
import { borderRadius, spacing } from '@/theme/tokens';

const LANGUAGES = [
  {code: 'de', label: '🇩🇪 Deutsch', flag: '🇩🇪'},
  {code: 'en', label: '🇬🇧 English', flag: '🇬🇧'},
];

const THEME_OPTIONS: Array<{mode: ThemeMode; label: string; icon: string}> = [
  {mode: 'light', label: 'Hell', icon: '☀️'},
  {mode: 'dark', label: 'Dunkel', icon: '🌙'},
  {mode: 'system', label: 'System', icon: '⚙️'},
];

export default function UserSettingsScreen() {
  const { colors, setThemeMode: changeTheme } = useTheme();
  const {
    userSettings,
    addPlatform,
    removePlatform,
    changeLanguage
  } = useUserStore();

  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<IGDBPlatform[]>([]);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
  };

  const handleOpenPlatformPicker = () => {
    setSelectedPlatforms([...userSettings.platforms]);
    setShowPlatformPicker(true);
  };

  const handleTogglePlatform = (platform: IGDBPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSavePlatforms = () => {
    // Remove platforms that were deselected
    userSettings.platforms.forEach(platform => {
      if (!selectedPlatforms.includes(platform)) {
        removePlatform(platform);
      }
    });
    // Add platforms that were newly selected
    selectedPlatforms.forEach(platform => {
      if (!userSettings.platforms.includes(platform)) {
        addPlatform(platform);
      }
    });
    setShowPlatformPicker(false);
  };

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

  // Get platforms grouped by manufacturer
  const platformGroups = useMemo(() => {
    return Object.entries(PlatformsByManufacturer).map(([manufacturer, platforms]) => ({
      manufacturer: manufacturer as PlatformManufacturer,
      platforms,
      color: getManufacturerColor(manufacturer as PlatformManufacturer),
    }));
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🌍</Text>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>Sprache</Text>
              <Text style={styles.sectionSubtitle}>
                Wähle deine bevorzugte Sprache
              </Text>
            </View>
          </View>

          <View style={styles.languageList}>
            {LANGUAGES.map((language) => {
              const isSelected = userSettings.language === language.code;
              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    isSelected && styles.languageOptionSelected,
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageLabel,
                      isSelected && styles.languageLabelSelected,
                    ]}
                  >
                    {language.label.split(' ')[1]}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkIcon}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🎨</Text>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>Design</Text>
              <Text style={styles.sectionSubtitle}>
                Wähle dein bevorzugtes Farbschema
              </Text>
            </View>
          </View>

          <View style={styles.languageList}>
            {THEME_OPTIONS.map((option) => {
              const isSelected = userSettings.themeMode === option.mode;
              return (
                <TouchableOpacity
                  key={option.mode}
                  style={[
                    styles.languageOption,
                    isSelected && styles.languageOptionSelected,
                  ]}
                  onPress={() => changeTheme(option.mode)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageFlag}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.languageLabel,
                      isSelected && styles.languageLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkIcon}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Platforms Section */}
        <UserPlatform onShowPlatformPicker={handleOpenPlatformPicker}/>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Tipp</Text>
            <Text style={styles.infoText}>
              Deine ausgewählten Plattformen helfen dir, relevante Spiele
              schneller zu finden und deine Sammlung zu organisieren.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Platform Picker Modal */}
      {showPlatformPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBackdrop}>
            <TouchableOpacity
              style={styles.modalBackdropTouchable}
              onPress={() => setShowPlatformPicker(false)}
              activeOpacity={1}
            />
          </View>

          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Plattformen auswählen</Text>
              <TouchableOpacity
                onPress={() => setShowPlatformPicker(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseIcon}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.platformPickerScrollView}>
              {platformGroups.map(({manufacturer, platforms, color}) => (
                <View key={manufacturer} style={styles.manufacturerSection}>
                  <View style={styles.manufacturerHeader}>
                    <View style={[styles.manufacturerDot, {backgroundColor: color}]} />
                    <Text style={styles.manufacturerTitle}>{manufacturer}</Text>
                  </View>

                  <View style={styles.platformGrid}>
                    {platforms.map(platform => {
                      const isSelected = selectedPlatforms.includes(platform);
                      return (
                        <TouchableOpacity
                          key={platform}
                          style={[
                            styles.platformChip,
                            isSelected && {backgroundColor: color},
                          ]}
                          onPress={() => handleTogglePlatform(platform)}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.platformChipText,
                            isSelected && styles.platformChipTextSelected,
                          ]}>
                            {getPlatformShortName(getPlatformLabel(platform))}
                          </Text>
                          {isSelected && (
                            <Text style={styles.platformChipCheck}>✓</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.selectedCount}>
                {selectedPlatforms.length} ausgewählt
              </Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePlatforms}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Fertig</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.secondary,
    marginTop: spacing.xl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
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
    fontWeight: '400',
  },
  languageList: {
    gap: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.tertiary,
    borderRadius: borderRadius.md,
  },
  languageOptionSelected: {
    backgroundColor: colors.surfaceVariant,
  },
  languageFlag: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  languageLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  languageLabelSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.tertiary,
    margin: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.warning,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalBackdropTouchable: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  modalContainer: {
    backgroundColor: colors.elevated,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    fontSize: 24,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  platformPickerList: {
    flex: 1,
  },
  platformPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  platformPickerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  platformPickerText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '400',
  },
  platformPickerSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  platformPickerScrollView: {
    maxHeight: 450,
  },
  noPlatformsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noPlatformsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noPlatformsText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  manufacturerSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  manufacturerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  manufacturerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  manufacturerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.tertiary,
    borderRadius: borderRadius.md,
    minWidth: 60,
  },
  platformChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  platformChipTextSelected: {
    color: '#FFFFFF',
  },
  platformChipCheck: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});