import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

interface Trait {
  name: string;
  score: number;
  description: string;
  color: string;
  icon: string;
  pros: string[];
  cons: string[];
  scoreData: {
    currentXP: number;
    levelUpXP: number;
  };
}

interface TraitCardProps {
  trait: Trait;
  onPress: () => void;
}

export function TraitCard({ trait, onPress }: TraitCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${trait.color}20` }]}>
          <Text style={styles.icon}>{trait.icon}</Text>
        </View>
        <View style={styles.traitInfo}>
          <Text style={styles.traitName}>{trait.name}</Text>
          <Text style={styles.traitDescription}>{trait.description}</Text>
        </View>
        <ChevronRight size={16} color="#8B7BD8" />
      </View>

      <View style={styles.progressBar}>
        <LinearGradient
          colors={[trait.color, `${trait.color}80`]}
          style={[styles.progressFill, { width: `${trait.score * 100}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      
      {/* <View style={styles.prosConsPreview}>
        <View style={styles.prosSection}>
          <Text style={styles.sectionTitle}>✅ Strengths</Text>
          <Text style={styles.previewText}>
            {trait.pros.slice(0, 2).join(' • ')}
          </Text>
        </View>
        <View style={styles.consSection}>
          <Text style={styles.sectionTitle}>⚠️ Challenges</Text>
          <Text style={styles.previewText}>
            {trait.cons.slice(0, 2).join(' • ')}
          </Text>
        </View>
      </View> */}
      
      <Text style={styles.xpText}>
        {trait.scoreData.currentXP} / {trait.scoreData.levelUpXP} XP
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  traitInfo: {
    flex: 1,
  },
  traitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  traitDescription: {
    fontSize: 14,
    color: '#8B7BD8',
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(139, 123, 216, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7BD8',
    textAlign: 'right',
    marginTop: 8,
  },
  prosConsPreview: {
    marginTop: 12,
  },
  prosSection: {
    marginBottom: 8,
  },
  consSection: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 11,
    color: '#8B7BD8',
    lineHeight: 14,
  },
});