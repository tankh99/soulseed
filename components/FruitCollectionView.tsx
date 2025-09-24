import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MockHarvestedFruits } from '@/constants/userData';
import { HarvestedFruit } from '@/data/moodFruits';
import { format, parseISO } from 'date-fns';

type CalendarGroup = {
  label: string;
  items: HarvestedFruit[];
};

function groupByMonth(fruits: HarvestedFruit[]): CalendarGroup[] {
  const groups: Record<string, HarvestedFruit[]> = {};

  fruits.forEach(item => {
    const date = parseISO(item.harvestedAt);
    const key = format(date, 'MMMM yyyy');
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return Object.entries(groups).map(([label, items]) => ({ label, items })).sort((a, b) => {
    const aDate = parseISO(a.items[0].harvestedAt).getTime();
    const bDate = parseISO(b.items[0].harvestedAt).getTime();
    return bDate - aDate;
  });
}

export default function FruitCollectionView() {
  const harvested: HarvestedFruit[] = useMemo(() => MockHarvestedFruits, []);
  const grouped = useMemo(() => groupByMonth(harvested), [harvested]);

  if (harvested.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Your Pantry is Empty</Text>
        <Text style={styles.emptySubtitle}>Journal this week to grow and harvest your first fruit!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}
    >
      <View style={styles.calendarHeader}>
        <Text style={styles.sectionTitle}>Harvest History</Text>
        <Text style={styles.sectionSubtitle}>Browse fruits by month</Text>
      </View>

      {grouped.map(group => (
        <View key={group.label} style={styles.monthSection}>
          <Text style={styles.monthLabel}>{group.label}</Text>
          <View style={styles.grid}>
            {group.items.map(item => (
              <TouchableOpacity key={item.id} style={styles.card}>
                <View style={[styles.imagePlaceholder, { backgroundColor: item.fruit.displayColor }]} />
                <Text style={styles.cardTitle}>{item.fruit.speciesName}</Text>
                <Text style={styles.cardSubtitle}>
                  Harvested {format(parseISO(item.harvestedAt), 'MMM d, yyyy')}
                </Text>
                <Text style={styles.cardMood}>
                  Dominant Mood: {item.fruit.dominantMood}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
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
  calendarHeader: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#8B7BD8',
    marginTop: 4,
  },
  monthSection: {
    marginTop: 16,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '46%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,123,216,0.3)',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    opacity: 0.9,
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
