// API Service for Soulseed App
// This file contains mock API functions that would be replaced with actual API calls

import { getSoulseedByPersonality, SoulseedData as SoulseedDataType } from '../data/soulseeds';

export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  sessionId?: string;
}

// Mock API Base URL - replace with actual API endpoint
const API_BASE_URL = 'https://api.soulseed.com';

// Set to true to use mock functions, false for real API calls
const USE_MOCK_API = true;

/**
 * Submit personality assessment results
 */
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

/**
 * Generate soulseed based on personality scores
 */
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

/**
 * Register user account
 */
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

/**
 * Generate mock soulseed based on personality traits
 * Uses the soulseed data from the data file
 */
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

/**
 * Mock API functions for development
 * These simulate network delays and can be used for testing
 */
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
};
