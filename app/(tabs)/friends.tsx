import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, UserPlus, Users, Trophy, Flame, Star, Signal } from 'lucide-react-native';
import ScreenLayout from '../../components/ScreenLayout';
import { Colors } from '../../constants/colors';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  currentStreak: number;
  totalXP: number;
  level: number;
  isOnline: boolean;
  lastActive: string;
  mutualFriends?: number;
  trait: 'agreeableness' | 'extroversion' | 'conscientiousness' | 'neuroticism';
}

const TRAIT_IMAGE: Record<Friend['trait'], any> = {
  agreeableness: require('../../assets//images/agreeableness.png'),
  extroversion: require('../../assets/images/extroversion.png'),
  conscientiousness: require('../../assets/images/conscientiousness.png'),
  neuroticism: require('../../assets/images/neuroticism.png'),
};

const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Alex Chen',
    username: '@alexchen',
    currentStreak: 12,
    totalXP: 2840,
    level: 8,
    isOnline: true,
    lastActive: '2 minutes ago',
    mutualFriends: 3,
    trait: 'extroversion',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    username: '@sarahj',
    currentStreak: 7,
    totalXP: 1920,
    level: 6,
    isOnline: false,
    lastActive: '1 hour ago',
    mutualFriends: 1,
    trait: 'agreeableness',
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    username: '@miker',
    currentStreak: 25,
    totalXP: 4560,
    level: 12,
    isOnline: true,
    lastActive: '5 minutes ago',
    mutualFriends: 5,
    trait: 'conscientiousness',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    username: '@emmaw',
    currentStreak: 3,
    totalXP: 980,
    level: 4,
    isOnline: false,
    lastActive: '3 hours ago',
    mutualFriends: 2,
    trait: 'neuroticism',
  },
  {
    id: '5',
    name: 'David Kim',
    username: '@davidk',
    currentStreak: 18,
    totalXP: 3200,
    level: 9,
    isOnline: true,
    lastActive: '1 minute ago',
    mutualFriends: 4,
    trait: 'agreeableness',
  }
];

export default function FriendsScreen() {
  const [friends] = useState<Friend[]>(mockFriends);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = friends.filter(friend => friend.isOnline);
  const topStreakFriend = friends.reduce((prev, current) => 
    (prev.currentStreak > current.currentStreak) ? prev : current
  );

  const renderFriendCard = (friend: Friend) => (
    <TouchableOpacity key={friend.id} style={styles.friendCard}>
      <View style={styles.friendHeader}>
        <View style={styles.avatarContainer}>
          <Image source={TRAIT_IMAGE[friend.trait]} style={styles.avatarImage} />
          {friend.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{friend.name}</Text>
          <Text style={styles.friendUsername}>{friend.username}</Text>
          <Text style={styles.lastActive}>
            {friend.isOnline ? 'Online' : `Last seen ${friend.lastActive}`}
          </Text>
        </View>
        <View style={styles.friendStats}>
          <View style={styles.statItem}>
            <Flame size={14} color="#FFD700" />
            <Text style={styles.statText}>{friend.currentStreak}</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={14} color="#8B7BD8" />
            <Text style={styles.statText}>{friend.totalXP.toLocaleString()}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.friendFooter}>
        <View style={styles.levelBadge}>
          <Trophy size={12} color="#FFD700" />
          <Text style={styles.levelText}>Level {friend.level}</Text>
        </View>
        {friend.mutualFriends && (
          <Text style={styles.mutualText}>
            {friend.mutualFriends} mutual friends
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout disableBottomSafeArea>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Friends</Text>
          <TouchableOpacity style={styles.addButton}>
            <UserPlus size={24} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={20} color="#8B7BD8" />
            <Text style={styles.statNumber}>{friends.length}</Text>
            <Text style={styles.statLabel}>Total Friends</Text>
          </View>
          <View style={styles.statCard}>
            <Signal size={20} color="#4ADE80" />
            <Text style={styles.statNumber}>{onlineFriends.length}</Text>
            <Text style={styles.statLabel}>Online Now</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={20} color="#4ADE80" />
            <Text style={styles.statNumber}>{topStreakFriend.currentStreak}</Text>
            <Text style={styles.statLabel}>Top Streak</Text>
          </View>
        </View>

        {/* Search Bar */}
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

        {/* Friends List */}
        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${filteredFriends.length})` : 'All Friends'}
          </Text>
          {filteredFriends.map(renderFriendCard)}
        </View>

        {/* Bottom Spacer */}
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
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7BD8',
    marginTop: 4,
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
  friendsSection: {
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  friendCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.2)',
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  friendUsername: {
    fontSize: 14,
    color: '#8B7BD8',
    marginTop: 2,
  },
  lastActive: {
    fontSize: 12,
    color: '#8B7BD8',
    marginTop: 2,
  },
  friendStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  friendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
  },
  mutualText: {
    fontSize: 12,
    color: '#8B7BD8',
  },
  bottomSpacer: {
    height: 20,
  },
});
