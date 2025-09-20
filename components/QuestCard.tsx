import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Star } from 'lucide-react-native';
import { router } from 'expo-router';

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  icon: string;
  callbackUrl: string;
}

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  const handlePress = () => {
    if (quest.callbackUrl) {
      router.push(quest.callbackUrl as any);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, quest.completed && styles.completed]}
      onPress={handlePress}
      disabled={quest.completed}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.questIcon}>{quest.icon}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, quest.completed && styles.completedText]}>
          {quest.title}
        </Text>
        <Text style={[styles.description, quest.completed && styles.completedDescription]}>
          {quest.description}
        </Text>
      </View>

      <View style={styles.reward}>
        <View style={styles.pointsContainer}>
          <Star size={14} color={quest.completed ? '#8B7BD8' : '#FFD700'} />
          <Text style={[styles.points, quest.completed && styles.completedPoints]}>
            {quest.points}
          </Text>
        </View>
        
        <View style={styles.checkContainer}>
          {quest.completed ? (
            <CheckCircle size={24} color="#4ADE80" />
          ) : (
            <Circle size={24} color="#8B7BD8" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  completed: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  questIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  completedText: {
    color: '#8B7BD8',
  },
  description: {
    fontSize: 14,
    color: '#8B7BD8',
    lineHeight: 18,
  },
  completedDescription: {
    color: '#666',
  },
  reward: {
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  points: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 4,
  },
  completedPoints: {
    color: '#8B7BD8',
  },
  checkContainer: {
    // Styling handled by the icon itself
  },
});