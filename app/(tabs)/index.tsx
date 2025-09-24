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
import { Flame, PenTool } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { SoulseedDisplay } from '../../components/SoulseedDisplay';
import { StreakCounter } from '../../components/StreakCounter';
import { QuestCard } from '../../components/QuestCard';
import { MockHarvestedFruits, MockMoodEntries, MockQuests, SoulseedData, UserStats, PersonalityScores } from '../../constants/userData';
import ScreenLayout from '../../components/ScreenLayout';
import { registerForPushNotificationsAsync } from '@/lib/notifications';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getRollingWeekSummary, generateFruitFromSummary, derivePlantStage } from '@/lib/fruitGenerator';
import { HarvestModal } from '@/components/HarvestModal';
import { MoodPlant } from '@/components/MoodPlant';
import { GeneratedFruit, HarvestedFruit, MoodPlantStage } from '@/data/moodFruits';

const { width } = Dimensions.get('window');
const DEMO_XP_REWARD = 50;

export default function HomeScreen() {
  const [quests, setQuests] = useState(MockQuests.map(q => ({ ...q })));
  const [harvestedFruits, setHarvestedFruits] = useState<HarvestedFruit[]>(MockHarvestedFruits);
  const [pendingFruit, setPendingFruit] = useState<GeneratedFruit | null>(null);
  const [harvestVisible, setHarvestVisible] = useState(false);
  const [totalXp, setTotalXp] = useState(() => Object.values(PersonalityScores).reduce((acc, trait) => acc + trait.currentXP, 0));
  const [hasHarvestedThisCycle, setHasHarvestedThisCycle] = useState(false);

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

  const weeklySummary = useMemo(() => getRollingWeekSummary(MockMoodEntries), []);
  const fruitPreview = useMemo(() => generateFruitFromSummary(weeklySummary), [weeklySummary]);
  const plantStageDerived = derivePlantStage(weeklySummary);
  const displayPlantStage: MoodPlantStage = hasHarvestedThisCycle ? 'seed' : plantStageDerived;
  const isHarvestReady = !hasHarvestedThisCycle && plantStageDerived === 'bloom';

  const totalLevelUpXp = Object.values(PersonalityScores).reduce((acc, trait) => acc + trait.levelUpXP, 0);
  const growthProgress = Math.min(100, Math.round((totalXp / totalLevelUpXp) * 100));

  const handleQuestComplete = (questId: string) => {
    setQuests(currentQuests => currentQuests.map(q => (q.id === questId ? { ...q, completed: true } : q)));
  };

  const handleCheckIn = () => {
    router.push('/(tabs)/(journal)/mood' as any);
  };

  const handleHarvest = () => {
    if (!fruitPreview) return;
    setPendingFruit(fruitPreview);
    setHarvestVisible(true);
    setHasHarvestedThisCycle(true);
    setTotalXp(prev => prev + DEMO_XP_REWARD);
    setHarvestedFruits(prev => [
      ...prev,
      {
        id: `fruit-${Date.now()}`,
        harvestedAt: new Date().toISOString(),
        fruit: fruitPreview,
      },
    ]);
  };

  const handleCloseHarvest = () => {
    setHarvestVisible(false);
    setPendingFruit(null);
  };

  return (
    <ScreenLayout disableBottomSafeArea>
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cultivate your garden ✨</Text>
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
            <View style={styles.inlineStreak}>
              <StreakCounter currentStreak={UserStats.currentStreak} weeklyProgress={UserStats.weeklyProgress} />
            </View>
          </View>

          <View style={styles.plantContainer}>
            <MoodPlant stage={displayPlantStage} isHarvestReady={isHarvestReady} />
            <Text style={styles.plantHint}>
              {hasHarvestedThisCycle
                ? 'A fresh sprout awaits next week.'
                : weeklySummary.totalEntries === 0
                  ? 'Journal to wake up your sprout!'
                  : `${weeklySummary.totalEntries} journal entries nurtured this bud.`}
            </Text>
            {isHarvestReady && (
              <TouchableOpacity style={styles.harvestButton} onPress={handleHarvest}>
                <LinearGradient colors={[Colors.accent, Colors.secondary]} style={styles.harvestButtonGrad}>
                  <Text style={styles.harvestButtonText}>Harvest</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
          <LinearGradient colors={[Colors.secondary, Colors.secondary]} style={styles.checkInGradient}>
            <PenTool size={24} color={Colors.primary} />
            <Text style={styles.checkInText}>Check In</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.questsSection}>
          <View style={styles.questsHeader}>
            <Text style={styles.questsTitle}>Today's Quests</Text>
            <View style={styles.questsBadge}>
              <Text style={styles.questsBadgeText}>
                {quests.filter(q => q.completed).length}/{quests.length}
              </Text>
            </View>
          </View>
          {quests.map(quest => (
            <QuestCard key={quest.id} quest={quest} onComplete={handleQuestComplete} />
          ))}
        </View>
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
      <HarvestModal visible={harvestVisible} fruit={pendingFruit} onClose={handleCloseHarvest} xpReward={DEMO_XP_REWARD} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 12,
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,123,216,0.2)',
    gap: 12,
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
    marginVertical: 24,
  },
  checkInButton: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
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
  questsSection: {},
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
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.3)',
  },
  questsBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7BD8',
    paddingHorizontal: 8,
  },
  bottomSpacer: {
    height: 120,
  },
  growthContainer: {
    width: '100%',
    marginTop: 12,
  },
  growthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    marginTop: 4,
    textAlign: 'center',
  },
  inlineStreak: {
    width: '100%',
    marginTop: 8,
  },
});