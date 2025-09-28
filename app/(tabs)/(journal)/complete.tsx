import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import Button from '../../../components/Button';
import { Api, mockApi } from '@/services/api';
import { useAudioPlayer } from 'expo-audio';

const chimePlayerSource = require('../../../assets/sounds/chime.mp3');

type CopingCard = { title: string; description: string };

export default function JournalCompletePage() {
  const { mood, text } = useLocalSearchParams<{ mood?: string; text?: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [summary, setSummary] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [coping, setCoping] = useState<CopingCard[] | undefined>(undefined);
  const [pointsAwarded, setPointsAwarded] = useState<number | undefined>(undefined);

  const audio = useAudioPlayer(chimePlayerSource);
  const hasEnv = !!process.env.EXPO_PUBLIC_AI_BASE_URL;

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!text) return;
      setIsLoading(true);
      setErrorMsg(null);
      try {
        if (hasEnv) {
          const res = await Api.AI.getGuidance({ text, mood });
          if (cancelled) return;

          setSummary(res.summary ?? '');
          setStrengths(res.strengths ?? []);
          setSuggestions(res.suggestions ?? []);
          setCoping(
            res.immediateCoping?.map((c) => ({ title: c, description: '' })) ??
              [
                { title: 'Deep Breathing', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s — repeat 4 times.' },
              ],
          );
          setPointsAwarded(5);
        } else {
          const mock = await mockApi.submitJournalEntry(text, mood);
          if (cancelled) return;

          setSummary(mock.summary);
          setStrengths(mock.strengths);
          setSuggestions(mock.suggestions);
          setCoping(mock.coping);
          setPointsAwarded(mock.pointsAwarded);
        }

        audio.play();
      } catch (err: any) {
        setErrorMsg(err?.message ?? 'Something went wrong.');
      } finally {
        setIsLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [text, mood]);

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../../assets/images/evolve.png')} style={styles.hero} />
        <Text style={styles.title}>Reflection complete</Text>

        {isLoading ? (
          <View style={styles.card}>
            <ActivityIndicator />
            <Text style={styles.subtle}>Generating guidance…</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.card}>
            <Text style={styles.error}>Couldn’t generate guidance</Text>
            <Text style={styles.subtle}>{errorMsg}</Text>
          </View>
        ) : (
          <>
            {!!summary && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.body}>{summary}</Text>
              </View>
            )}

            {strengths?.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>What you did well</Text>
                {strengths.map((s, i) => (
                  <Text key={i} style={styles.bullet}>• {s}</Text>
                ))}
              </View>
            )}

            {suggestions?.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Suggestions</Text>
                {suggestions.map((s, i) => (
                  <Text key={i} style={styles.bullet}>• {s}</Text>
                ))}
              </View>
            )}

            {coping?.length ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Try this now</Text>
                {coping.map((c, i) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <Text style={styles.bullet}>• {c.title}</Text>
                    {!!c.description && <Text style={styles.subtle}>{c.description}</Text>}
                  </View>
                ))}
              </View>
            ) : null}

            {typeof pointsAwarded === 'number' && (
              <View style={styles.pointsBox}>
                <Text style={styles.pointsText}>+{pointsAwarded} points</Text>
              </View>
            )}

            <Button
              style={styles.button}
              title="Done"
              onPress={() => { /* keep your existing navigation */ }}
            />
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  hero: { width: '100%', height: 140, resizeMode: 'contain', marginTop: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#E8C988', marginTop: 8 },
  card: {
    padding: 16,
    backgroundColor: 'rgba(232, 201, 136, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 136, 0.2)',
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#E8C988', marginBottom: 6 },
  body: { fontSize: 16, color: '#f2e8cf' },
  bullet: { fontSize: 16, color: '#f2e8cf', marginBottom: 6 },
  subtle: { fontSize: 14, color: '#cabfa8', marginTop: 8 },
  error: { fontSize: 16, color: '#ffb4a2', fontWeight: '600', marginBottom: 4 },
  pointsBox: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 136, 0.3)',
    marginBottom: 40,
  },
  pointsText: { fontSize: 16, color: '#E8C988', fontWeight: '600' },
  button: { width: '100%' },
});
