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
  resilience: { currentXP: 300, levelUpXP: 1000 },
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
      'Create spaces that inspire creativity and new ideas',
      'Surround yourself with diverse perspectives and experiences',
      'Choose flexible routines that allow for spontaneity and exploration'
    ]
  },
  {
    name: 'Conscientiousness',
    score: PersonalityScores.conscientiousness.currentXP / PersonalityScores.conscientiousness.levelUpXP,
    description: 'Your organization and goal-oriented nature',
    color: '#4CAF50',
    icon: '📋',
    tips: [
      'Design environments that support your need for structure and planning',
      'Build systems that help you feel accomplished and in control',
      'Create accountability partnerships that match your commitment style'
    ]
  },
  {
    name: 'Extraversion',
    score: PersonalityScores.extroversion.currentXP / PersonalityScores.extroversion.levelUpXP,
    description: 'Your social energy and outgoing nature',
    color: '#FF9800',
    icon: '🌟',
    tips: [
      'Choose social environments that energize and inspire you',
      'Build networks that support both your need for connection and personal growth',
      'Create opportunities for meaningful interactions that align with your values'
    ]
  },
  {
    name: 'Agreeableness',
    score: PersonalityScores.agreeableness.currentXP / PersonalityScores.agreeableness.levelUpXP,
    description: 'Your compassion and cooperation with others',
    color: '#E91E63',
    icon: '❤️',
    tips: [
      'Cultivate relationships that honor your caring nature while respecting your boundaries',
      'Choose communities and causes that align with your values and desire to help',
      'Create environments where cooperation and harmony feel natural and fulfilling'
    ]
  },
  {
    name: 'Resilience',
    score: PersonalityScores.resilience.currentXP / PersonalityScores.resilience.levelUpXP,
    description: 'Your emotional stability and stress response',
    color: '#9C27B0',
    icon: '💪',
    tips: [
      'Design your lifestyle to minimize unnecessary stress while building your capacity to handle challenges',
      'Create support systems and routines that help you maintain emotional balance',
      'Choose environments and relationships that promote your well-being and personal strength'
    ]
  }
];
