import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Calendar } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface StreakCounterProps {
  currentStreak: number;
  weeklyProgress: number;
}

export function StreakCounter({ currentStreak, weeklyProgress }: StreakCounterProps) {
  const weeklyGoal = 7;
  const progressPercentage = (weeklyProgress / weeklyGoal) * 100;

  return (
    <View style={styles.container}>
      {/* Current Streak */}
      <View style={styles.streakCard}>
        <LinearGradient
          colors={Colors.gradientGold}
          style={styles.streakGradient}
        >
          <View style={styles.streakHeader}>
            <View style={styles.streakIcon}>
              <Flame size={24} color="#FFD700" />
            </View>
            <View>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Weekly Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Calendar size={20} color="#8B7BD8" />
          <Text style={styles.progressTitle}>This Week</Text>
        </View>
        
        <Text style={styles.progressText}>
          {weeklyProgress} of {weeklyGoal} days
        </Text>
        
        <View style={styles.progressBar}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#8B7BD8', '#6366F1']}
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>

        <View style={styles.fruitPreview}>
          <Text style={styles.fruitEmoji}>🍎</Text>
          <Text style={styles.fruitText}>
            {weeklyProgress === weeklyGoal ? 'Fruit earned!' : `${weeklyGoal - weeklyProgress} days to fruit`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  streakCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  streakGradient: {
    padding: 20,
    flex: 1,
    alignItems: "center",
    // justifyContent: 
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    marginRight: 16,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
  },
  streakLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
  },
  progressCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.3)',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#8B7BD8',
    marginBottom: 12,
  },
  progressBar: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(139, 123, 216, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  fruitPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fruitEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  fruitText: {
    fontSize: 12,
    color: '#8B7BD8',
    flex: 1,
  },
});