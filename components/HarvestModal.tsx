import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GeneratedFruit } from '@/data/moodFruits';
import { Colors } from '@/constants/colors';

interface HarvestModalProps {
  visible: boolean;
  fruit: GeneratedFruit | null;
  onClose: () => void;
  xpReward: number;
}

export function HarvestModal({ visible, fruit, onClose, xpReward }: HarvestModalProps) {
  if (!fruit) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Harvest Complete! 🍑</Text>
          <Image source={fruit.image} style={styles.fruitImage} resizeMode="contain" />
          <Text style={styles.subtitle}>You grew a {fruit.speciesName}!</Text>
          <Text style={styles.description}>Dominant mood: {fruit.dominantMood}</Text>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardText}>+{xpReward} XP to {`your Soulseed`}</Text>
            <Text style={styles.rewardSubtext}>This fruit has also been saved to your pantry as a weekly memory.</Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(41, 37, 72, 0.95)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.4)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  fruitImage: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#C3B4FF',
    marginBottom: 20,
  },
  rewardBox: {
    width: '100%',
    backgroundColor: 'rgba(139, 123, 216, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.3)',
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 8,
  },
  rewardSubtext: {
    fontSize: 13,
    color: '#C3B4FF',
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#1A103D',
    fontWeight: '700',
    fontSize: 16,
  },
});
