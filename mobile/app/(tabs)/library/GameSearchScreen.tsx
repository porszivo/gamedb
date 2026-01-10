import React, { useState, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { getAllPlatforms, getPlatformLabel, IGDBPlatform } from '@/components/game/Platforms';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { ColorPalette } from '@/theme/types';

export default function GameSearchScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {control, handleSubmit, formState: {errors}} = useForm();
  const [selectedPlatform, setSelectedPlatform] = useState<IGDBPlatform | null>(null);
  const {isSearching, searchGames, error} = useGameStore();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const results = await searchGames(data.gamename, selectedPlatform ? selectedPlatform.toString() : undefined);
    if (results.length > 0) router.navigate('/SearchResults');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Game</Text>
          <Text style={styles.subtitle}>Search for games to add to your library</Text>
        </View>
        <View style={styles.form}>
          {/* Spielname Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Spielname</Text>
            <Controller
              control={control}
              name="gamename"
              rules={{
                required: 'Bitte gib einen Spielnamen ein',
                minLength: {
                  value: 2,
                  message: 'Der Spielname muss mindestens 2 Zeichen haben'
                }
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  testID="game-search-input"
                  style={[
                    styles.textInput,
                    errors.gamename && styles.textInputError
                  ]}
                  onChangeText={onChange}
                  value={value}
                  placeholder="z.B. Super Mario Bros"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
                  accessibilityLabel="Spielname Eingabefeld"
                  accessibilityHint="Gib den Namen des Spiels ein, das du suchen möchtest"
                />
              )}
            />
            {errors.gamename && (
              <Text style={styles.errorText}>
                {errors.gamename.message as string}
              </Text>
            )}
          </View>

          {/* Platform Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Plattform (optional)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPlatform}
                onValueChange={(itemValue) => setSelectedPlatform(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item
                  label="🎮 Alle Plattformen"
                  value={null}
                  color="#666"
                />
                {getAllPlatforms().map(platform => (
                  <Picker.Item
                    key={platform}
                    label={getPlatformLabel(platform)}
                    value={platform}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            testID="search-submit-button"
            style={[
              styles.submitButton,
              isSearching && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSearching}
            activeOpacity={0.8}
            accessibilityLabel="Spiele suchen"
            accessibilityRole="button"
            accessibilityHint="Doppeltippen um die Suche zu starten"
            accessibilityState={{ disabled: isSearching }}
          >
            <Text style={styles.submitButtonText}>
              {isSearching ? '🔍 Suche läuft...' : '🚀 Spiele suchen'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Tipps für bessere Suchergebnisse</Text>
          <Text style={styles.infoText}>
            • Verwende den vollständigen oder einen Teil des Spielnamens{'\n'}
            • Wähle die richtige Plattform aus{'\n'}
            • Probiere verschiedene Schreibweisen aus
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  form: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: colors.tertiary,
    color: colors.textPrimary,
  },
  textInputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.tertiary,
    overflow: 'hidden',
  },
  picker: {
    height: 100,
    color: colors.textPrimary,
  },
  pickerItem: {
    height: 100,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textTertiary,
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});