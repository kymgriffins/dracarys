// Types for the comprehensive affiliate points system
export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  experience_points: number;
  points_breakdown: PointsBreakdown;
  achievements: Achievement[];
  badges: Badge[];
  streak: {
    current: number;
    longest: number;
    last_activity: Date;
  };
  created_at: Date;
  updated_at: Date;
}

export interface PointsBreakdown {
  affiliate_clicks: number;
  social_follows: number;
  live_stream_participation: number;
  comments: number;
  content_shares: number;
  referrals: number;
  daily_login: number;
  challenge_completion: number;
  leaderboard_position: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_reward: number;
  unlocked_at: Date;
  category: AchievementCategory;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked_at: Date;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar?: string;
  total_points: number;
  level: number;
  rank: number;
  change: number; // Position change from last week
  achievements_count: number;
}

export interface SocialEngagement {
  id: string;
  user_id: string;
  type: 'follow' | 'comment' | 'share' | 'live_participation' | 'referral';
  platform?: string; // twitter, discord, youtube, etc.
  points_earned: number;
  metadata: Record<string, any>; // Additional data like post_id, stream_id, etc.
  created_at: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  type: 'discount' | 'feature' | 'badge' | 'priority' | 'exclusive';
  value: number; // Percentage discount, days of access, etc.
  icon: string;
  available: boolean;
  max_claims?: number;
  claims_count: number;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  type: PointsTransactionType;
  amount: number;
  reason: string;
  reference_id?: string; // ID of related entity (affiliate, achievement, etc.)
  created_at: Date;
}

export interface LiveStreamSession {
  id: string;
  title: string;
  description: string;
  scheduled_at: Date;
  duration: number; // minutes
  participants: string[]; // user IDs
  points_per_minute: number;
  total_points_distributed: number;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  recording_url?: string;
}

export interface EngagementAnalytics {
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  active_users_month: number;
  total_points_distributed: number;
  average_points_per_user: number;
  top_engagement_categories: Array<{
    category: string;
    points: number;
    percentage: number;
  }>;
  growth_trends: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
}

export type AchievementCategory =
  | 'affiliate_master'
  | 'social_influencer'
  | 'community_builder'
  | 'loyal_supporter'
  | 'content_creator'
  | 'referral_champion'
  | 'consistency_king'
  | 'milestone_achiever';

export type PointsTransactionType =
  | 'affiliate_click'
  | 'social_engagement'
  | 'live_stream_participation'
  | 'daily_login'
  | 'achievement_unlock'
  | 'referral_bonus'
  | 'reward_redemption'
  | 'level_up_bonus'
  | 'admin_adjustment';

export interface PointsSystemConfig {
  points_per_affiliate_click: number;
  points_per_follow: number;
  points_per_comment: number;
  points_per_live_minute: number;
  points_per_share: number;
  points_per_referral: number;
  daily_login_bonus: number;
  level_up_base_points: number;
  streak_multiplier: number;
  max_daily_points: number;
}
