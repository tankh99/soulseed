import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Heart, MessageCircle } from 'lucide-react-native';

interface WeeklyData {
  moodTrends: Array<{
    day: string;
    mood: string;
    score: number;
  }>;
  insights: string[];
  topics: Array<{
    topic: string;
    count: number;
  }>;
}

interface WeeklySummaryProps {
  data: WeeklyData;
}

export function WeeklySummary({ data }: WeeklySummaryProps) {
  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😮',
      neutral: '😐',
    };
    return moodMap[mood] || '😐';
  };

  const getMoodColor = (score: number) => {
    if (score >= 4) return '#4ADE80';
    if (score >= 3) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      {/* Mood Chart */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color="#8B7BD8" />
          <Text style={styles.sectionTitle}>Weekly Mood Journey</Text>
        </View>
        
        <View style={styles.moodChart}>
          {data.moodTrends.map((day, index) => (
            <View key={index} style={styles.moodDay}>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <View style={styles.moodBarContainer}>
                <LinearGradient
                  colors={[getMoodColor(day.score), `${getMoodColor(day.score)}80`]}
                  style={[
                    styles.moodBar,
                    { height: `${(day.score / 5) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.moodEmoji}>{getMoodEmoji(day.mood)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Heart size={20} color="#EC4899" />
          <Text style={styles.sectionTitle}>Insights</Text>
        </View>
        
        {data.insights.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <Text style={styles.insightText}>💡 {insight}</Text>
          </View>
        ))}
      </View>

      {/* Journal Topics */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MessageCircle size={20} color="#06B6D4" />
          <Text style={styles.sectionTitle}>What You Journaled About</Text>
        </View>
        
        <View style={styles.topicsGrid}>
          {data.topics.map((topic, index) => (
            <View key={index} style={styles.topicCard}>
              <Text style={styles.topicName}>{topic.topic}</Text>
              <Text style={styles.topicCount}>{topic.count} times</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  moodDay: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  dayLabel: {
    fontSize: 12,
    color: '#8B7BD8',
    marginBottom: 8,
  },
  moodBarContainer: {
    flex: 1,
    width: 20,
    backgroundColor: 'rgba(139, 123, 216, 0.2)',
    borderRadius: 10,
    justifyContent: 'flex-end',
  },
  moodBar: {
    width: '100%',
    borderRadius: 10,
    minHeight: 8,
  },
  moodEmoji: {
    fontSize: 16,
    marginTop: 8,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  insightText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  topicName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  topicCount: {
    fontSize: 12,
    color: '#8B7BD8',
  },
});