import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Book, Heart, TrendingUp, Calendar, X, BookOpen } from 'lucide-react-native';
import { TraitCard } from '../../components/TraitCard';
import ScreenLayout from '@/components/ScreenLayout';
import { WeeklyData, TraitInfo, PersonalityScores } from '../../constants/userData';
import { Colors } from '@/constants/colors';
import { WeeklySummary } from '@/components/WeeklySummary';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [activeTab, setActiveTab] = useState<'trends' | 'growth'>('trends');
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  const traitInfo = TraitInfo;
  const personalityScores = PersonalityScores;
  const weeklyData = WeeklyData;

  const conscientiousTrait = traitInfo.conscientiousness;

  return (
    <ScreenLayout disableBottomSafeArea>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Yourself</Text>
        <Text style={styles.subtitle}>Insights from your journey</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trends' && styles.activeTab]}
          onPress={() => setActiveTab('trends')}
        >
          <Calendar size={18} color={activeTab === 'trends' ? '#1A0B3D' : '#8B7BD8'} />
          <Text style={[styles.tabText, activeTab === 'trends' && styles.activeTabText]}>
            Trends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'growth' && styles.activeTab]}
          onPress={() => setActiveTab('growth')}
        >
          <Book size={18} color={activeTab === 'growth' ? '#1A0B3D' : '#8B7BD8'} />
          <Text style={[styles.tabText, activeTab === 'growth' && styles.activeTabText]}>
            Traits
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'trends' && <WeeklySummary data={weeklyData} />}

        {activeTab === 'growth' && (
          <View style={styles.traitsContent}>
            <Text style={styles.sectionTitle}>Understanding Your Traits</Text>
            <Text style={styles.sectionDescription}>
              Gain deeper awareness of how you move through the world. Different styles come with different strengths—awareness is the first step to growth. 💫
            </Text>

            {conscientiousTrait && (
              <View style={styles.spotlightCard}>
                <Text style={styles.spotlightTitle}>Spotlight: Conscientiousness</Text>
                <Text style={styles.spotlightByline}>Because you're low in conscientiousness.</Text>

                <View style={styles.lessonBlock}>
                  <Text style={styles.lessonHeading}>🌟 Part 1 – Know Yourself: Your Style of Doing Things</Text>
                  <Text style={styles.lessonText}>
                    Everyone has their own way of handling tasks. Being ultra-organised isn’t the only way to succeed—maybe you shine when the pressure is on or love spotting shortcuts. The goal is to recognise what works for you and where things get tricky.
                  </Text>
                  <View style={styles.promptBox}>
                    <Text style={styles.promptTitle}>Reflection prompt</Text>
                    <Text style={styles.promptText}>• What’s good about how I usually get things done?</Text>
                    <Text style={styles.promptText}>• What’s tricky about it?</Text>
                    <TouchableOpacity style={styles.promptButton} onPress={() => router.push('/(tabs)/(journal)/mood' as any)}>
                      <BookOpen size={16} color={'#1A103D'} />
                      <Text style={styles.promptButtonText}>Jot this in my journal</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.lessonBlock}>
                  <Text style={styles.lessonHeading}>🌟 Part 2 – Small Steps Build Big Progress</Text>
                  <Text style={styles.lessonText}>
                    Big changes usually start with small, almost-too-easy steps. If you thrive on last-minute energy, cool—that means you can deliver under pressure. Try layering in one tiny step ahead of time so future-you has it easier.
                  </Text>
                  <View style={styles.promptBox}>
                    <Text style={styles.promptTitle}>Habit prompt</Text>
                    <Text style={styles.promptText}>• Set one super small goal for tomorrow. e.g. write one journal line, prepare one item for class, send one “hey, how are you?” text.</Text>
                    <TouchableOpacity style={styles.promptSecondaryButton} onPress={() => router.push('/(tabs)/(journal)/mood' as any)}>
                      <Text style={styles.promptSecondaryText}>Add as a mini-step</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.spotlightFooter}>Each week you finish these reflections, your Soulseed gains new leaves on its Conscientiousness branch.</Text>
              </View>
            )}

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Other traits to explore</Text>
            {Object.entries(traitInfo).map(([traitName, trait], index) => {
              const scoreData = personalityScores[traitName as keyof typeof personalityScores];
              if (!scoreData) return null;
              return (
                <TraitCard
                  key={index}
                  trait={{ ...trait, scoreData }}
                  onPress={() => setSelectedTrait(traitName)}
                />
              );
            })}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={!!selectedTrait}
        onRequestClose={() => setSelectedTrait(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedTrait(null)}>
          <View style={styles.modalContent}>
            {selectedTrait 
            ? <Text style={styles.modalTitle}>{traitInfo[selectedTrait as keyof typeof traitInfo].name}</Text>
            : null
            }
            {(() => {
              const trait = traitInfo[selectedTrait as keyof typeof traitInfo];
              if (!trait) return null;
              console.log(trait.name)
              const isConscientiousness = trait.name === 'Conscientiousness';
              if (isConscientiousness) {
                return (
                  <View>
                    <Text style={styles.modalBody}>
                      Conscientiousness is about being reliable and building systems that help you show up the way you want. Pair your natural strengths with tiny, consistent habits and you’ll feel in control without losing your creativity.
                    </Text>
                    <Text style={styles.modalSectionTitle}>✨ Try this</Text>
                    <Text style={styles.modalItemText}>• Before bed, set out one thing tomorrow-you will be grateful for.</Text>
                    <Text style={styles.modalItemText}>• When you finish a task, take 30 seconds to note what helped it go smoothly.</Text>
                    <Text style={styles.modalItemText}>• Turn “big project” into “first 5-minute step”. Do just that, nothing more.</Text>
                  </View>
                );
              }
              return (
                <View>
                  <Text style={styles.modalBody}>{trait.description}</Text>
                  <Text style={styles.modalSectionTitle}>Where it shines</Text>
                  {trait.pros.map((line, idx) => (
                    <Text key={`pro-${idx}`} style={styles.modalItemText}>• {line}</Text>
                  ))}
                  <Text style={[styles.modalSectionTitle, { marginTop: 16 }]}>What to watch</Text>
                  {trait.cons.map((line, idx) => (
                    <Text key={`con-${idx}`} style={styles.modalItemText}>• {line}</Text>
                  ))}
                </View>
              );
            })()}
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedTrait(null)}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    paddingTop: 24,
    paddingBottom: 24,
  },
  headerTitle: {
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
    backgroundColor: Colors.accent,
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
  spotlightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.25)',
  },
  spotlightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  spotlightByline: {
    fontSize: 13,
    color: '#C3B4FF',
    marginBottom: 16,
  },
  lessonBlock: {
    marginBottom: 18,
  },
  lessonHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  lessonText: {
    fontSize: 13,
    color: '#C3B4FF',
    lineHeight: 20,
  },
  promptBox: {
    backgroundColor: 'rgba(139,123,216,0.12)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(139,123,216,0.25)',
    marginTop: 12,
    gap: 4,
  },
  promptTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  promptText: {
    fontSize: 12,
    color: '#C3B4FF',
    lineHeight: 18,
  },
  promptButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    gap: 8,
  },
  promptButtonText: {
    color: '#1A103D',
    fontWeight: '700',
    fontSize: 13,
  },
  promptSecondaryButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,123,216,0.35)',
    alignItems: 'center',
  },
  promptSecondaryText: {
    fontSize: 12,
    color: '#C3B4FF',
    fontWeight: '600',
  },
  spotlightFooter: {
    fontSize: 12,
    color: '#8B7BD8',
    marginTop: 6,
  },
  bottomSpacer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#2A2F45',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    color: '#C3B4FF',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalItemText: {
    fontSize: 14,
    color: '#8B7BD8',
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});