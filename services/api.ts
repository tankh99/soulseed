// services/api.ts
// Unified API service for the SoulSeed app.
// - Uses EXPO_PUBLIC_AI_BASE_URL for the AI backend.
// - Provides AI.unpack + AI.getGuidance (mapped to a stable UI shape).
// - Keeps Quests and Soulseed helpers.
// - Includes a small mock for offline/dev.

import {
  getSoulseedByPersonality,
  SoulseedData as SoulseedDataType,
  SOULSEEDS,
} from '../data/soulseeds';
import { MockQuests } from '@/constants/userData';

// -----------------------------
// Env & config
// -----------------------------
const AI_BASE_URL = process.env.EXPO_PUBLIC_AI_BASE_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 15000);

// -----------------------------
// Helpers
// -----------------------------
class ApiError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, opts?: { status?: number; code?: string }) {
    super(message);
    this.name = 'ApiError';
    this.status = opts?.status;
    this.code = opts?.code;
  }
}

async function withTimeout<T>(p: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new ApiError('Request timed out', { code: 'TIMEOUT' })), ms),
    ),
  ]);
}

async function request<T>(
  path: string,
  opts: RequestInit & { base?: string } = {},
): Promise<T> {
  if (!AI_BASE_URL && !opts.base) {
    throw new ApiError('EXPO_PUBLIC_AI_BASE_URL is not set');
  }
  const base = (opts.base ?? AI_BASE_URL).replace(/\/+$/, '');
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers ?? {}),
  };
  const res = await withTimeout(fetch(url, { ...opts, headers }));

  if (!res.ok) {
    let detail: any = null;
    try {
      detail = await res.json();
    } catch {}
    const msg = detail?.message || detail?.error || `HTTP ${res.status}`;
    throw new ApiError(`API error: ${msg}`, { status: res.status });
  }

  if (res.status === 204) return undefined as unknown as T;

  const text = await res.text();
  if (!text) return undefined as unknown as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

// -----------------------------
// AI endpoints (server contract)
// -----------------------------
export type UnpackResult = unknown;

type UnpackRequest = { text: string; mood?: string };

export type JournalGuidance = {
  summary: string;
  strengths: string[];
  suggestions: string[];
  immediateCoping?: string[];
  riskFlags?: string[];
};

// tiny utils
const asString = (v: any) => (typeof v === 'string' ? v.trim() : null);
const asStrArr = (v: any) =>
  Array.isArray(v)
    ? (v.map((x) => (typeof x === 'string' ? x.trim() : null)).filter(Boolean) as string[])
    : null;

// mood-aware defaults (used only if backend omits a field)
const MOOD_PRESETS: Record<string, { coping: string[]; suggestions: string[] }> = {
  stressed: {
    coping: ['Box breathing (4-4-4-4)', '5-4-3-2-1 grounding'],
    suggestions: ['Write 1 next step for tomorrow', 'Schedule a 10-min break'],
  },
  anxious: {
    coping: ['4-7-8 breathing', 'Name-label-reframe (CBT)'],
    suggestions: ['List 3 things in your control', 'Two tiny tasks to start'],
  },
  sad: {
    coping: ['Reach out to a friend', '5-minute walk outside'],
    suggestions: ['Write 2 gratitudes', 'Plan one pleasant activity'],
  },
  angry: {
    coping: ['Physiological sigh ×3', '10-minute walk'],
    suggestions: ['Write but don’t send the message', 'Wait 20 minutes, then decide'],
  },
  neutral: {
    coping: ['1-minute mindful breathing'],
    suggestions: ['Set one achievable goal today'],
  },
};
const PRESET = (m?: string) => MOOD_PRESETS[(m ?? 'neutral').toLowerCase()] ?? MOOD_PRESETS.neutral;

function defaultSummary(text?: string) {
  if (!text) return 'You wrote a short reflection. Here’s a concise summary and some next steps.';
  return text.length > 220 ? text.slice(0, 217) + '…' : text;
}
function defaultStrengths(text?: string) {
  const s = ['You acknowledged how you feel', 'You identified at least one cause or trigger'];
  if (text && /plan|next step|schedule/i.test(text)) s.push('You hinted at actionability');
  return s;
}

/**
 * Map your backend’s /unpack result into the stable UI shape.
 * Backend payload example:
 * {
 *   "result": {
 *     "guidance": "free text …",
 *     "summary": "Hello AI (neutral)",
 *     "signals": { "mood": "neutral", "stressors": [], "risk_flags": [] },
 *     "suggestions": ["...", "..."]
 *   }
 * }
 */
function mapFromBackendResult(result: any, input: UnpackRequest): JournalGuidance {
  // direct fields
  const summary = asString(result?.summary) ?? defaultSummary(input.text);
  const baseSuggestions = asStrArr(result?.suggestions) ?? [];

  // optionally split free-text "guidance" into a few extra short lines
  const guidanceText = asString(result?.guidance);
  const extraFromGuidance =
    guidanceText
      ?.split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3)
      .slice(0, 3) ?? [];

  const strengths = asStrArr(result?.strengths) ?? defaultStrengths(input.text);
  const riskFlags = asStrArr(result?.signals?.risk_flags) ?? undefined;

  // merge + de-dupe suggestions
  const suggestions = Array.from(new Set([...extraFromGuidance, ...baseSuggestions]));

  // immediate coping mirrors first couple of concrete actions
  const immediateCoping =
    suggestions.length ? suggestions.slice(0, 2) : PRESET(input.mood).coping;

  return { summary, strengths, suggestions, immediateCoping, riskFlags };
}

/** GET /ping -> { status: string } */
async function aiPing() {
  return await request<{ status: string }>('/ping');
}

/** POST /unpack -> { result: UnpackResult } */
async function aiUnpack(req: UnpackRequest) {
  return await request<{ result: UnpackResult }>('/unpack', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

/** Single entry for screens: always call /unpack then map to UI shape */
async function aiGetGuidance(input: UnpackRequest): Promise<JournalGuidance> {
  try {
    const { result } = await aiUnpack(input);
    const mapped = mapFromBackendResult(result, input);
    // Debug: comment out in prod if noisy
    console.log('[AI] guidance source: backend /unpack (mapped)');
    return mapped;
  } catch (err) {
    console.warn('[AI] /unpack failed; using fallback:', err);
    const preset = PRESET(input.mood);
    return {
      summary: defaultSummary(input.text),
      strengths: defaultStrengths(input.text),
      suggestions: Array.from(new Set([...preset.suggestions, 'Timebox one 10–15 min action'])),
      immediateCoping: preset.coping,
      riskFlags: undefined,
    };
  }
}

// -----------------------------
// Other (existing) app services
// -----------------------------
type PersonalityVector =
  | {
      openness: number;
      conscientiousness: number;
      extroversion: number;
      agreeableness: number;
      neuroticism: number;
    }
  | string;

async function getSoulseed(personality: PersonalityVector): Promise<SoulseedDataType> {
  if (typeof personality === 'string') {
    // If a trait name is passed, resolve directly from SOULSEEDS
    return SOULSEEDS[personality] ?? SOULSEEDS.openness;
  }
  return getSoulseedByPersonality(personality);
}

async function getQuests() {
  return MockQuests;
}

async function completeQuest(id: string) {
  return { ok: true as const, id };
}

// -----------------------------
// Public API surface
// -----------------------------
export const Api = {
  AI: {
    ping: aiPing,
    unpack: aiUnpack,
    getGuidance: aiGetGuidance,
  },
  Quests: {
    list: getQuests,
    complete: completeQuest,
  },
  Soulseed: {
    getByPersonality: getSoulseed,
  },
};

// -----------------------------
// Mock API (for offline/dev demos)
// -----------------------------
export const mockApi = {
  submitJournalEntry: async (text: string, mood?: string) => ({
    summary: text.length > 120 ? text.slice(0, 117) + '...' : text,
    strengths: ['You acknowledged how you feel', 'You identified at least one cause or trigger'],
    suggestions: ['Try a 2-minute breathing exercise', 'Write one actionable step for tomorrow'],
    immediateCoping: ['Box breathing', '5-4-3-2-1 grounding'],
    riskFlags: [],
    mood: mood ?? 'neutral',
    pointsAwarded: 5,
    coping: [
      { title: 'Deep Breathing', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s — repeat 4 times.' },
      { title: 'Name it to tame it', description: 'Label what you feel in 3 words.' },
    ],
  }),
};

export default Api;
