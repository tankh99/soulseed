import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Trophy, Calendar, TrendingUp } from 'lucide-react-native';
import { SoulseedDisplay } from '../../components/SoulseedDisplay';
import { PersonalityTraits } from '../../components/PersonalityTraits';
import { StatsCard } from '../../components/StatsCard';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const userStats = {
    totalEntries: 47,
    currentStreak: 7,
    longestStreak: 15,
    totalPoints: 1250,
    level: 2,
    weeklyGoal: 7,
    weeklyProgress: 5,
  };

  const personalityScores = {
    openness: 0.8,
    conscientiousness: 0.6,
    extroversion: 0.7,
    agreeableness: 0.9,
    neuroticism: 0.3,
  };

  return (
    <LinearGradient colors={['#2D1B69', '#1A0B3D']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Your Profile</Text>
            <Text style={styles.subText}>Level {userStats.level} Journaler</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#8B7BD8" />
          </TouchableOpacity>
        </View>

        {/* Soulseed Display */}
        <View style={styles.soulseedSection}>
          <SoulseedDisplay 
            level={userStats.level} 
            personality={personalityScores}
          />
          <Text style={styles.soulseedTitle}>Your Cosmic Companion</Text>
          <Text style={styles.soulseedDescription}>
            Born from your unique personality, growing with every reflection
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatsCard
            icon={<Trophy size={20} color="#FFD700" />}
            title="Total Points"
            value={userStats.totalPoints.toLocaleString()}
            subtitle="Keep growing!"
          />
          <StatsCard
            icon={<Calendar size={20} color="#4ADE80" />}
            title="Current Streak"
            value={`${userStats.currentStreak} days`}
            subtitle="Almost to 10!"
          />
          <StatsCard
            icon={<TrendingUp size={20} color="#06B6D4" />}
            title="Journal Entries"
            value={userStats.totalEntries.toString()}
            subtitle="This month"
          />
          <StatsCard
            icon={<Trophy size={20} color="#8B7BD8" />}
            title="Best Streak"
            value={`${userStats.longestStreak} days`}
            subtitle="Personal best"
          />
        </View>

        {/* Personality Traits */}
        <View style={styles.personalitySection}>
          <Text style={styles.sectionTitle}>Your Personality</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your OCEAN personality assessment
          </Text>
          <PersonalityTraits scores={personalityScores} />
        </View>

        {/* Recent Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>🔥</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDescription}>
                Journaled for 7 days straight!
              </Text>
            </View>
            <Text style={styles.achievementDate}>2 days ago</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>🌟</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Deep Thinker</Text>
              <Text style={styles.achievementDescription}>
                Used "Unpack It" 10 times
              </Text>
            </View>
            <Text style={styles.achievementDate}>1 week ago</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 14,
    color: '#8B7BD8',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  soulseedSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  soulseedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  soulseedDescription: {
    fontSize: 14,
    color: '#8B7BD8',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  personalitySection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8B7BD8',
    marginBottom: 20,
    lineHeight: 20,
  },
  achievementsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#8B7BD8',
    marginTop: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpacer: {
    height: 100,
  },
});