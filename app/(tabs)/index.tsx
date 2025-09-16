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
import { SoulseedDisplay } from '../../components/SoulseedDisplay';
import { StreakCounter } from '../../components/StreakCounter';
import { QuestCard } from '../../components/QuestCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [streak, setStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [weeklyProgress, setWeeklyProgress] = useState(5);
  const [soulseedLevel, setSoulseedLevel] = useState(2);
  
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const mockQuests = [
    {
      id: '1',
      title: 'Morning Reflection',
      description: 'Journal about your goals for today',
      points: 25,
      completed: true,
      icon: '🌅',
    },
    {
      id: '2',
      title: 'Gratitude Check',
      description: 'Write down 3 things you\'re grateful for',
      points: 20,
      completed: false,
      icon: '🙏',
    },
    {
      id: '3',
      title: 'Mood Tracker',
      description: 'Record your current emotional state',
      points: 15,
      completed: false,
      icon: '😊',
    },
  ];

  const handleCheckIn = () => {
    // Navigate to journal flow
    console.log('Starting journal check-in');
  };

  return (
    <LinearGradient colors={['#2D1B69', '#1A0B3D']} style={styles.container}>
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
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
            personality={{
              openness: 0.8,
              conscientiousness: 0.6,
              extroversion: 0.7,
              agreeableness: 0.9,
              neuroticism: 0.3,
            }}
          />
          <Text style={styles.soulseedName}>Your Cosmic Companion</Text>
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
            colors={['#FFD700', '#FFA500']} 
            style={styles.checkInGradient}
          >
            <PenTool size={24} color="#1A0B3D" />
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
      </Animated.ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  points: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 6,
  },
  soulseedContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  soulseedName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  soulseedSubtext: {
    fontSize: 14,
    color: '#8B7BD8',
    marginTop: 4,
    textAlign: 'center',
  },
  streakSection: {
    paddingHorizontal: 24,
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
    paddingHorizontal: 32,
  },
  checkInText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A0B3D',
    marginLeft: 12,
  },
  questsSection: {
    paddingHorizontal: 24,
  },
  questsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questsBadge: {
    backgroundColor: 'rgba(139, 123, 216, 0.2)',
    paddingHorizontal: 12,
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