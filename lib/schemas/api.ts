// API Response Schemas for validation
import { z } from 'zod';

// Common API response wrapper
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema,
  error: z.string().optional(),
  timestamp: z.string().datetime()
});

// User API schemas
export const UserProfileResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().optional(),
  trading_experience_level: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
  trading_style: z.enum(['scalper', 'day_trader', 'swing_trader', 'position_trader']).optional()
});

// Journal API schemas
export const JournalEntryResponseSchema = z.object({
  id: z.string().uuid(),
  entry_date: z.string().datetime(),
  discipline_score: z.number().min(1).max(10),
  session_rating: z.number().min(1).max(10),
  emotional_state: z.string()
});

// Validation functions
export function validateApiResponse(data: unknown) {
  return ApiResponseSchema(z.any()).safeParse(data);
}

export function validateUserResponse(data: unknown) {
  return UserProfileResponseSchema.safeParse(data);
}

export function validateJournalResponse(data: unknown) {
  return JournalEntryResponseSchema.safeParse(data);
}
