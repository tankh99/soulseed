import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Star, Gift, CircleCheck as CheckCircle, PenTool, BookHeart } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { SoulseedDisplay } from '../../components/SoulseedDisplay';
import { StreakCounter } from '../../components/StreakCounter';
import { QuestCard } from '../../components/QuestCard';
import { UserStats, SoulseedData, MockQuests, PersonalityScores } from '../../constants/userData';
import ScreenLayout from '../../components/ScreenLayout';
import { registerForPushNotificationsAsync } from '@/lib/notifications';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // Use global constants for consistent data
  const streak = UserStats.currentStreak;
  const totalXp = Object.values(PersonalityScores).reduce((acc, trait) => acc + trait.currentXP, 0);
  const weeklyProgress = UserStats.weeklyProgress;
  const soulseedLevel = SoulseedData.level;
  const [quests, setQuests] = useState(MockQuests.map(q => ({ ...q })));
  
  // Compute overall growth progress across traits
  const totalLevelUpXp = Object.values(PersonalityScores).reduce((acc, trait) => acc + trait.levelUpXP, 0);
  const growthProgress = Math.min(100, Math.round((totalXp / totalLevelUpXp) * 100));
  
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    registerForPushNotificationsAsync();

    // (async() => {
    //   const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    //   const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    //   console.log(pushTokenString)
    // })()
  }, []);

  const handleQuestComplete = (questId: string) => {
    setQuests(currentQuests =>
      currentQuests.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      )
    );
  };

  const handleCheckIn = () => {
    // Navigate to journal tab
    router.push('/(tabs)/(journal)/mood' as any);
    
  };

  return (
    <ScreenLayout disableBottomSafeArea>
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Good morning! ✨</Text>
          {/* <View style={styles.headerActions}>
            <View style={styles.pointsContainer}>
              <Star size={16} color="#FFD700" />
              <Text style={styles.points}>{totalXp.toLocaleString()} XP</Text>
            </View>
          </View> */}
        </View>

        {/* Soulseed Display */}
        <View style={styles.soulseedContainer}>
          <SoulseedDisplay 
            level={soulseedLevel} 
            personality={SoulseedData.personality}
          />
          <Text style={styles.soulseedName}>{SoulseedData.name}</Text>
          <Text style={styles.soulseedSubtext}>Level {soulseedLevel} • Evolving</Text>
          <Text style={styles.tapHint}>Tap quickly to pet {SoulseedData.name} 💫</Text>

          {/* XP / Growth Progress */}
          <View style={styles.growthContainer}>
            <View style={styles.growthHeader}>
              <Text style={styles.growthTitle}>Soulseed Growth</Text>
              <Text style={styles.growthPercent}>{growthProgress}%</Text>
            </View>
            <View style={styles.growthBarTrack}>
              <LinearGradient
                colors={[Colors.accent, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.growthBarFill, { width: `${growthProgress}%` }]}
              />
            </View>
            <Text style={styles.growthSubtitle}>{totalXp.toLocaleString()} / {totalLevelUpXp.toLocaleString()} XP to next evolution</Text>
          </View>
        </View>

        {/* Streak Counter */}
        <View style={styles.streakSection}>
          <StreakCounter 
            currentStreak={streak} 
            weeklyProgress={weeklyProgress} 
          />
        </View>

        {/* Check In Button */}
        <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
          <LinearGradient 
            colors={[Colors.secondary, Colors.secondary]} 
            style={styles.checkInGradient}
          >
            <PenTool size={24} color={Colors.primary} />
            <Text style={styles.checkInText}>Check In</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Daily Quests */}
        <View style={styles.questsSection}>
          <View style={styles.questsHeader}>
            <Text style={styles.questsTitle}>Today's Quests</Text>
            <View style={styles.questsBadge}>
              <Text style={styles.questsBadgeText}>
                {quests.filter(q => q.completed).length}/{quests.length}
              </Text>
            </View>
          </View>
          
          {quests.map((quest) => (
            <QuestCard 
              key={quest.id} 
              quest={quest}
              onComplete={handleQuestComplete} 
            />
          ))}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 12
  },
  points: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 6,
  },
  soulseedContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  soulseedName: {
    fontSize: 20,
    paddingVertical: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  soulseedSubtext: {
    fontSize: 14,
    color: '#8B7BD8',
    marginTop: 4,
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 12,
    color: '#8B7BD8',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  streakSection: {
    marginBottom: 32,
  },
  checkInButton: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  checkInText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A0B3D',
    marginLeft: 12,
  },
  questsSection: {
  },
  questsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  questsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questsBadge: {
    backgroundColor: 'rgba(139, 123, 216, 0.2)',
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.3)',
  },
  questsBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7BD8',
    paddingHorizontal: 8 
  },
  bottomSpacer: {
    height: 100,
  },
  growthContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
  },
  growthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  growthTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  growthPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  growthBarTrack: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.25)',
  },
  growthBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  growthSubtitle: {
    fontSize: 12,
    color: '#8B7BD8',
    marginTop: 6,
    textAlign: 'center',
  },
});