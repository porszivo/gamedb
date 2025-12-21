import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useUserStore } from '@/store/useUserStore';
import { getAllPlatforms, getPlatformLabel, IGDBPlatform } from '@/components/game/Platforms';
import UserPlatform from '@/components/profile/UserPlatform';

const LANGUAGES = [
  {code: 'de', label: '🇩🇪 Deutsch', flag: '🇩🇪'},
  {code: 'en', label: '🇬🇧 English', flag: '🇬🇧'},
];

export default function UserSettingsScreen() {

  const {
    userSettings,
    addPlatform,
    removePlatform,
    changeLanguage
  } = useUserStore();

  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
  };

  const handleShowPlatformPicker = () => {
    setShowPlatformPicker(true);
  };

  const handleAddPlatform = (platform: IGDBPlatform) => {
    addPlatform(platform);
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

  const availablePlatforms = getAllPlatforms().filter(
    (platform) => !userSettings.platforms.includes(platform)
  );

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        style={styles.content}
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

        {/* Platforms Section */}
        <UserPlatform onShowPlatformPicker={() => setShowPlatformPicker(true)}/>

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
          <View style={styles.modalBackdrop}>r
            <TouchableOpacity
              style={styles.modalBackdropTouchable}
              onPress={() => setShowPlatformPicker(false)}
              activeOpacity={1}
            />
          </View>

          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Plattform auswählen</Text>
              <TouchableOpacity
                onPress={() => setShowPlatformPicker(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseIcon}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.platformPickerScrollView}>
              {availablePlatforms.length > 0 ? (
                availablePlatforms.map((platform, index) => (
                  <React.Fragment key={platform}>
                    <TouchableOpacity
                      style={styles.platformPickerItem}
                      onPress={() => handleAddPlatform(platform)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.platformPickerIcon}>🎮</Text>
                      <Text style={styles.platformPickerText}>
                        {getPlatformLabel(platform as IGDBPlatform)}
                      </Text>
                    </TouchableOpacity>
                    {index < availablePlatforms.length - 1 && (
                      <View style={styles.platformPickerSeparator}/>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <View style={styles.noPlatformsContainer}>
                  <Text style={styles.noPlatformsIcon}>✓</Text>
                  <Text style={styles.noPlatformsText}>
                    Alle Plattformen wurden bereits hinzugefügt!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#2c3e50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
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
    color: '#2c3e50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  languageList: {
    gap: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionSelected: {
    backgroundColor: '#e8f4f8',
    borderColor: '#3498db',
  },
  languageFlag: {
    fontSize: 28,
    marginRight: 12,
  },
  languageLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  languageLabelSelected: {
    color: '#2c3e50',
    fontWeight: '700',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff8e1',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
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
    color: '#f57f17',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6d4c41',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    fontSize: 24,
    color: '#495057',
    fontWeight: '600',
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
    color: '#2c3e50',
    fontWeight: '500',
  },
  platformPickerSeparator: {
    height: 1,
    backgroundColor: '#e1e8ed',
    marginLeft: 56,
  },
  platformPickerScrollView: {
    maxHeight: 400, // Feste Max-Höhe
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
    color: '#7f8c8d',
    textAlign: 'center',
  }
});