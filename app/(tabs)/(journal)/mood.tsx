import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import { MoodSelector } from '../../../components/MoodSelector';
import { SoulseedDisplay } from '../../../components/SoulseedDisplay';
import { SoulseedData } from '../../../constants/userData';
import { Colors } from '@/constants/colors';

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
      title="How are you feeling?"
      showBackButton
    >
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
          moods={[
            { id: 'happy', emoji: '😊', label: 'Happy', color: '#FFD700' },
            { id: 'sad', emoji: '😢', label: 'Sad', color: '#4A90E2' },
            { id: 'angry', emoji: '😠', label: 'Angry', color: '#FF6B6B' },
            { id: 'surprised', emoji: '😲', label: 'Surprised', color: '#4ECDC4' },
            { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#95A5A6' },
          ]}
          onSelect={handleMoodSelect}
          selectedMood=""
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
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
