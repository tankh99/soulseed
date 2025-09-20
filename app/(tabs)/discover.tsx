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
import ScreenLayout from '@/components/ScreenLayout';
import { WeeklyData, TraitInfo } from '../../constants/userData';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [activeTab, setActiveTab] = useState<'summary' | 'traits' | 'tips'>('summary');

  // Use global constants for consistent data
  const traitInfo = TraitInfo;

  // Use global weekly data
  const weeklyData = WeeklyData;

  return (
    <ScreenLayout
      showBackButton={false}>
      {/* <LinearGradient colors={['#2D1B69', '#1A0B3D']} style={styles.container}> */}
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
      {/* </LinearGradient> */}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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