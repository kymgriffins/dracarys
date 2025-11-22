/**
 * Journal Type Definitions
 * Trading journal entities with psychology-focused type contracts
 */

import { z } from 'zod';

// Core Journal Entry
export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: Date;
  session_start_time?: Date;
  session_end_time?: Date;
  pre_session_emotional_state: EmotionalState;
  pre_session_bias_checklist?: Record<string, boolean>;
  trades_count: number;
  session_rating: number; // 1-10
  discipline_score: number; // 1-10
  lessons_learned?: string;
  tomorrow_focus_areas?: string[];
  created_at: Date;
  updated_at: Date;
}

// Emotional States (aligned with psychology research)
export type EmotionalState =
  | 'calm'
  | 'anxious'
  | 'excited'
  | 'frustrated'
  | 'confident'
  | 'unsure'
  | 'overconfident'
  | 'fearful'
  | 'greedy'
  | 'indifferent';

export type DisciplineCategory =
  | 'emotional'
  | 'technical'
  | 'risk_management'
  | 'setup_recognition'
  | 'timing'
  | 'entry_execution'
  | 'exit_execution';

// Zod Schemas
export const EmotionalStateSchema = z.enum([
  'calm', 'anxious', 'excited', 'frustrated', 'confident', 'unsure',
  'overconfident', 'fearful', 'greedy', 'indifferent'
]);

export const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  entry_date: z.date(),
  session_start_time: z.date().optional(),
  session_end_time: z.date().optional(),
  pre_session_emotional_state: EmotionalStateSchema,
  pre_session_bias_checklist: z.record(z.string(), z.boolean()).optional(),
  trades_count: z.number().min(0),
  session_rating: z.number().min(1).max(10),
  discipline_score: z.number().min(1).max(10),
  lessons_learned: z.string().optional(),
  tomorrow_focus_areas: z.array(z.string()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Database Types
export type DatabaseJournalEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  session_start_time: string | null;
  session_end_time: string | null;
  pre_session_emotional_state: string;
  pre_session_bias_checklist: any;
  trades_count: number;
  session_rating: number;
  discipline_score: number;
  lessons_learned: string | null;
  tomorrow_focus_areas: string[] | null;
  created_at: string;
  updated_at: string;
};

// Transform Functions
export function transformDatabaseJournal(dbEntry: DatabaseJournalEntry): JournalEntry {
  return {
    id: dbEntry.id,
    user_id: dbEntry.user_id,
    entry_date: new Date(dbEntry.entry_date),
    session_start_time: dbEntry.session_start_time ? new Date(dbEntry.session_start_time) : undefined,
    session_end_time: dbEntry.session_end_time ? new Date(dbEntry.session_end_time) : undefined,
    pre_session_emotional_state: dbEntry.pre_session_emotional_state as EmotionalState,
    pre_session_bias_checklist: dbEntry.pre_session_bias_checklist as Record<string, boolean> | undefined,
    trades_count: dbEntry.trades_count,
    session_rating: dbEntry.session_rating,
    discipline_score: dbEntry.discipline_score,
    lessons_learned: dbEntry.lessons_learned || undefined,
    tomorrow_focus_areas: dbEntry.tomorrow_focus_areas || undefined,
    created_at: new Date(dbEntry.created_at),
    updated_at: new Date(dbEntry.updated_at),
  };
}

// Validation
export class JournalValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'JournalValidationError';
  }
}

export function validateJournalEntry(data: unknown): JournalEntry {
  const result = JournalEntrySchema.safeParse(data);
  if (!result.success) {
    throw new JournalValidationError(
      `Invalid journal data: ${result.error.issues.map(i => i.message).join(', ')}`,
      result.error.issues[0]?.path[0] as string
    );
  }
  return result.data;
}

export function validateEmotionalState(state: string): state is EmotionalState {
  return EmotionalStateSchema.safeParse(state).success;
}

// Psychology Analytics Types
export interface EmotionalPattern {
  emotional_state: EmotionalState;
  frequency: number;
  avg_discipline_score: number;
  avg_session_rating: number;
}

export interface BiasPattern {
  bias_name: string;
  recognition_rate: number;
  impact_on_performance: number;
}

// Journal Statistics
export interface JournalStats {
  total_entries: number;
  average_discipline_score: number;
  average_session_rating: number;
  most_common_emotional_state: EmotionalState;
  trading_streak: number;
}
