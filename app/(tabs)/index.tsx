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
import { Flame, Star, Gift, CircleCheck as CheckCircle, PenTool } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { SoulseedDisplay } from '../../components/SoulseedDisplay';
import { StreakCounter } from '../../components/StreakCounter';
import { QuestCard } from '../../components/QuestCard';
import { UserStats, SoulseedData, MockQuests } from '../../constants/userData';
import ScreenLayout from '@/components/ScreenLayout';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // Use global constants for consistent data
  const streak = UserStats.currentStreak;
  const totalPoints = UserStats.totalPoints;
  const weeklyProgress = UserStats.weeklyProgress;
  const soulseedLevel = SoulseedData.level;
  const mockQuests = MockQuests;
  
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCheckIn = () => {
    // Navigate to journal tab
    router.push('/(tabs)/(journal)/mood');
    
  };

  return (
    <ScreenLayout>
      <Animated.View 
        style={[styles.scrollView, { opacity: fadeAnim }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! ✨</Text>
          <View style={styles.pointsContainer}>
            <Star size={16} color="#FFD700" />
            <Text style={styles.points}>{totalPoints.toLocaleString()}</Text>
          </View>
        </View>

        {/* Soulseed Display */}
        <View style={styles.soulseedContainer}>
          <SoulseedDisplay 
            level={soulseedLevel} 
            personality={SoulseedData.personality}
          />
          <Text style={styles.soulseedName}>{SoulseedData.name}</Text>
          <Text style={styles.soulseedSubtext}>Level {soulseedLevel} • Evolving</Text>
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
                {mockQuests.filter(q => q.completed).length}/{mockQuests.length}
              </Text>
            </View>
          </View>
          
          {mockQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </Animated.View>
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
    marginBottom: 32,
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
  streakSection: {
    marginBottom: 32,
  },
  checkInButton: {
    marginHorizontal: 24,
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
  },
  bottomSpacer: {
    height: 100,
  },
});