import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';
import ScreenLayout from '@/components/ScreenLayout';
import { mockChapterData, mockLifeSummary } from '@/constants/userData';
import { Chapter } from '@/data/chapters';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ChaptersTOCScreen() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mock API call
    setChapters(mockChapterData);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleChapterPress = (chapterId: string) => {
    router.push(`/(tabs)/chapters/${chapterId}`);
  };

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <BookOpen size={28} color={Colors.accent} />
            <Text style={styles.headerTitle}>Table of Contents</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Story So Far</Text>
            <Text style={styles.summaryText}>{mockLifeSummary}</Text>
          </View>

          <View style={styles.tocContainer}>
            {chapters.map((chapter, index) => (
              <TouchableOpacity
                key={chapter.id}
                style={styles.chapterItem}
                onPress={() => handleChapterPress(chapter.id)}
              >
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterNumber}>Chapter {index + 1}</Text>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  {chapter.status === 'in_progress' && (
                    <View style={styles.inProgressBadge}>
                      <Text style={styles.inProgressText}>In Progress</Text>
                    </View>
                  )}
                </View>
                <ChevronRight size={24} color={Colors.secondary} />
              </TouchableOpacity>
            ))}
          </View>

        </Animated.View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  tocContainer: {
    marginHorizontal: 20,
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  chapterInfo: {
    flex: 1,
    marginRight: 16,
  },
  chapterNumber: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  inProgressBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  inProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
