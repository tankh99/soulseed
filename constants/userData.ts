import { Mood } from './moods';
import { MoodType } from '@/data/enums';
import { Trait } from '@/constants/userData';
import { Chapter } from '@/data/chapters';
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

export type MoodEntry = {
  id: string,
  timestamp: string,
  mood: MoodType
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


export const mockLifeSummary = "Your story so far is one of quiet growth. You've navigated academic challenges with resilience, using moments of stress not as setbacks, but as catalysts for self-discovery. Through it all, your connections with friends have been a consistent source of strength and perspective, guiding you toward a path that feels more authentic to who you are becoming.";

export const mockChapterData: Chapter[] = [
  {
    id: '1',
    title: "The Weight of Expectations",
    status: 'completed',
    story: "The semester began under a sky heavy with expectations. My days were a blur of textbooks and lecture halls, each journal entry a testament to the pressure I felt. I wrote about the sinking feeling after an exam, the quiet disappointment that felt too heavy to share. But in that space, a shift began. A conversation with a teacher, a new study plan—slowly, the words in my journal started to change. They became less about the fear of failing and more about the quiet strength I was discovering in myself. It wasn't about the grades anymore; it was about learning that a single result didn't define me.",
    summary: "From the sting of academic disappointment to the empowerment of self-acceptance, this chapter traces a journey of resilience and shifting perspectives.",
    insights: [
      "You found that reaching out for help was a turning point in overcoming challenges.",
      "Journaling helped you process feelings of disappointment and reframe your definition of success.",
      "A structured plan gave you a sense of control and renewed your motivation."
    ]
  },
  {
    id: '2',
    title: "A Canvas of My Own",
    status: 'in_progress',
    story: "Away from the rigid lines of academic life, I found a different kind of canvas. It started with a splash of color, a spontaneous urge to create. My journal entries from this time are filled with a newfound energy, descriptions of watching watercolors bleed across paper, the joy of creating something just for myself. There were moments of frustration, of feeling stuck, but they were different from the pressures of school. This was a creative struggle, a puzzle I was excited to solve. Each brushstroke felt like a step closer to a part of myself I hadn't realized was missing.",
    summary: "This chapter is about embracing creativity as a form of self-discovery and finding a new, personal outlet for expression and growth.",
    insights: [
      "Creative pursuits offer you an effective way to de-stress from academic pressures.",
      "You've learned that it's okay to step away and return to a challenge with a fresh perspective.",
      "Embracing imperfections and 'happy accidents' has been a source of unexpected joy."
    ]
  },
  {
    id: '3',
    title: "The Space Between Us",
    status: 'in_progress',
    story: "The silence between us was deafening. After our argument, my journal became a space to untangle the knot of anger and hurt in my chest. I wrote down everything I couldn't say out loud, the frustration, the sadness, the fear of losing a friendship that meant so much. Rereading my own words, I realized how much of it came from a place of caring. It gave me the clarity I needed to reach out, not with blame, but with a desire to understand. The conversation was hard, but it was honest, and with each word, I felt the space between us shrink, replaced by the warmth of reconciliation.",
    summary: "This chapter navigates the difficult terrain of conflict and resolution in a close friendship, highlighting the power of introspection and honest communication.",
    insights: [
      "Writing down your feelings before a difficult conversation helps you communicate more clearly and calmly.",
      "You value your friendships deeply and are willing to work through challenges to maintain them.",
      "Understanding your own emotions is the first step toward understanding someone else's perspective."
    ]
  }
];
