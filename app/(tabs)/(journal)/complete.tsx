import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import Button from '../../../components/Button';
import { mockApi } from '@/services/api';
import { MockQuests } from '@/constants/userData';
import { useAudioPlayer } from 'expo-audio';
import { MockMoodEntries } from '@/constants/userData';

const chimePlayerSource = require('../../../assets/sounds/chime.mp3');

export default function JournalCompletePage() {
  const { mood, text } = useLocalSearchParams<{ mood?: string; text?: string }>();
  const [coping, setCoping] = useState<Awaited<ReturnType<typeof mockApi.submitJournalEntry>>['coping']>();
  const [isLoading, setIsLoading] = useState(false);
  const chimePlayer = useAudioPlayer(chimePlayerSource);

  useEffect(() => {
    chimePlayer.play();
  }, []);

  useEffect(() => {
    if (!text) return;
    const run = async () => {
      setIsLoading(true);
      try {
        const response = await mockApi.submitJournalEntry({ text, mood: mood || '' });
        if (response.coping) {
          setCoping(response.coping);
        }
      } catch (error) {
        console.warn('Failed to fetch coping strategies', error);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [text, mood]);


  const handleCheckIn = () => {
    router.push('/(tabs)/(journal)/mood' as any);
  };

  return (
    <ScreenLayout contentStyle={styles.completeContainer} disableBottomSafeArea>
        <Image
          source={require("../../../assets/images/reactions/openness/journal_submitted.png")}
          style={styles.submittedImage}
        />
        <Text style={styles.completeTitle}>Journal Saved! ✨</Text>
        <Text style={styles.completeSubtext}>
          Your soulseed grows stronger with each reflection
        </Text>

        {coping && (
          <View style={styles.copingCard}>
            <Text style={styles.copingTitle}>Recommended coping strategies</Text>
            <Text style={styles.copingTheme}>{coping.theme}</Text>
            {coping.strategies.map((strategy, idx) => (
              <Text key={idx} style={styles.copingItem}>• {strategy}</Text>
            ))}
            {coping.followUpQuest && (
              <Text style={styles.followUp}>{coping.followUpQuest}</Text>
            )}
          </View>
        )}

        <View style={styles.pointsEarned}>
          <Text style={styles.pointsText}>+25 XP earned</Text>
        </View>

        <Button
          style={styles.button}
          textStyle={{textAlign: "center"}}
          title="Back to Home"
          onPress={() => {
            router.replace('/(tabs)/');
          }}
          variant="secondary"
          disabled={isLoading}
        />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
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
  copingCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
    marginBottom: 24,
  },
  copingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  copingTheme: {
    fontSize: 14,
    color: '#C3B4FF',
    marginBottom: 12,
  },
  copingItem: {
    fontSize: 14,
    color: '#8B7BD8',
    lineHeight: 20,
  },
  followUp: {
    fontSize: 13,
    color: '#FFB347',
    marginTop: 12,
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
  },
});
