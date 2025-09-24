import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Search, UserPlus, HeartPulse, Frown, Smile } from 'lucide-react-native';
import ScreenLayout from '../../components/ScreenLayout';
import { Colors } from '../../constants/colors';
import { formatDistanceToNow } from 'date-fns';

const MOOD_SWATCHES: Record<'joyful' | 'calm' | 'stressed' | 'sad' | 'angry' | 'mixed', { color: string; label: string; emoji: string; tone: 'positive' | 'neutral' | 'concern'; } > = {
  joyful:   { color: '#FF8FA6', label: 'Joyful', emoji: '🌼', tone: 'positive' },
  calm:     { color: '#8FBFE0', label: 'Calm', emoji: '🌙', tone: 'neutral' },
  stressed: { color: '#FFD24C', label: 'Stressed', emoji: '⚡️', tone: 'concern' },
  sad:      { color: '#6A78FF', label: 'Low', emoji: '💧', tone: 'concern' },
  angry:    { color: '#FF6A3A', label: 'Fiery', emoji: '🔥', tone: 'concern' },
  mixed:    { color: '#B89CFF', label: 'Mixed', emoji: '🌈', tone: 'neutral' },
};

interface FriendMood {
  state: keyof typeof MOOD_SWATCHES;
  updatedAt: string;
  note: string;
}

interface Friend {
  id: string;
  name: string;
  username: string;
  mood: FriendMood;
  isOnline: boolean;
  lastEntry: string;
}

const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Alex Chen',
    username: '@alexchen',
    mood: { state: 'joyful', updatedAt: new Date().toISOString(), note: 'Excited about the school musical!' },
    isOnline: true,
    lastEntry: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    username: '@sarahj',
    mood: { state: 'stressed', updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), note: 'Feeling overwhelmed with finals.' },
    isOnline: false,
    lastEntry: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    username: '@miker',
    mood: { state: 'calm', updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), note: 'Taking it easy after a long week.' },
    isOnline: true,
    lastEntry: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: '4',
    name: 'Emma Wilson',
    username: '@emmaw',
    mood: { state: 'sad', updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), note: 'Missing grandpa lately.' },
    isOnline: false,
    lastEntry: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: '5',
    name: 'David Kim',
    username: '@davidk',
    mood: { state: 'mixed', updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), note: 'Grateful for friends, worried about exams.' },
    isOnline: true,
    lastEntry: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

function useMoodStats(friends: Friend[]) {
  return useMemo(() => {
    const needingCheckIn = friends.filter(f => MOOD_SWATCHES[f.mood.state].tone === 'concern').length;
    const celebrating = friends.filter(f => MOOD_SWATCHES[f.mood.state].tone === 'positive').length;
    return { needingCheckIn, celebrating };
  }, [friends]);
}

export default function FriendsScreen() {
  const [friends] = useState<Friend[]>(mockFriends);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMoodStats(friends);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriendCard = (friend: Friend) => {
    const swatch = MOOD_SWATCHES[friend.mood.state];
    return (
      <TouchableOpacity key={friend.id} style={styles.friendCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.moodBadge, { backgroundColor: `${swatch.color}33`, borderColor: swatch.color }]}
          >
            <Text style={styles.moodEmoji}>{swatch.emoji}</Text>
            <Text style={styles.moodLabel}>{swatch.label}</Text>
          </View>
          <Text style={styles.timeAgo}>{formatDistanceToNow(new Date(friend.mood.updatedAt), { addSuffix: true })}</Text>
        </View>

        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendHandle}>{friend.username}</Text>

        <Text style={styles.moodNote} numberOfLines={2}>{friend.mood.note}</Text>

        <View style={styles.cardActions}>
          <TouchableOpacity style={[styles.actionButton, { borderColor: swatch.color }]}
          >
            <Text style={[styles.actionButtonText, { color: swatch.color }]}>Send a note</Text>
          </TouchableOpacity>
          {swatch.tone === 'concern' && (
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Check in</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenLayout disableBottomSafeArea>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Friend Pulse</Text>
          <TouchableOpacity style={styles.addButton}>
            <UserPlus size={24} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}> 
            <HeartPulse size={20} color="#FF8FA6" />
            <Text style={styles.statNumber}>{stats.needingCheckIn}</Text>
            <Text style={styles.statLabel}>Need check-in</Text>
          </View>
          <View style={styles.statCard}>
            <Smile size={20} color="#8FBFE0" />
            <Text style={styles.statNumber}>{stats.celebrating}</Text>
            <Text style={styles.statLabel}>Celebrating wins</Text>
          </View>
          <View style={styles.statCard}>
            <Frown size={20} color="#FFD24C" />
            <Text style={styles.statNumber}>{friends.length}</Text>
            <Text style={styles.statLabel}>Total friends</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#8B7BD8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor="#8B7BD8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${filteredFriends.length})` : 'This is how everyone is feeling'}
          </Text>
          {filteredFriends.map(renderFriendCard)}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7BD8',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  friendsSection: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  friendCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeAgo: {
    fontSize: 12,
    color: '#8B7BD8',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  friendHandle: {
    fontSize: 13,
    color: '#8B7BD8',
  },
  moodNote: {
    fontSize: 13,
    color: '#C3B4FF',
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.accent,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A103D',
  },
  bottomSpacer: {
    height: 32,
  },
});
