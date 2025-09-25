import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface StreakCounterProps {
  currentStreak: number;
}

export const StreakCounter = ({ currentStreak }: StreakCounterProps) => {
  return (
    <View style={styles.container}>
      <Flame size={20} color={Colors.accent} />
      <Text style={styles.streakText}>{currentStreak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 6,
  },
});