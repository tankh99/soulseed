import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PenTool } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { SoulseedDisplay } from '../../components/SoulseedDisplay';
import { StreakCounter } from '../../components/StreakCounter';
import { QuestCard } from '../../components/QuestCard';
import { MockQuests, SoulseedData, UserStats, PersonalityScores } from '../../constants/userData';
import ScreenLayout from '../../components/ScreenLayout';
import { registerForPushNotificationsAsync } from '@/lib/notifications';

const { width } = Dimensions.get('window');
const DEMO_XP_REWARD = 50;

export default function HomeScreen() {
  const [quests, setQuests] = useState(MockQuests.map(q => ({ ...q })));
  const [totalXp, setTotalXp] = useState(() => Object.values(PersonalityScores).reduce((acc, trait) => acc + trait.currentXP, 0));

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    registerForPushNotificationsAsync();
  }, [fadeAnim]);

  useFocusEffect(
    useCallback(() => {
      setQuests(MockQuests.map(q => ({ ...q })));
    }, [])
  );

  const totalLevelUpXp = Object.values(PersonalityScores).reduce((acc, trait) => acc + trait.levelUpXP, 0);
  const growthProgress = Math.min(100, Math.round((totalXp / totalLevelUpXp) * 100));

  const handleQuestComplete = (questId: string) => {
    setQuests(currentQuests => currentQuests.map(q => (q.id === questId ? { ...q, completed: true } : q)));
  };

  const handleCheckIn = () => {
    router.push('/(tabs)/(journal)/mood' as any);
  };

  return (
    <ScreenLayout disableBottomSafeArea>
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome back, {SoulseedData.name}</Text>
          <StreakCounter currentStreak={UserStats.currentStreak} />
        </View>

        <View style={styles.soulseedContainer}>
          <View style={styles.soulseedColumn}>
            <SoulseedDisplay level={SoulseedData.level} personality={SoulseedData.personality} />
            <Text style={styles.soulseedName}>{SoulseedData.name}</Text>
            <Text style={styles.soulseedSubtext}>Level {SoulseedData.level} • Evolving</Text>
            <Text style={styles.tapHint}>Tap quickly to pet {SoulseedData.name} 💫</Text>
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
              <Text style={styles.growthSubtitle}>
                {totalXp.toLocaleString()} / {totalLevelUpXp.toLocaleString()} XP to next evolution
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
          <LinearGradient colors={[Colors.secondary, Colors.secondary]} style={styles.checkInGradient}>
            <PenTool size={24} color={Colors.primary} />
            <Text style={styles.checkInText}>Daily Check-in</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.questsContainer}>
          <Text style={styles.questsTitle}>Today's Quests</Text>
          {quests.filter(q => !q.completed).map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={() => handleQuestComplete(quest.id)}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  soulseedContainer: {
    marginVertical: 12,
    gap: 16,
  },
  plantContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,123,216,0.2)',
  },
  plantText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
  },
  plantHint: {
    fontSize: 12,
    color: '#C3B4FF',
    textAlign: 'center',
    marginTop: 6,
  },
  harvestButton: {
    marginTop: 16,
    width: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  harvestButtonGrad: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  harvestButtonText: {
    color: '#1A103D',
    fontWeight: '700',
  },
  soulseedColumn: {
    alignItems: 'center',
    flex: 1,
  },
  soulseedName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
  },
  soulseedSubtext: {
    fontSize: 16,
    color: Colors.secondary,
    marginTop: 4,
  },
  tapHint: {
    fontSize: 14,
    color: Colors.accent,
    marginTop: 8,
    fontStyle: 'italic',
  },
  growthContainer: {
    width: '100%',
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  growthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  growthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  growthPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  growthBarTrack: {
    height: 10,
    backgroundColor: Colors.background,
    borderRadius: 5,
    overflow: 'hidden',
  },
  growthBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  growthSubtitle: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  inlineStreak: {
    marginTop: 20,
    width: '100%',
  },
  checkInButton: {
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  checkInGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 12,
  },
  questsContainer: {
    paddingBottom: 40,
  },
  questsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
});