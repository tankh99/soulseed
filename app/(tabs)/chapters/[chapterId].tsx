import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import ScreenLayout from '@/components/ScreenLayout';
import { mockChapterData } from '@/constants/userData';
import { Chapter } from '@/data/chapters';
import { Feather, ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import JournalTimeline from '@/components/JournalTimeline';
import { fetchJournalEntries, JournalEntryRecord } from '@/services/api';

export default function ChapterDetailScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntryRecord[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    const foundChapter = mockChapterData.find(c => c.id === chapterId) ?? null;
    setChapter(foundChapter);

    if (!foundChapter) {
      setJournalEntries([]);
      setIsLoadingEntries(false);
      return () => {
        isMounted = false;
      };
    }

    const loadEntries = async () => {
      setIsLoadingEntries(true);
      try {
        const response = await fetchJournalEntries();
        if (isMounted && response.success) {
          setJournalEntries(response.entries);
        }
      } catch (error) {
        console.warn('Failed to load journal entries', error);
      } finally {
        if (isMounted) {
          setIsLoadingEntries(false);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    loadEntries();

    return () => {
      isMounted = false;
    };
  }, [chapterId, fadeAnim]);

  if (!chapter) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <Text style={styles.headerTitle}>Chapter not found</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout disableBottomSafeArea contentStyle={{ paddingBottom: 40 }}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Text style={styles.storyText}>{chapter.story}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chapter Summary</Text>
            <Text style={styles.bodyText}>{chapter.summary}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insights About You</Text>
            {chapter.insights.map((insight, index) => (
              <View key={index} style={styles.insightRow}>
                <Feather name="sparkles" size={16} color={Colors.secondary} style={styles.insightIcon} />
                <Text style={styles.bodyText}>{insight}</Text>
              </View>
            ))}
          </View>

          {isLoadingEntries ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator color={Colors.accent} />
            </View>
          ) : (
            <JournalTimeline entries={journalEntries} />
          )}

        </Animated.View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 16,
  },
  storyText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    flex: 1,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  insightIcon: {
    marginRight: 10,
    marginTop: 4,
  },
});
