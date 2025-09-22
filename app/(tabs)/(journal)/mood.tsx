import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import { MoodSelector } from '../../../components/MoodSelector';
import { SoulseedDisplay } from '../../../components/SoulseedDisplay';
import { SoulseedData } from '../../../constants/userData';
import { Colors } from '@/constants/colors';
import { MOODS } from '../../../constants/moods';

export default function MoodSelectionPage() {
  const handleMoodSelect = (mood: string) => {
    // Navigate to journal entry page with mood parameter
    router.push({
      pathname: '/(tabs)/(journal)/entry' as any,
      params: { mood }
    });
    // router.push("/(tabs)/" as any);
  };

  return (
    <ScreenLayout
      showBackButton
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>How are you feeling?</Text>
      </View>
      
      {/* Always visible soulseed at the top */}
      <View style={styles.topSoulseedContainer}>
        <SoulseedDisplay 
          level={SoulseedData.level} 
          personality={SoulseedData.personality}
          size="medium"
        />
      </View>

      <View style={styles.moodSection}>
        <Text style={styles.moodPrompt}>
          Your soulseed is curious about your current mood
        </Text>
        <MoodSelector 
          moods={MOODS}
          onSelect={handleMoodSelect}
          selectedMood=""
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topSoulseedContainer: {
    alignItems: 'center',
  },
  moodSection: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 48
  },
  moodPrompt: {
    fontSize: 18,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
});
