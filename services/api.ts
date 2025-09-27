// API Service for Soulseed App
// This file contains mock API functions that would be replaced with actual API calls

import { getSoulseedByPersonality, SoulseedData as SoulseedDataType } from '../data/soulseeds';
import { MockQuests } from '@/constants/userData';
import { mockJournalEntries as legacyMockJournalEntries } from '@/data/journal';

// ---------- Global config ----------
const USE_MOCK_API = false; // set to true to enable mock API for ALL functions
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'; // your API gateway if any
const AI_BASE_URL  = process.env.EXPO_PUBLIC_AI_BASE_URL  ?? 'http://localhost:3002/api/ai'; // ai-service base
const JOURNAL_BASE_URL = process.env.EXPO_PUBLIC_JOURNAL_BASE_URL ?? 'http://localhost:3003/api/journal';

// ---------- AI Unpack types ----------
export type Mood = 1 | 2 | 3 | 4 | 5;

export interface UnpackResult {
  summary: string;
  signals: { mood: Mood; stressors: string[]; risk_flags: string[] };
  suggestions: string[];
  questions: string[];
}

// AI Unpack (aligned with ApiResponse<T> pattern)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  sessionId?: string;
}

export async function aiUnpack(text: string): Promise<ApiResponse<UnpackResult>> {
  if (USE_MOCK_API) {
    return mockApi.aiUnpack(text);
  }

  try {
    const res = await fetch(`${AI_BASE_URL}/unpack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return {
        success: false,
        error: `unpack failed: ${res.status} ${errText}`.trim(),
      };
    }

    const data = await res.json();
    return {
      success: true,
      data: data.result as UnpackResult,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ---------- Existing types/services (unchanged) ----------
export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extroversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface SoulseedData {
  name: string;
  statement: string;
  level: number;
  personality: PersonalityScores;
  imageUrl?: string;
  trait: string;
  scar: string;
  variationSlots: string[];
  growthExpression: string[];
  palette: string[];
}

export interface CopingRecommendation {
  theme: string;
  strategies: string[];
  followUpQuest?: string;
}

export interface JournalQuest {
  id: string;
  title: string;
  description: string;
  reward?: { xp: number };
  icon?: string;
  callbackUrl?: string;
}

export interface JournalEntryRecord {
  id: string;
  mood: string;
  text: string;
  createdAt: string;
  coping?: CopingRecommendation;
  questId?: string;
}

export interface JournalCompletionPayload {
  text: string;
  mood: string;
}

export interface JournalCompletionResponse {
  success: boolean;
  entry?: JournalEntryRecord;
  coping?: CopingRecommendation;
  quest?: JournalQuest;
  error?: string;
}

export interface JournalEntriesResponse {
  success: boolean;
  entries: JournalEntryRecord[];
  error?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface JournalQuestionResponse {
  success: boolean;
  question?: string;
  isFinalStep?: boolean;
  error?: string;
}

export interface JournalConversationCompleteResponse {
  success: boolean;
  transcript?: {
    id: string;
    mood?: string;
    journalText?: string;
    messages: ConversationMessage[];
    createdAt: string;
  };
  error?: string;
}

const MOCK_MOOD_QUESTIONS: Record<string, string[]> = {
  happy: [
    "What made this moment so special for you?",
    "How can you recreate this feeling in other parts of your life?",
    "What would you tell someone else who wants to feel this way?",
  ],
  sad: [
    "What's weighing on your heart right now?",
    "What support do you need during this difficult time?",
    "What small step could you take to care for yourself today?",
  ],
  angry: [
    "What triggered this feeling in you?",
    "What boundaries might you need to set?",
    "How can you channel this energy constructively?",
  ],
  surprised: [
    "What caught you off guard about this situation?",
    "How does this change your perspective?",
    "What new possibilities does this open up?",
  ],
  neutral: [
    "What's on your mind right now?",
    "What would you like to explore or understand better?",
    "How are you feeling about your current state?",
  ],
};

function mapLegacyEntries(): JournalEntryRecord[] {
  return legacyMockJournalEntries.map((entry) => ({
    id: entry.id,
    mood: entry.mood,
    text: entry.content,
    createdAt: entry.date,
    questId: entry.chapterId,
  }));
}

function syncQuestWithMock(quest?: JournalQuest) {
  if (!quest) return;
  const exists = MockQuests.some((q) => q.id === quest.id);
  if (exists) return;
  MockQuests.push({
    id: quest.id,
    title: quest.title,
    description: quest.description,
    reward: { xp: quest.reward?.xp ?? 0 },
    completed: false,
    icon: quest.icon,
    callbackUrl: quest.callbackUrl,
  });
}

export async function fetchJournalEntries(): Promise<JournalEntriesResponse> {
  if (USE_MOCK_API) {
    return { success: true, entries: mapLegacyEntries() };
  }

  try {
    const response = await fetch(`${JOURNAL_BASE_URL}/entries`);
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        success: false,
        entries: [],
        error: `Failed to fetch journal entries: ${response.status} ${errorText}`.trim(),
      };
    }

    const data = await response.json();
    const entries = Array.isArray(data.entries)
      ? (data.entries as JournalEntryRecord[])
      : [];

    return { success: true, entries };
  } catch (error) {
    return {
      success: false,
      entries: [],
      error: error instanceof Error ? error.message : 'Unknown error fetching journal entries',
    };
  }
}

export async function submitJournalEntry(
  payload: JournalCompletionPayload
): Promise<JournalCompletionResponse> {
  if (USE_MOCK_API) {
    return mockApi.submitJournalEntry(payload);
  }

  try {
    const response = await fetch(`${JOURNAL_BASE_URL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        success: false,
        error: `Failed to submit journal entry: ${response.status} ${errorText}`.trim(),
      };
    }

    const data = await response.json();
    const result: JournalCompletionResponse = {
      success: Boolean(data.success),
      entry: data.entry as JournalEntryRecord | undefined,
      coping: data.coping as CopingRecommendation | undefined,
      quest: data.quest as JournalQuest | undefined,
    };

    if (!result.success) {
      result.error = data.message ?? 'Journal entry submission failed';
      return result;
    }

    syncQuestWithMock(result.quest);

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error submitting journal entry',
    };
  }
}

export async function getNextJournalQuestion(
  payload: {
    mood: string;
    journalText: string;
    step: number;
    conversation: ConversationMessage[];
  }
): Promise<JournalQuestionResponse> {
  if (USE_MOCK_API) {
    return mockApi.getNextJournalQuestion(payload);
  }

  try {
    const response = await fetch(`${JOURNAL_BASE_URL}/conversation/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        success: false,
        error: `Failed to fetch next question: ${response.status} ${errorText}`.trim(),
      };
    }

    const data = await response.json();
    return {
      success: true,
      question: data.question as string,
      isFinalStep: Boolean(data.isFinalStep),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error fetching next question',
    };
  }
}

export async function completeJournalConversation(
  payload: {
    mood?: string;
    journalText?: string;
    conversation: ConversationMessage[];
  }
): Promise<JournalConversationCompleteResponse> {
  if (USE_MOCK_API) {
    return mockApi.completeJournalConversation(payload);
  }

  try {
    const response = await fetch(`${JOURNAL_BASE_URL}/conversation/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        success: false,
        error: `Failed to complete conversation: ${response.status} ${errorText}`.trim(),
      };
    }

    const data = await response.json();
    return {
      success: Boolean(data.success),
      transcript: data.transcript,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error completing conversation',
    };
  }
}

export interface RegistrationData {
  email: string;
  password: string;
  birthday: string;
  schoolYear: string;
  ethnicity: string;
  gender: string;
  soulseedName: string;
  soulseedTagline: string;
  sessionId: string;
}

// Submit personality assessment
export async function submitPersonalityAssessment(
  personality: PersonalityScores
): Promise<ApiResponse<{ sessionId: string }>> {
  if (USE_MOCK_API) {
    return mockApi.submitPersonalityAssessment(personality);
  }

  try {
    // Real API call - replace with actual fetch
    const response = await fetch(`${API_BASE_URL}/submit-personality`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personality,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: { sessionId: data.sessionId || 'temp-session-123' },
      sessionId: data.sessionId || 'temp-session-123',
    };
  } catch (error) {
    console.error('Error submitting personality assessment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Generate soulseed based on personality scores
export async function generateSoulseed(
  personality: PersonalityScores,
  sessionId: string
): Promise<ApiResponse<SoulseedData>> {
  if (USE_MOCK_API) {
    return mockApi.generateSoulseed(personality, sessionId);
  }

  try {
    // Real API call - replace with actual fetch
    const response = await fetch(`${API_BASE_URL}/generate-soulseed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personality,
        sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.soulseed,
    };
  } catch (error) {
    console.error('Error generating soulseed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Register user account
export async function registerUser(
  registrationData: RegistrationData
): Promise<ApiResponse<{ userId: string; token: string }>> {
  if (USE_MOCK_API) {
    return mockApi.registerUser(registrationData);
  }

  try {
    // Real API call - replace with actual fetch
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: {
        userId: data.userId || 'user-123',
        token: data.token || 'mock-jwt-token',
      },
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Generate mock soulseed based on personality traits
// Uses the soulseed data from the data file
function generateMockSoulseed(personality: PersonalityScores): SoulseedData {
  // Get soulseed data based on personality scores
  const soulseedData = getSoulseedByPersonality(personality);

  // Convert to API format
  const soulseed: SoulseedData = {
    name: soulseedData.name,
    statement: soulseedData.statement,
    level: 1,
    personality,
    trait: soulseedData.trait,
    scar: soulseedData.scar,
    variationSlots: soulseedData.variationSlots,
    growthExpression: soulseedData.growthExpression,
    palette: soulseedData.palette,
  };

  return soulseed;
}

export const mockApi = {
  submitPersonalityAssessment: async (personality: PersonalityScores) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: { sessionId: `session-${Date.now()}` },
      sessionId: `session-${Date.now()}`,
    };
  },

  generateSoulseed: async (personality: PersonalityScores, sessionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      data: generateMockSoulseed(personality),
    };
  },

  registerUser: async (registrationData: RegistrationData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      data: {
        userId: `user-${Date.now()}`,
        token: `token-${Date.now()}`,
      },
    };
  },

  fetchJournalEntries: async (): Promise<JournalEntriesResponse> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, entries: mapLegacyEntries() };
  },

  submitJournalEntry: async ({ text, mood }: JournalCompletionPayload): Promise<JournalCompletionResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lower = text.toLowerCase();
    const mentionsAcademics = ['exam', 'assignment', 'school', 'study', 'revision', 'grades'].some(word => lower.includes(word));
    const mentionsStress = ['stress', 'stressful', 'overwhelmed', 'pressure'].some(word => lower.includes(word));

    const entry: JournalEntryRecord = {
      id: `mock-${Date.now()}`,
      mood,
      text,
      createdAt: new Date().toISOString(),
    };

    if (!mentionsAcademics && !mentionsStress) {
      return { success: true, entry };
    }

    const quest: JournalQuest = {
      id: 'study-buddy-quest',
      title: 'Find a study buddy',
      description: 'Reach out to someone to co-work or revise together for 15 minutes.',
      reward: { xp: 35 },
      icon: '📚',
      callbackUrl: '/(tabs)/(journal)/mood',
    };

    syncQuestWithMock(quest);

    return {
      success: true,
      entry,
      quest,
      coping: {
        theme: 'Academic Stress Support',
        strategies: [
          'Try the 25-5 method: study or work for 25 minutes, then take a 5-minute break to stretch or breathe.',
          'Share one worry with a trusted friend or teacher—naming it usually makes it lighter.',
        ],
        followUpQuest: '“Find a study buddy” quest added to your checklist',
      },
    };
  },

  getNextJournalQuestion: async ({ mood, step }: { mood: string; step: number }): Promise<JournalQuestionResponse> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const questions = MOCK_MOOD_QUESTIONS[mood as keyof typeof MOCK_MOOD_QUESTIONS] ?? MOCK_MOOD_QUESTIONS.neutral;
    const index = Math.min(step, questions.length - 1);
    return {
      success: true,
      question: questions[index] ?? "Tell me more about what you're experiencing.",
      isFinalStep: index >= questions.length - 1,
    };
  },

  completeJournalConversation: async (
    payload: { mood?: string; journalText?: string; conversation: ConversationMessage[] }
  ): Promise<JournalConversationCompleteResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      transcript: {
        id: `mock-transcript-${Date.now()}`,
        mood: payload.mood,
        journalText: payload.journalText,
        messages: payload.conversation,
        createdAt: new Date().toISOString(),
      },
    };
  },

  // ---- NEW: mock for AI unpack ----
  aiUnpack: async (text: string): Promise<ApiResponse<UnpackResult>> => {
    await new Promise(r => setTimeout(r, 600));
    return {
      success: true,
      data: {
        summary: "You mentioned school stress and uncertainty about deadlines.",
        signals: { mood: 3 as Mood, stressors: ["school"], risk_flags: [] },
        suggestions: [
          "Try a 25–5 focus block.",
          "Write down the single most urgent task for tomorrow morning."
        ],
        questions: [
          "What specific task feels heaviest right now?",
          "When is the next concrete deadline?",
          "What would make this 1% easier?"
        ],
      }
    };
  },
};
