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
import { Book, Heart, TrendingUp, Calendar, X } from 'lucide-react-native';
import { WeeklySummary } from '../../components/WeeklySummary';
import { TraitCard } from '../../components/TraitCard';
import ScreenLayout from '@/components/ScreenLayout';
import { WeeklyData, TraitInfo, PersonalityScores } from '../../constants/userData';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [activeTab, setActiveTab] = useState<'trends' | 'growth'>('trends');
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  // Use global constants for consistent data
  const traitInfo = TraitInfo;
  const personalityScores = PersonalityScores;

  // Use global weekly data
  const weeklyData = WeeklyData;

  return (
    <ScreenLayout
      showBackButton={false}
      disableBottomSafeArea
    >
      {/* <LinearGradient colors={['#2D1B69', '#1A0B3D']} style={styles.container}> */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover Yourself</Text>
          <Text style={styles.subtitle}>Insights from your journey</Text>
        </View>

        {/* Tab Navigation */}
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
              Growth
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'trends' && (
            <WeeklySummary data={weeklyData} />
          )}

          {activeTab === 'growth' && (
            <>
              <View style={styles.traitsContent}>
                <Text style={styles.sectionTitle}>Your Personality</Text>
                <Text style={styles.sectionDescription}>
                  Understanding your unique combination of traits can help you grow and thrive. 
                  Remember, every trait has its strengths! 🌟
                </Text>
                {traitInfo.map((trait, index) => {
                  const traitName = trait.name.toLowerCase() as keyof typeof personalityScores;
                  const scoreData = personalityScores[traitName];
                  
                  // Gracefully handle cases where score data might not be found
                  if (!scoreData) {
                    return null;
                  }

                  return (
                    <TraitCard 
                      key={index} 
                      trait={{...trait, scoreData}}
                      onPress={() => setSelectedTrait(trait.name)}
                    />
                  );
                })}
              </View>
            </>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedTrait}
          onRequestClose={() => setSelectedTrait(null)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setSelectedTrait(null)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Growth Tips for {selectedTrait}</Text>
              {traitInfo.find(t => t.name === selectedTrait)?.tips.map((tip, index) => (
                <Text key={index} style={styles.tipText}>• {tip}</Text>
              ))}
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedTrait(null)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      {/* </LinearGradient> */}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
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
  tipsContent: {
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
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#8B7BD8',
    lineHeight: 20,
    marginBottom: 8,
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
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});