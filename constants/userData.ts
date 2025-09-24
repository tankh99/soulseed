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
  extroversion: { currentXP: 700, levelUpXP: 1000 },
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
    callbackUrl: '/(tabs)/friends',
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
  pros: string[];
  cons: string[];
}> = [
  {
    name: 'Openness',
    score: PersonalityScores.openness.currentXP / PersonalityScores.openness.levelUpXP,
    description: 'Your imagination and curiosity about the world',
    color: '#8B7BD8',
    icon: '🎨',
    pros: [
      'Highly creative and imaginative',
      'Open to new experiences and ideas',
      'Flexible and adaptable to change',
      'Good at thinking outside the box'
    ],
    cons: [
      'May struggle with routine and structure',
      'Can be easily distracted by new ideas',
      'Sometimes impractical or unrealistic',
      'May have difficulty with detailed planning'
    ]
  },
  {
    name: 'Conscientiousness',
    score: PersonalityScores.conscientiousness.currentXP / PersonalityScores.conscientiousness.levelUpXP,
    description: 'Your organization and goal-oriented nature',
    color: '#4CAF50',
    icon: '📋',
    pros: [
      'Highly organized and reliable',
      'Strong work ethic and self-discipline',
      'Good at planning and following through',
      'Detail-oriented and thorough'
    ],
    cons: [
      'May be overly rigid or inflexible',
      'Can be perfectionistic and self-critical',
      'May struggle with spontaneity',
      'Can be too focused on work over play'
    ]
  },
  {
    name: 'Extroversion',
    score: PersonalityScores.extroversion.currentXP / PersonalityScores.extroversion.levelUpXP,
    description: 'Your social energy and outgoing nature',
    color: '#FF9800',
    icon: '🌟',
    pros: [
      'Energized by social interactions',
      'Natural leadership and communication skills',
      'Comfortable in group settings',
      'Good at networking and building relationships'
    ],
    cons: [
      'May struggle with solitude and quiet time',
      'Can be impulsive or speak without thinking',
      'May have difficulty with deep, focused work',
      'Can be overwhelming for more introverted people'
    ]
  },
  {
    name: 'Agreeableness',
    score: PersonalityScores.agreeableness.currentXP / PersonalityScores.agreeableness.levelUpXP,
    description: 'Your compassion and cooperation with others',
    color: '#E91E63',
    icon: '❤️',
    pros: [
      'Highly empathetic and compassionate',
      'Great at building and maintaining relationships',
      'Natural peacemaker and team player',
      'Trustworthy and cooperative'
    ],
    cons: [
      'May struggle to say no or set boundaries',
      'Can be taken advantage of by others',
      'May avoid necessary conflicts',
      'Can be overly trusting or naive'
    ]
  },
  {
    name: 'Neuroticism',
    score: PersonalityScores.neuroticism.currentXP / PersonalityScores.neuroticism.levelUpXP,
    description: 'Your emotional stability and tendency toward negative emotions',
    color: '#9C27B0',
    icon: '🧠',
    pros: [
      'Highly sensitive and emotionally aware',
      'Good at detecting potential problems early',
      'Can be very creative when channeled positively',
      'Often very caring and empathetic'
    ],
    cons: [
      'Prone to anxiety and worry',
      'May overreact to minor stressors',
      'Can be emotionally volatile',
      'May struggle with self-confidence'
    ]
  }
];

import { MoodEntry, MoodType, HarvestedFruit, WeeklyMoodSummary } from '@/data/moodFruits';

const now = new Date();

function daysAgo(days: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const MockMoodEntries: MoodEntry[] = [
  { id: 'm1', timestamp: daysAgo(0), mood: MoodType.JOY },
  { id: 'm2', timestamp: daysAgo(1), mood: MoodType.JOY },
  { id: 'm3', timestamp: daysAgo(1), mood: MoodType.CALM },
  { id: 'm4', timestamp: daysAgo(2), mood: MoodType.STRESS },
  { id: 'm5', timestamp: daysAgo(3), mood: MoodType.JOY },
  { id: 'm6', timestamp: daysAgo(4), mood: MoodType.JOY },
  { id: 'm7', timestamp: daysAgo(6), mood: MoodType.CALM },
];

export const MockHarvestedFruits: HarvestedFruit[] = [
  {
    id: 'demo-harvest-1',
    harvestedAt: daysAgo(3),
    fruit: {
      speciesName: 'Sunstone Peach',
      displayColor: '#FF8FA6',
      growthStage: 'ripe',
      dominantMood: MoodType.JOY,
      intensity: 0.75,
      image: require('@/assets/images/fruits/fruits_orange_full.png'),
      summary: {
        startDate: daysAgo(9),
        endDate: daysAgo(3),
        totalEntries: 6,
        moodCounts: {
          [MoodType.JOY]: 4,
          [MoodType.CALM]: 1,
          [MoodType.STRESS]: 1,
        },
      },
    },
  },
  {
    id: 'demo-harvest-2',
    harvestedAt: daysAgo(10),
    fruit: {
      speciesName: 'Citrine Citrus',
      displayColor: '#FFD24C',
      growthStage: 'half_grown',
      dominantMood: MoodType.STRESS,
      intensity: 0.6,
      image: require('@/assets/images/fruits/fruits_orange_full.png'),
      summary: {
        startDate: daysAgo(16),
        endDate: daysAgo(10),
        totalEntries: 4,
        moodCounts: {
          [MoodType.STRESS]: 3,
          [MoodType.CALM]: 1,
        },
      },
    },
  },
];
