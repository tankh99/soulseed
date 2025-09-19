import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Book, Heart, TrendingUp, Calendar } from 'lucide-react-native';
import { WeeklySummary } from '../../components/WeeklySummary';
import { TraitCard } from '../../components/TraitCard';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [activeTab, setActiveTab] = useState<'summary' | 'traits' | 'tips'>('summary');

  const traitInfo = [
    {
      name: 'Openness',
      score: 0.8,
      description: 'Your imagination and curiosity about the world',
      color: '#8B7BD8',
      icon: '🎨',
      tips: [
        'Try creative writing in your journal',
        'Explore new perspectives on familiar topics',
        'Ask "what if" questions more often'
      ]
    },
    {
      name: 'Conscientiousness',
      score: 0.6,
      description: 'Your organization and self-discipline',
      color: '#4ADE80',
      icon: '📋',
      tips: [
        'Set small, achievable daily goals',
        'Use your journal to track habits',
        'Celebrate small wins along the way'
      ]
    },
    {
      name: 'Extroversion',
      score: 0.7,
      description: 'Your energy around others and social situations',
      color: '#F59E0B',
      icon: '🎉',
      tips: [
        'Journal about social interactions',
        'Reflect on group vs. solo activities',
        'Notice your energy patterns'
      ]
    },
    {
      name: 'Agreeableness',
      score: 0.9,
      description: 'Your tendency to be cooperative and trusting',
      color: '#EC4899',
      icon: '🤝',
      tips: [
        'Practice setting healthy boundaries',
        'Journal about your needs and wants',
        'Celebrate your caring nature'
      ]
    },
    {
      name: 'Resilience',
      score: 0.3,
      description: 'Your emotional stability and stress response',
      color: '#06B6D4',
      icon: '🧘',
      tips: [
        'Use journaling during stressful times',
        'Practice gratitude regularly',
        'Notice your coping strategies'
      ]
    },
  ];

  const weeklyData = {
    moodTrends: [
      { day: 'Mon', mood: 'happy', score: 4 },
      { day: 'Tue', mood: 'neutral', score: 3 },
      { day: 'Wed', mood: 'sad', score: 2 },
      { day: 'Thu', mood: 'happy', score: 5 },
      { day: 'Fri', mood: 'surprised', score: 4 },
      { day: 'Sat', mood: 'happy', score: 5 },
      { day: 'Sun', mood: 'neutral', score: 3 },
    ],
    insights: [
      'You tend to feel happiest on weekends',
      'Wednesday seems to be your most challenging day',
      'Your mood improved significantly this week'
    ],
    topics: [
      { topic: 'School stress', count: 3 },
      { topic: 'Friendship', count: 2 },
      { topic: 'Family time', count: 4 },
      { topic: 'Future goals', count: 1 }
    ]
  };

  return (
    <LinearGradient colors={['#2D1B69', '#1A0B3D']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Yourself</Text>
        <Text style={styles.subtitle}>Insights from your journey</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
          onPress={() => setActiveTab('summary')}
        >
          <Calendar size={18} color={activeTab === 'summary' ? '#1A0B3D' : '#8B7BD8'} />
          <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'traits' && styles.activeTab]}
          onPress={() => setActiveTab('traits')}
        >
          <Book size={18} color={activeTab === 'traits' ? '#1A0B3D' : '#8B7BD8'} />
          <Text style={[styles.tabText, activeTab === 'traits' && styles.activeTabText]}>
            Personality
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          onPress={() => setActiveTab('tips')}
        >
          <Heart size={18} color={activeTab === 'tips' ? '#1A0B3D' : '#8B7BD8'} />
          <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
            Growth
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'summary' && (
          <WeeklySummary data={weeklyData} />
        )}

        {activeTab === 'traits' && (
          <View style={styles.traitsContent}>
            <Text style={styles.sectionTitle}>Your OCEAN Personality</Text>
            <Text style={styles.sectionDescription}>
              Understanding your unique combination of traits can help you grow and thrive. 
              Remember, every trait has its strengths! 🌟
            </Text>
            {traitInfo.map((trait, index) => (
              <TraitCard key={index} trait={trait} />
            ))}
          </View>
        )}

        {activeTab === 'tips' && (
          <View style={styles.tipsContent}>
            <Text style={styles.sectionTitle}>Personal Growth Tips</Text>
            <Text style={styles.sectionDescription}>
              Based on your personality and journaling patterns, here are some ways to continue growing:
            </Text>
            
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>🌱 Self-Acceptance</Text>
              <Text style={styles.tipText}>
                Your high agreeableness (90%) is a beautiful gift! You naturally care for others, 
                but remember to care for yourself too. Practice saying "no" when you need to.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>🎨 Creative Expression</Text>
              <Text style={styles.tipText}>
                With your high openness (80%), you have a rich inner world. Try different 
                journaling styles - draw, use colors, or write poetry to express yourself.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>📈 Building Habits</Text>
              <Text style={styles.tipText}>
                Your conscientiousness (60%) shows room for growth in building consistent habits. 
                Start small - even 5 minutes of daily reflection counts!
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>🧘 Emotional Balance</Text>
              <Text style={styles.tipText}>
                Your high resilience (30%) means you handle stress well! Use this strength to 
                support friends and be a calming presence in challenging situations.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7BD8',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7BD8',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#1A0B3D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  traitsContent: {
    flex: 1,
  },
  tipsContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8B7BD8',
    lineHeight: 20,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#8B7BD8',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});