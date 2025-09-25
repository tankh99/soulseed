import { Platform } from 'react-native';
import type { CopingRecommendation } from './api';

export type JournalConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export interface SubmitJournalEntryPayload {
  mood: string;
  text: string;
}

export interface JournalQuest {
  id: string;
  title: string;
  description: string;
  reward: { xp: number };
  icon: string;
  callbackUrl?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  mood: string;
  text: string;
  createdAt: string;
  coping?: CopingRecommendation;
  questId?: string;
}

export interface SubmitJournalEntryResponse {
  success: boolean;
  entry?: JournalEntry;
  coping?: CopingRecommendation;
  quest?: JournalQuest;
}

export interface NextQuestionPayload {
  mood: string;
  journalText: string;
  step: number;
  conversation: JournalConversationMessage[];
}

export interface NextQuestionResponse {
  question: string;
  isFinalStep: boolean;
}

export interface CompleteConversationPayload {
  mood?: string;
  journalText?: string;
  conversation: JournalConversationMessage[];
}

export interface CompleteConversationResponse {
  success: boolean;
  transcript: {
    id: string;
    mood?: string;
    journalText?: string;
    messages: Array<JournalConversationMessage & { timestamp: string }>;
    createdAt: string;
  };
}

function stripTrailingSlash(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function resolveBaseUrl() {
  const envBase = process.env.EXPO_PUBLIC_JOURNAL_API_URL?.trim();
  if (envBase) {
    return stripTrailingSlash(envBase);
  }

  const genericBase = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (genericBase) {
    return `${stripTrailingSlash(genericBase)}/api/journal`;
  }

  const fallback = Platform.select({
    ios: 'http://localhost:3003/api/journal',
    android: 'http://10.0.2.2:3003/api/journal',
    default: 'http://localhost:3003/api/journal',
  });

  return fallback ? stripTrailingSlash(fallback) : 'http://localhost:3003/api/journal';
}

const JOURNAL_API_BASE_URL = resolveBaseUrl();

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${JOURNAL_API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage = typeof body === 'string' ? body : body?.message;
    throw new Error(errorMessage || `Request failed with status ${response.status}`);
  }

  return body as T;
}

export async function submitJournalEntry(payload: SubmitJournalEntryPayload): Promise<SubmitJournalEntryResponse> {
  return request<SubmitJournalEntryResponse>('/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchNextQuestion(payload: NextQuestionPayload): Promise<NextQuestionResponse> {
  return request<NextQuestionResponse>('/conversation/next', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function completeConversation(payload: CompleteConversationPayload): Promise<CompleteConversationResponse> {
  return request<CompleteConversationResponse>('/conversation/complete', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { JOURNAL_API_BASE_URL };
