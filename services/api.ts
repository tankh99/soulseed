// API Service for Soulseed App
// This file contains mock API functions that would be replaced with actual API calls

import { getSoulseedByPersonality, SoulseedData as SoulseedDataType } from '../data/soulseeds';
import { MockQuests } from '@/constants/userData';

// ---------- Global config ----------
const USE_MOCK_API = false; // set to true to enable mock API for ALL functions
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'; // your API gateway if any
const AI_BASE_URL  = process.env.EXPO_PUBLIC_AI_BASE_URL  ?? 'http://localhost:3002/api/ai'; // ai-service base

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

export interface JournalCompletionPayload {
  text: string;
  mood: string;
}

export interface JournalCompletionResponse {
  success: boolean;
  coping?: CopingRecommendation;
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

  submitJournalEntry: async ({ text, mood }: JournalCompletionPayload): Promise<JournalCompletionResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lower = text.toLowerCase();
    const mentionsAcademics = ['exam', 'assignment', 'school', 'study', 'revision', 'grades'].some(word => lower.includes(word));
    const mentionsStress = ['stress', 'stressful', 'overwhelmed', 'pressure'].some(word => lower.includes(word));

    if (!mentionsAcademics && !mentionsStress) {
      return { success: true };
    }

    const questId = 'study-buddy-quest';
    const hasQuestAlready = MockQuests.some(q => q.id === questId);
    if (!hasQuestAlready) {
      MockQuests.push({
        id: questId,
        title: 'Find a study buddy',
        description: 'Reach out to someone to co-work or revise together for 15 minutes.',
        reward: { xp: 35 },
        completed: false,
        icon: '📚',
        callbackUrl: '/(tabs)/(journal)/mood',
      });
    }

    return {
      success: true,
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
