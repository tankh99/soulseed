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
import ScreenLayout from '../../components/ScreenLayout';
import { SoulseedDisplay } from '../../components/SoulseedDisplay';
import { StatsCard } from '../../components/StatsCard';
import { UserStats, PersonalityScores, SoulseedData, TraitInfo } from '../../constants/userData';
import { useRouter } from 'expo-router';
import { TraitCard } from '../../components/TraitCard';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  // Use global constants for consistent data across screens
  const userStats = UserStats;
  const personalityScores = PersonalityScores;
  const totalXp = Object.values(personalityScores).reduce((acc, trait) => acc + trait.currentXP, 0);

  const router = useRouter()
  return (
    <ScreenLayout
      disableBottomSafeArea
    >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#8B7BD8" />
          </TouchableOpacity>
        </View>

        {/* Soulseed Display */}
        <View style={styles.soulseedSection}>
          <SoulseedDisplay 
            level={SoulseedData.level} 
            personality={SoulseedData.personality}
          />
          <Text style={styles.soulseedTitle}>{SoulseedData.name}</Text>
          <Text style={styles.soulseedDescription}>
            Born from your unique personality, growing with every reflection
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatsCard
            icon={<Trophy size={20} color="#FFD700" />}
            title="Total XP"
            value={totalXp.toLocaleString()}
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
          <Text style={styles.sectionTitle}>Your Personality Traits</Text>
          <Text style={styles.sectionSubtitle}>
            Understanding your natural tendencies and how they shape your daily life
          </Text>
          {Object.entries(TraitInfo).map(([name, trait], index) => {
            const traitName = name.toLowerCase() as keyof typeof personalityScores;
            const scoreData = personalityScores[traitName];
            if (!scoreData) return null;

            return (
              <TraitCard
                key={index}
                trait={{ ...trait, scoreData }}
                onPress={() => {
                  // In a real app, you'd open a modal here like in the Discover tab
                  // For now, we'll just log it.
                  console.log(`Tapped on ${trait.name}`);
                }}
              />
            );
          })}
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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
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
    marginBottom: 32,
    gap: 12,
  },
  personalitySection: {
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