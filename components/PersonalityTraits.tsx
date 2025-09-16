import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extroversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface PersonalityTraitsProps {
  scores: PersonalityScores;
}

export function PersonalityTraits({ scores }: PersonalityTraitsProps) {
  const traits = [
    {
      name: 'Openness',
      score: scores.openness,
      color: '#8B7BD8',
      icon: '🎨',
      description: 'Imagination & curiosity'
    },
    {
      name: 'Conscientiousness',
      score: scores.conscientiousness,
      color: '#4ADE80',
      icon: '📋',
      description: 'Organization & discipline'
    },
    {
      name: 'Extroversion',
      score: scores.extroversion,
      color: '#F59E0B',
      icon: '🎉',
      description: 'Social energy & enthusiasm'
    },
    {
      name: 'Agreeableness',
      score: scores.agreeableness,
      color: '#EC4899',
      icon: '🤝',
      description: 'Cooperation & trust'
    },
    {
      name: 'Neuroticism',
      score: scores.neuroticism,
      color: '#06B6D4',
      icon: '🧘',
      description: 'Emotional sensitivity'
    },
  ];

  return (
    <View style={styles.container}>
      {traits.map((trait, index) => (
        <View key={index} style={styles.traitCard}>
          <View style={styles.traitHeader}>
            <View style={styles.traitIcon}>
              <Text style={styles.iconText}>{trait.icon}</Text>
            </View>
            <View style={styles.traitInfo}>
              <Text style={styles.traitName}>{trait.name}</Text>
              <Text style={styles.traitDescription}>{trait.description}</Text>
            </View>
            <Text style={styles.traitScore}>
              {Math.round(trait.score * 100)}%
            </Text>
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
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  traitCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  traitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  traitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  traitInfo: {
    flex: 1,
  },
  traitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  traitDescription: {
    fontSize: 12,
    color: '#8B7BD8',
    marginTop: 2,
  },
  traitScore: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(139, 123, 216, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressTrack: {
    width: '100%',
    height: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});