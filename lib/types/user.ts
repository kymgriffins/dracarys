/**
 * User Type Definitions
 * Core user entity types with strict validation contracts
 */

import { z } from 'zod';

// Core User Profile Types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  timezone: string;
  trading_experience_level: TradingExperienceLevel;
  trading_style?: TradingStyle;
  role: UserRole;
  premium_tier: PremiumTier;
  created_at: Date;
  updated_at: Date;
}

// Trading Experience Levels
export type TradingExperienceLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'professional';

// Trading Styles
export type TradingStyle =
  | 'scalper'
  | 'day_trader'
  | 'swing_trader'
  | 'position_trader';

// Premium Tier Levels
export type PremiumTier =
  | 'free'
  | 'premium'
  | 'mentoring'
  | 'enterprise';

// User Role Types
export type UserRole =
  | 'student'
  | 'mentor'
  | 'admin'
  | 'premium_student'
  | 'pro_mentor';

// User Status
export type UserStatus =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending_verification';

// Zod Schemas for Runtime Validation
export const TradingExperienceLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
  'professional'
]);

export const TradingStyleSchema = z.enum([
  'scalper',
  'day_trader',
  'swing_trader',
  'position_trader'
]).optional();

export const PremiumTierSchema = z.enum([
  'free',
  'premium',
  'mentoring',
  'enterprise'
]);

export const UserStatusSchema = z.enum([
  'active',
  'inactive',
  'suspended',
  'pending_verification'
]);

export const UserRoleSchema = z.enum([
  'student',
  'mentor',
  'admin',
  'premium_student',
  'pro_mentor'
]);

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  timezone: z.string().default('UTC'),
  trading_experience_level: TradingExperienceLevelSchema,
  trading_style: TradingStyleSchema,
  role: UserRoleSchema,
  premium_tier: PremiumTierSchema,
  created_at: z.date(),
  updated_at: z.date(),
});

// Type Guards
export function isUserProfile(data: unknown): data is UserProfile {
  return UserProfileSchema.safeParse(data).success;
}

export function isValidTradingExperience(level: string): level is TradingExperienceLevel {
  return TradingExperienceLevelSchema.safeParse(level).success;
}

export function isValidTradingStyle(style: string): style is TradingStyle {
  return TradingStyleSchema.safeParse(style).success;
}

// Database Types (aligned with Supabase schema)
export type DatabaseUserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  trading_experience_level: string;
  trading_style: string | null;
  role: string;
  premium_tier: string;
  created_at: string;
  updated_at: string;
};

// Transform functions for database compatibility
export function transformDatabaseUser(dbUser: DatabaseUserProfile): UserProfile {
  return {
    id: dbUser.id,
    email: dbUser.email,
    full_name: dbUser.full_name || undefined,
    avatar_url: dbUser.avatar_url || undefined,
    timezone: dbUser.timezone,
    trading_experience_level: dbUser.trading_experience_level as TradingExperienceLevel,
    trading_style: dbUser.trading_style as TradingStyle || undefined,
    role: dbUser.role as UserRole,
    premium_tier: dbUser.premium_tier as PremiumTier,
    created_at: new Date(dbUser.created_at),
    updated_at: new Date(dbUser.updated_at),
  };
}

export function transformToDatabase(user: UserProfile): DatabaseUserProfile {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name || null,
    avatar_url: user.avatar_url || null,
    timezone: user.timezone,
    trading_experience_level: user.trading_experience_level,
    trading_style: user.trading_style || null,
    role: user.role,
    premium_tier: user.premium_tier,
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}

// Constants
export const DEFAULT_TIMEZONE = 'UTC';
export const DEFAULT_EXPERIENCE_LEVEL: TradingExperienceLevel = 'beginner';

// Validation helpers
export class UserValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'UserValidationError';
  }
}

export function validateUserCreation(data: unknown): UserProfile {
  const result = UserProfileSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  }).safeParse(data);

  if (!result.success) {
    throw new UserValidationError(
      `Invalid user data: ${result.error.issues.map(i => i.message).join(', ')}`,
      result.error.issues[0]?.path[0] as string
    );
  }

  return result.data as UserProfile;
}

export function validateUserUpdate(updates: Partial<UserProfile>): Partial<UserProfile> {
  const updateSchema = UserProfileSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  }).partial();

  const result = updateSchema.safeParse(updates);

  if (!result.success) {
    throw new UserValidationError(
      `Invalid update data: ${result.error.issues.map(i => i.message).join(', ')}`,
      result.error.issues[0]?.path[0] as string
    );
  }

  return result.data;
}
