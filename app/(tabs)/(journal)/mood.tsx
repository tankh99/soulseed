import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import { MoodSelector } from '../../../components/MoodSelector';
import { SoulseedDisplay } from '../../../components/SoulseedDisplay';
import { SoulseedData } from '../../../constants/userData';

export default function MoodSelectionPage() {
  const handleMoodSelect = (mood: string) => {
    // Navigate to journal entry page with mood parameter
    router.push({
      pathname: '/journal/entry' as any,
      params: { mood }
    });
  };

  return (
    <ScreenLayout
      title="How are you feeling?"
      showBackButton={false}
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
    marginBottom: 32,
  },
  moodSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  moodPrompt: {
    fontSize: 18,
    color: '#8B7BD8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
});
