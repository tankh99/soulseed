import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../../../components/ScreenLayout';
import { SoulseedDisplay } from '../../../components/SoulseedDisplay';
import { SoulseedData } from '../../../constants/userData';

export default function JournalCompletePage() {
  const { mood, text } = useLocalSearchParams();

  useEffect(() => {
    // Auto-navigate back to mood selection after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenLayout contentStyle={styles.container}>
      <View style={styles.completeContainer}>
        <SoulseedDisplay 
          level={SoulseedData.level} 
          personality={SoulseedData.personality}
          size="large"
        />
        <Text style={styles.completeTitle}>Journal Saved! ✨</Text>
        <Text style={styles.completeSubtext}>
          Your soulseed grows stronger with each reflection
        </Text>
        <View style={styles.pointsEarned}>
          <Text style={styles.pointsText}>+25 points earned</Text>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  completeSubtext: {
    fontSize: 16,
    color: '#8B7BD8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  pointsEarned: {
    backgroundColor: 'rgba(232, 201, 136, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 136, 0.3)',
  },
  pointsText: {
    fontSize: 16,
    color: '#E8C988',
    fontWeight: '600',
  },
});
