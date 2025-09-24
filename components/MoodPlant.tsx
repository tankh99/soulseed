import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { MoodPlantStage } from '@/data/moodFruits';

const plantImages: Record<MoodPlantStage, ImageSourcePropType> = {
  seed: require('../assets/images/growth/plant-1.png'),
  sprout: require('../assets/images/growth/plant-2.png'),
  bloom: require('../assets/images/growth/plant-3.png'),
};

interface MoodPlantProps {
  stage: MoodPlantStage;
  isHarvestReady?: boolean;
}

export function MoodPlant({ stage, isHarvestReady = false }: MoodPlantProps) {
  return (
    <View style={[styles.wrapper, isHarvestReady && styles.harvestGlow]}
    >
      <Image source={plantImages[stage]} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  harvestGlow: {
    shadowColor: '#8B7BD8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
});
