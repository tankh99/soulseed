import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, ImageSourcePropType } from 'react-native';
import {Image} from 'expo-image'
import { Colors } from '@/constants/colors';
interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
  image: ImageSourcePropType;
}

interface MoodSelectorProps {
  moods: Mood[];
  selectedMood: string;
  onSelect: (moodId: string) => void;
}

export function MoodSelector({ moods, selectedMood, onSelect }: MoodSelectorProps) {
  return (
    // <ScrollView 
    //   horizontal
    //   showsHorizontalScrollIndicator={false}
    //   contentContainerStyle={styles.container}>
        <View style={styles.container}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.id}
          style={[
            styles.moodButton,
            selectedMood === mood.id && styles.selectedMood,
            { borderColor: mood.color }
          ]}
          onPress={() => onSelect(mood.id)}
          activeOpacity={0.7}
        >
          <Image
            style={styles.moodImage}
            source={mood.image}
          />
          <Text style={[
            styles.label,
            selectedMood === mood.id && styles.selectedLabel
          ]}>
            {mood.label}
          </Text> 
        </TouchableOpacity>
      ))}
      </View>
    // </ScrollView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
    // padding: 4,
  },
  moodImage: {
    width: 48,
    height: 48
  },
  selectedMood: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
    color: Colors.accent,
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});