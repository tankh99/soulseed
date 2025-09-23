// Global user data constants
// This file contains mock user data that can be shared across all screens

export const UserStats = {
  totalEntries: 47,
  currentStreak: 7,
  longestStreak: 15,
  totalPoints: 1250,
  level: 2,
  weeklyGoal: 7,
  weeklyProgress: 5,
} as const;

export const PersonalityScores = {
  openness: { currentXP: 800, levelUpXP: 1000 },
  conscientiousness: { currentXP: 600, levelUpXP: 1000 },
  extraversion: { currentXP: 700, levelUpXP: 1000 },
  agreeableness: { currentXP: 900, levelUpXP: 1000 },
  neuroticism: { currentXP: 300, levelUpXP: 1000 },
} as const;

// Soulseed display data
export const SoulseedData = {
  level: 2,
  name: "Astra",
  personality: PersonalityScores,
} as const;

// Quest data
export const MockQuests = [
  {
    id: '1',
    title: 'Morning Reflection',
    description: 'Journal about your goals for today',
    reward: { xp: 25 },
    completed: true,
    icon: '🌅',
    callbackUrl: '/(tabs)/(journal)/entry',
  },
  {
    id: '2',
    title: 'Gratitude Check',
    description: 'Write down 3 things you\'re grateful for',
    reward: { xp: 20 },
    completed: false,
    icon: '🙏',
    callbackUrl: '/(tabs)/(journal)',
  },
  {
    id: '3',
    title: 'Learn About SAMH',
    description: 'Learn more about the community and resources around you',
    reward: { xp: 30 },
    completed: false,
    icon: '😊',
    callbackUrl: 'https://www.samhealth.org.sg/',
  },
  {
    id: '4',
    title: 'Friendship Check',
    description: 'Check in with a friend',
    reward: { xp: 50 },
    completed: false,
    icon: '👬',
    callbackUrl: '/(tabs)/(journal)',
  },
] as const;

// Weekly data for discover screen
export const WeeklyData: {
  moodTrends: Array<{ day: string; mood: string; score: number; }>;
  insights: string[];
  topics: Array<{ topic: string; count: number; }>;
} = {
  moodTrends: [
    { day: 'Mon', mood: 'happy', score: 4 },
    { day: 'Tue', mood: 'neutral', score: 3 },
    { day: 'Wed', mood: 'sad', score: 2 },
    { day: 'Thu', mood: 'happy', score: 5 },
    { day: 'Fri', mood: 'surprised', score: 4 },
    { day: 'Sat', mood: 'happy', score: 5 },
    { day: 'Sun', mood: 'neutral', score: 3 },
  ],
  insights: [
    'You wrote more when feeling grateful',
    'Your energy peaks in the morning',
    'Family time brings you the most joy'
  ],
  topics: [
    { topic: 'Work', count: 8 },
    { topic: 'Relationships', count: 6 },
    { topic: 'Personal growth', count: 5 },
    { topic: 'Family time', count: 4 },
    { topic: 'Future goals', count: 1 }
  ]
};

// Trait information for discover screen
export const TraitInfo: Array<{
  name: string;
  score: number;
  description: string;
  color: string;
  icon: string;
  tips: string[];
}> = [
  {
    name: 'Openness',
    score: PersonalityScores.openness.currentXP / PersonalityScores.openness.levelUpXP,
    description: 'Your imagination and curiosity about the world',
    color: '#8B7BD8',
    icon: '🎨',
    tips: [
      'Notice when you feel most creative and inspired throughout your day',
      'Recognize your natural curiosity and how it drives your interests',
      'Understand that your openness to new experiences is a valuable trait',
      'Be aware of how your imagination influences your problem-solving approach'
    ]
  },
  {
    name: 'Conscientiousness',
    score: PersonalityScores.conscientiousness.currentXP / PersonalityScores.conscientiousness.levelUpXP,
    description: 'Your organization and goal-oriented nature',
    color: '#4CAF50',
    icon: '📋',
    tips: [
      'Notice how structure and planning affect your stress levels and productivity',
      'Recognize your natural drive for achievement and how it motivates you',
      'Understand that your attention to detail is a strength, not a weakness',
      'Be aware of how your conscientiousness influences your relationships and work style'
    ]
  },
  {
    name: 'Extraversion',
    score: PersonalityScores.extraversion.currentXP / PersonalityScores.extraversion.levelUpXP,
    description: 'Your social energy and outgoing nature',
    color: '#FF9800',
    icon: '🌟',
    tips: [
      'Notice how social interactions affect your energy levels throughout the day',
      'Recognize when you feel most energized - in groups or one-on-one conversations',
      'Understand that your need for social connection is a natural part of who you are',
      'Be aware of how your social nature influences your decision-making and mood'
    ]
  },
  {
    name: 'Agreeableness',
    score: PersonalityScores.agreeableness.currentXP / PersonalityScores.agreeableness.levelUpXP,
    description: 'Your compassion and cooperation with others',
    color: '#E91E63',
    icon: '❤️',
    tips: [
      'Notice how conflict and harmony affect your emotional well-being',
      'Recognize your natural tendency to help others and how it makes you feel',
      'Understand that your empathy is a gift that helps you connect with others',
      'Be aware of when you might be putting others\' needs before your own'
    ]
  },
  {
    name: 'Neuroticism',
    score: PersonalityScores.neuroticism.currentXP / PersonalityScores.neuroticism.levelUpXP,
    description: 'Your emotional stability and tendency toward negative emotions',
    color: '#9C27B0',
    icon: '🧠',
    tips: [
      'Notice how you respond to stress and emotional challenges in your daily life',
      'Recognize patterns in your emotional reactions and what triggers them',
      'Understand that emotional sensitivity can be both a strength and a challenge',
      'Be aware of how your emotional responses influence your decision-making and relationships'
    ]
  }
];
