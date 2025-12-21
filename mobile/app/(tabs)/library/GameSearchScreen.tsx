import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { getAllPlatforms, getPlatformLabel, IGDBPlatform } from '@/components/game/Platforms';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'expo-router';

export default function GameSearchScreen() {
  const {control, handleSubmit, formState: {errors}} = useForm();
  const [selectedPlatform, setSelectedPlatform] = useState<IGDBPlatform | null>(null);
  const {isSearching, searchGames, error} = useGameStore();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const results = await searchGames(data.gamename, selectedPlatform ? getPlatformLabel(selectedPlatform) : undefined);
    if (results.length > 0) router.navigate('/SearchResults');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🎮 Spiele Suche</Text>
          <Text style={styles.subtitle}>Finde deine Lieblingsspiele</Text>
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
                  style={[
                    styles.textInput,
                    errors.gamename && styles.textInputError
                  ]}
                  onChangeText={onChange}
                  value={value}
                  placeholder="z.B. Super Mario Bros"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
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
            style={[
              styles.submitButton,
              isSearching && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSearching}
            activeOpacity={0.8}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2c3e50',
  },
  textInputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  picker: {
    height: 100, // Mehr Höhe für iOS
    color: '#2c3e50',
  },
  pickerItem: {
    height: 100, // iOS-spezifische Höhe für Items
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#e8f6f3',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1abc9c',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a085',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
});