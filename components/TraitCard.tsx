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
  tips: string[];
}

interface TraitCardProps {
  trait: Trait;
}

export function TraitCard({ trait }: TraitCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${trait.color}20` }]}>
          <Text style={styles.icon}>{trait.icon}</Text>
        </View>
        <View style={styles.traitInfo}>
          <Text style={styles.traitName}>{trait.name}</Text>
          <Text style={styles.traitDescription}>{trait.description}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{Math.round(trait.score * 100)}%</Text>
          <ChevronRight size={16} color="#8B7BD8" />
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[trait.color, `${trait.color}80`]}
            style={[styles.progressFill, { width: `${trait.score * 100}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Growth tips:</Text>
        {trait.tips.slice(0, 2).map((tip, index) => (
          <Text key={index} style={styles.tip}>• {tip}</Text>
        ))}
      </View>
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
    marginBottom: 16,
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
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
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
  tipsContainer: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tip: {
    fontSize: 12,
    color: '#8B7BD8',
    lineHeight: 16,
    marginBottom: 4,
  },
});