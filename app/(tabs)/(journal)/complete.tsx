import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import Button from '../../../components/Button';
import { SoulseedDisplay } from '../../../components/SoulseedDisplay';
import { SoulseedData } from '../../../constants/userData';

export default function JournalCompletePage() {
  const { mood, text } = useLocalSearchParams();

  

  return (
    <ScreenLayout contentStyle={styles.container}>
      <View style={styles.completeContainer}>
        <Image
          source={require("../../../assets/images/reactions/openness/journal_submitted.png")}
          style={styles.submittedImage}
        />
        <Text style={styles.completeTitle}>Journal Saved! ✨</Text>
        <Text style={styles.completeSubtext}>
          Your soulseed grows stronger with each reflection
        </Text>
        <View style={styles.pointsEarned}>
          <Text style={styles.pointsText}>+25 XP earned</Text>
        </View>
        <Button 
          style={styles.button}
          
          title="Back to Home" 
          onPress={() => router.replace('/(tabs)/')} 
          variant="secondary"
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeContainer: {
    alignItems: 'center',
    padding: 24,
  },
  submittedImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 24,
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
    marginBottom: 40,
  },
  pointsText: {
    fontSize: 16,
    color: '#E8C988',
    fontWeight: '600',
  },
  button: {
    width: '100%',
  }
});
