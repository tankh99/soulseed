import { MoodType } from '@/data/enums';
import { MoodEntry } from './../data/moodFruits';
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

export interface Soulseed {
  name: string;
  level: number;
  personality: {
    openness: number;
    conscientiousness: number;
    extroversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: 'core' | 'bonus';
  completed: boolean;
  relatedTrait?: keyof PersonalityScores;
  cta: string;
  callbackUrl?: string;
}

export interface Trait {
  name: string;
  score: number;
  description: string;
  color: string;
  icon: any;
  pros: string[];
  cons: string[];
  scoreData: {
    currentXP: number;
    levelUpXP: number;
  };
}

export const SoulseedData: Soulseed = {
  name: 'Astra',
  level: 2,
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
export const TraitInfo: Record<keyof typeof PersonalityScores, Trait> = {
  openness: {
    name: 'Openness',
    score: PersonalityScores.openness.currentXP / PersonalityScores.openness.levelUpXP,
    description: 'Curious, imaginative, and open to new experiences.',
    color: '#3498db',
    icon: '🎨',
    pros: ['Highly creative', 'Intellectually curious', 'Appreciates art and beauty'],
    cons: ['Prone to risky behavior', 'Can be seen as unpredictable', 'May struggle with routine'],
    scoreData: PersonalityScores.openness,
  },
  conscientiousness: {
    name: 'Conscientiousness',
    score: PersonalityScores.conscientiousness.currentXP / PersonalityScores.conscientiousness.levelUpXP,
    description: 'Organized, dependable, and self-disciplined.',
    color: '#2ecc71',
    icon: '📋',
    pros: ['Reliable and responsible', 'Strong sense of duty', 'Good at planning and organizing'],
    cons: ['Can be inflexible', 'May struggle with spontaneity', 'Prone to perfectionism'],
    scoreData: PersonalityScores.conscientiousness,
  },
  extroversion: {
    name: 'Extroversion',
    score: PersonalityScores.extroversion.currentXP / PersonalityScores.extroversion.levelUpXP,
    description: 'Outgoing, energetic, and sociable.',
    color: '#f1c40f',
    icon: '🌟',
    pros: ['Enjoys social situations', 'Makes friends easily', 'Often optimistic and enthusiastic'],
    cons: ['May be impulsive', 'Can be seen as attention-seeking', 'May dislike spending time alone'],
    scoreData: PersonalityScores.extroversion,
  },
  agreeableness: {
    name: 'Agreeableness',
    score: PersonalityScores.agreeableness.currentXP / PersonalityScores.agreeableness.levelUpXP,
    description: 'Compassionate, cooperative, and trusting.',
    color: '#e74c3c',
    icon: '❤️',
    pros: ['Cooperative and helpful', 'Empathetic and considerate', 'Good at resolving conflicts'],
    cons: ['May avoid confrontation', 'Can be taken advantage of', 'May struggle to assert own needs'],
    scoreData: PersonalityScores.agreeableness,
  },
  neuroticism: {
    name: 'Neuroticism',
    score: PersonalityScores.neuroticism.currentXP / PersonalityScores.neuroticism.levelUpXP,
    description: 'Experiences a range of emotions, can be sensitive to stress.',
    color: '#9b59b6',
    icon: '🧠',
    pros: ['In touch with their emotions', 'Can be highly empathetic', 'Often prepared for worst-case scenarios'],
    cons: ['Prone to anxiety and worry', 'Can be emotionally reactive', 'May struggle with stress'],
    scoreData: PersonalityScores.neuroticism,
  },
};


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
