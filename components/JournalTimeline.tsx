import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMoodData } from '@/constants/moods';
import { Colors } from '@/constants/colors';
import { Image } from 'expo-image';
import { JournalEntryRecord } from '@/services/api';

interface JournalTimelineProps {
  entries: JournalEntryRecord[];
}

export default function JournalTimeline({ entries }: JournalTimelineProps) {
  if (!entries || entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No journal entries for this chapter yet.</Text>
      </View>
    );
  }

  // Sort entries by date, descending
  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={styles.container}>
      {sortedEntries.map((entry, index) => {
        const moodData = getMoodData(entry.mood);
        const isLastItem = index === sortedEntries.length - 1;

        return (
          <View key={entry.id} style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <View style={styles.timelineIcon}>
                <Image source={moodData?.image} style={styles.moodImage} />
                {/* <Text style={styles.moodEmoji}>{moodData?.emoji}</Text> */}
              </View>
              {!isLastItem && <View style={styles.timelineConnector} />}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.entryDate}>
                {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
              <Text style={styles.entryContent}>{entry.text}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 16,
    fontStyle: 'italic',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodImage: {
    width: 40,
    height: 40,
  },
  timelineConnector: {
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  entryDate: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  entryContent: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
