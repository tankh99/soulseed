import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MockHarvestedFruits } from '@/constants/userData';

export default function FruitCollectionView() {
  const harvested = useMemo(() => MockHarvestedFruits, []);

  if (harvested.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Your Pantry is Empty</Text>
        <Text style={styles.emptySubtitle}>Journal this week to grow and harvest your first fruit!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
      {harvested.map(item => (
        <TouchableOpacity key={item.id} style={styles.card}>
          <Image source={item.fruit.image} style={styles.image} resizeMode="contain" />
          <Text style={styles.cardTitle}>{item.fruit.speciesName}</Text>
          <Text style={styles.cardSubtitle}>
            Harvested {new Date(item.harvestedAt).toLocaleDateString()}
          </Text>
          <Text style={styles.cardMood}>
            Dominant Mood: {item.fruit.dominantMood}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8B7BD8',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 32,
  },
  card: {
    width: '46%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,123,216,0.3)',
  },
  image: {
    width: '100%',
    height: 120,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#8B7BD8',
    marginTop: 4,
  },
  cardMood: {
    fontSize: 12,
    color: '#C3B4FF',
    marginTop: 6,
  },
});
