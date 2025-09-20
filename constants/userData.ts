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
  openness: 0.8,
  conscientiousness: 0.6,
  extroversion: 0.7,
  agreeableness: 0.9,
  resilience: 0.7,
} as const;

// Soulseed display data
export const SoulseedData = {
  level: 2,
  name: "Your Cosmic Companion",
  personality: PersonalityScores,
} as const;

// Quest data
export const MockQuests = [
  {
    id: '1',
    title: 'Morning Reflection',
    description: 'Journal about your goals for today',
    points: 25,
    completed: true,
    icon: '🌅',
  },
  {
    id: '2',
    title: 'Gratitude Check',
    description: 'Write down 3 things you\'re grateful for',
    points: 20,
    completed: false,
    icon: '🙏',
  },
  {
    id: '3',
    title: 'Mood Tracker',
    description: 'Record your current emotional state',
    points: 15,
    completed: false,
    icon: '😊',
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
    score: 0.8,
    description: 'Your imagination and curiosity about the world',
    color: '#8B7BD8',
    icon: '🎨',
    tips: [
      'Try creative writing in your journal',
      'Explore new perspectives on familiar topics',
      'Ask "what if" questions more often'
    ]
  },
  {
    name: 'Conscientiousness',
    score: 0.6,
    description: 'Your organization and goal-oriented nature',
    color: '#4CAF50',
    icon: '📋',
    tips: [
      'Set small daily goals in your journal',
      'Track your progress regularly',
      'Celebrate completed tasks'
    ]
  },
  {
    name: 'Extraversion',
    score: 0.7,
    description: 'Your social energy and outgoing nature',
    color: '#FF9800',
    icon: '🌟',
    tips: [
      'Write about social interactions',
      'Reflect on group activities',
      'Share your thoughts with others'
    ]
  },
  {
    name: 'Agreeableness',
    score: 0.9,
    description: 'Your compassion and cooperation with others',
    color: '#E91E63',
    icon: '❤️',
    tips: [
      'Write about helping others',
      'Reflect on conflicts and resolutions',
      'Practice empathy in your entries'
    ]
  },
  {
    name: 'Resilience',
    score: 0.3,
    description: 'Your emotional stability and stress response',
    color: '#9C27B0',
    icon: '💪',
    tips: [
      'Write about challenges you\'ve overcome',
      'Reflect on coping strategies',
      'Focus on growth from difficulties'
    ]
  }
];
