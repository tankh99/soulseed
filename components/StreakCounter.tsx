import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Calendar, Gift, Trophy, Target, Star } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { fruits } from '../data/fruits';

interface StreakCounterProps {
  currentStreak: number;
  weeklyProgress: number;
}

export function StreakCounter({ currentStreak, weeklyProgress }: StreakCounterProps) {
  const weeklyGoal = 7;
  const progressPercentage = (weeklyProgress / weeklyGoal) * 100;
  
  // Gamification elements
  const nextFruit = fruits.find(fruit => !fruit.collected) || fruits[0];
  const daysUntilFruit = weeklyGoal - weeklyProgress;
  const isWeeklyComplete = weeklyProgress >= weeklyGoal;
  const streakMilestones = [3, 7, 14, 30, 60, 100];
  const nextMilestone = streakMilestones.find(milestone => currentStreak < milestone) || streakMilestones[streakMilestones.length - 1];
  const daysToNextMilestone = nextMilestone - currentStreak;

  const getRarityChance = () => {
    const rarityChances = {
      'common': '60%',
      'uncommon': '25%', 
      'rare': '10%',
      'mythic': '4%',
      'legendary': '1%'
    };
    
    if (isWeeklyComplete) {
      return "🎉 Week Complete! You earned a fruit!";
    } else {
      const randomRarity = Object.keys(rarityChances)[Math.floor(Math.random() * Object.keys(rarityChances).length)];
      return `🎲 ${rarityChances[randomRarity]} chance for ${randomRarity} fruit!`;
    }
  };

  const getStreakMessage = () => {
    if (currentStreak >= 7) {
      return "🔥 On fire!";
    } else if (currentStreak >= 3) {
      return "💪 Great start!";
    } else {
      return "🌱 Building momentum!";
    }
  };

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
            <View style={styles.streakContent}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
              <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Weekly Progress with Gamification */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Gift size={20} color="#8B7BD8" />
          <Text style={styles.progressTitle}>Weekly Reward</Text>
          {isWeeklyComplete && <Trophy size={16} color="#FFD700" />}
        </View>
        
        <Text style={styles.motivationalText}>
          {getRarityChance()}
        </Text>
        
        <View style={styles.progressBar}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={isWeeklyComplete ? ['#4ADE80', '#22C55E'] : ['#8B7BD8', '#6366F1']}
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>

        <View style={styles.fruitPreview}>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Target size={14} color="#8B7BD8" />
              <Text style={styles.statText}>{weeklyProgress}/{weeklyGoal}</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={14} color="#FFD700" />
              <Text style={styles.statText}>+25 XP</Text>
            </View>
          </View>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  streakGradient: {
    padding: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakIcon: {
    marginRight: 16,
  },
  streakContent: {
    alignItems: 'flex-start',
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: "center",
    color: '#FFD700',
  },
  streakLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
  },
  streakMessage: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  milestoneProgress: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  milestoneText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
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
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  motivationalText: {
    fontSize: 12,
    color: '#8B7BD8',
    marginBottom: 12,
    lineHeight: 16,
  },
  progressBar: {
    marginBottom: 12,
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
    justifyContent: 'center',
  },
  fruitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fruitImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  fruitName: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  progressStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    color: '#8B7BD8',
    fontWeight: '500',
  },
});