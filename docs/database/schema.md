# Database Schema Documentation

## 📋 Complete Database Schema

This document provides the complete database schema for the Dracarys trading education platform.

## 🏗️ Schema Overview

### Database Architecture
- **Version**: PostgreSQL 15+ (Supabase)
- **Extensions**: pgcrypto, uuid-ossp
- **Encoding**: UTF-8
- **Time Zone**: UTC

### Naming Conventions
- **Tables**: snake_case
- **Columns**: snake_case
- **Indexes**: idx_table_column
- **Foreign Keys**: fk_table_column
- **Constraints**: ck_table_column_condition

## 📊 Table Schemas

### 1. `users` (Supabase Auth Managed)
```sql
-- Note: This table is managed by Supabase Auth
-- Additional user metadata is stored here
CREATE TABLE auth.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email citext UNIQUE NOT NULL,
    encrypted_password text,
    email_confirmed_at timestamptz,
    invited_at timestamptz,
    confirmation_token text,
    confirmation_sent_at timestamptz,
    recovery_token text,
    recovery_sent_at timestamptz,
    email_change_token_new text,
    email_change text,
    email_change_sent_at timestamptz,
    last_sign_in_at timestamptz,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    phone text DEFAULT NULL,
    phone_confirmed_at timestamptz,
    phone_change text DEFAULT '',
    phone_change_token text DEFAULT '',
    phone_change_sent_at timestamptz,
    email_change_token_current text DEFAULT '',
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamptz,
    reauthentication_token text DEFAULT '',
    reauthentication_sent_at timestamptz,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamptz,
    is_anonymous boolean DEFAULT false
);

-- Custom user profile extension
CREATE TABLE public.user_profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    avatar_url text,
    bio text,
    timezone text DEFAULT 'UTC',
    preferred_language text DEFAULT 'en',
    trading_experience text DEFAULT 'beginner',
    trading_goals text[],
    current_level integer DEFAULT 1,
    total_xp integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

### 2. `user_progress`
```sql
CREATE TABLE public.user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    level_id integer NOT NULL,
    gate_id integer NOT NULL,
    lesson_id uuid REFERENCES public.lessons(id),
    completed boolean DEFAULT false,
    score integer,
    xp_earned integer DEFAULT 0,
    time_spent interval,
    attempts_count integer DEFAULT 1,
    last_attempt_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),

    UNIQUE(user_id, level_id, gate_id)
);

-- Indexes
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_level ON public.user_progress(level_id, gate_id);
CREATE INDEX idx_user_progress_completed ON public.user_progress(completed) WHERE completed = false;
```

### 3. `lessons`
```sql
CREATE TABLE public.lessons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id integer NOT NULL,
    gate_id integer NOT NULL,
    title text NOT NULL,
    subtitle text,
    description text,
    content_type text DEFAULT 'interactive',
    content_data jsonb NOT NULL, -- Full lesson content
    assessment_data jsonb, -- Quiz/assessment data
    xp_reward integer DEFAULT 0,
    estimated_time interval,
    difficulty text DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    prerequisites uuid[], -- Array of required lesson IDs
    is_active boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),

    UNIQUE(level_id, gate_id)
);

-- Indexes
CREATE INDEX idx_lessons_active ON public.lessons(is_active) WHERE is_active = true;
CREATE INDEX idx_lessons_level_order ON public.lessons(level_id, gate_id, order_index);
CREATE INDEX idx_lessons_content_type ON public.lessons(content_type);
```

### 4. `achievements`
```sql
CREATE TABLE public.achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(100) UNIQUE NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    icon_url text,
    category text DEFAULT 'general',
    xp_reward integer DEFAULT 0,
    requirements jsonb,
    rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- User achievements
CREATE TABLE public.user_achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id uuid REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at timestamptz DEFAULT now(),
    progress_value integer DEFAULT 100, -- Percentage or count
    metadata jsonb,

    UNIQUE(user_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON public.user_achievements(unlocked_at DESC);
```

### 5. `leaderboard`
```sql
CREATE TABLE public.leaderboard (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    period varchar(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
    xp_points integer DEFAULT 0,
    lessons_completed integer DEFAULT 0,
    streak_days integer DEFAULT 0,
    rank integer,
    percentile numeric(5,2),
    period_start_date date NOT NULL,
    period_end_date date NOT NULL,
    updated_at timestamptz DEFAULT now(),

    UNIQUE(user_id, period, period_start_date)
);

-- Indexes
CREATE INDEX idx_leaderboard_period_rank ON public.leaderboard(period, period_start_date, rank);
CREATE INDEX idx_leaderboard_user_period ON public.leaderboard(user_id, period, period_end_date DESC);
```

### 6. `user_streaks`
```sql
CREATE TABLE public.user_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_activity_date date,
    last_streak_reset timestamptz,
    streak_streak_data jsonb, -- Daily activity tracking
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_streaks_user ON public.user_streaks(user_id);
CREATE INDEX idx_user_streaks_reset ON public.user_streaks(last_streak_reset);
```

### 7. `user_activity_log`
```sql
CREATE TABLE public.user_activity_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type varchar(50) NOT NULL,
    entity_type varchar(50), -- lesson, achievement, etc.
    entity_id uuid,
    metadata jsonb,
    session_id uuid,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_activity_log_user_time ON public.user_activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_log_type ON public.user_activity_log(activity_type);
CREATE INDEX idx_activity_log_session ON public.user_activity_log(session_id);
```

### 8. `community_posts`
```sql
CREATE TABLE public.community_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    content text,
    post_type varchar(20) DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'question', 'announcement')),
    category text,
    tags text[],
    is_pinned boolean DEFAULT false,
    is_locked boolean DEFAULT false,
    upvotes_count integer DEFAULT 0,
    downvotes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    views_count integer DEFAULT 0,
    last_activity_at timestamptz DEFAULT now(),
    metadata jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE public.community_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
    content text NOT NULL,
    upvotes_count integer DEFAULT 0,
    downvotes_count integer DEFAULT 0,
    is_deleted boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Votes table
CREATE TABLE public.community_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    target_type varchar(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id uuid NOT NULL,
    vote_type varchar(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at timestamptz DEFAULT now(),

    UNIQUE(user_id, target_type, target_id)
);

-- Indexes
CREATE INDEX idx_posts_author ON public.community_posts(author_id);
CREATE INDEX idx_posts_category ON public.community_posts(category);
CREATE INDEX idx_posts_pinned ON public.community_posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_posts_activity ON public.community_posts(last_activity_at DESC);
CREATE INDEX idx_comments_post ON public.community_comments(post_id);
CREATE INDEX idx_comments_author ON public.community_comments(author_id);
CREATE INDEX idx_votes_target ON public.community_votes(target_type, target_id);
```

### 9. `live_sessions`
```sql
CREATE TABLE public.live_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    host_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_type varchar(20) DEFAULT 'workshop' CHECK (session_type IN ('workshop', 'q&a', 'presentation')),
    scheduled_at timestamptz NOT NULL,
    duration interval NOT NULL,
    max_participants integer,
    current_participants integer DEFAULT 0,
    meeting_url text,
    recording_url text,
    is_recorded boolean DEFAULT false,
    status varchar(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    prerequisites jsonb, -- {"min_level": 2, "required_lessons": [...]}
    tags text[],
    metadata jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Session participants
CREATE TABLE public.session_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid REFERENCES public.live_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at timestamptz,
    left_at timestamptz,
    attendance_status varchar(20) DEFAULT 'registered' CHECK (
        attendance_status IN ('registered', 'attended', 'missed', 'waitlisted')
    ),
    feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_text text,
    created_at timestamptz DEFAULT now(),

    UNIQUE(session_id, user_id)
);

-- Indexes
CREATE INDEX idx_sessions_host ON public.live_sessions(host_id);
CREATE INDEX idx_sessions_scheduled ON public.live_sessions(scheduled_at);
CREATE INDEX idx_sessions_status ON public.live_sessions(status);
CREATE INDEX idx_session_participants_session ON public.session_participants(session_id);
```

### 10. `subscription_plans`
```sql
CREATE TABLE public.subscription_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    plan_type varchar(20) DEFAULT 'monthly' CHECK (plan_type IN ('monthly', 'yearly', 'lifetime')),
    price decimal(10,2) NOT NULL,
    currency varchar(3) DEFAULT 'USD',
    stripe_price_id text UNIQUE,
    features jsonb NOT NULL,
    is_active boolean DEFAULT true,
    trial_days integer DEFAULT 0,
    max_users integer, -- For team plans
    level_access_limit integer DEFAULT 99, -- Max level accessible
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- User subscriptions
CREATE TABLE public.user_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE RESTRICT NOT NULL,
    stripe_subscription_id text UNIQUE,
    status varchar(20) DEFAULT 'active' CHECK (
        status IN ('active', 'past_due', 'canceled', 'unpaid', 'trialing')
    ),
    current_period_start timestamptz,
    current_period_end timestamptz,
    trial_end timestamptz,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subscription_plans_active ON public.subscription_plans(is_active) WHERE is_active = true;
CREATE INDEX idx_user_subscriptions_user ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
```

## 🔐 Row Level Security (RLS) Policies

### Enable RLS on All Tables
```sql
-- User Progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Lessons (public read, admin write)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active lessons" ON public.lessons
    FOR SELECT USING (is_active = true);

-- Community Posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view community content" ON public.community_posts
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON public.community_posts
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

-- And so on for all tables...
```

## 📊 Database Views & Functions

### Useful Views
```sql
-- User learning statistics
CREATE VIEW user_learning_stats AS
SELECT
    up.user_id,
    COUNT(*) as completed_lessons,
    SUM(up.xp_earned) as total_xp,
    MAX(up.completed_at) as last_activity
FROM user_progress up
WHERE up.completed = true
GROUP BY up.user_id;

-- Popular lessons
CREATE VIEW lesson_popularity AS
SELECT
    l.id,
    l.title,
    COUNT(up.id) as completions,
    AVG(up.score) as avg_score,
    RANK() OVER (ORDER BY COUNT(up.id) DESC) as popularity_rank
FROM lessons l
LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.completed = true
WHERE l.is_active = true
GROUP BY l.id, l.title;
```

### Helper Functions
```sql
-- Calculate user level from XP
CREATE FUNCTION calculate_user_level(total_xp integer)
RETURNS integer AS $$
BEGIN
    -- XP required doubles each level: 1000, 2000, 4000, 8000, etc.
    RETURN FLOOR(LOG(2, GREATEST(total_xp / 1000 + 1, 2)));
END;
$$ LANGUAGE plpgsql;

-- Auto-update leaderboard
CREATE FUNCTION update_leaderboard()
RETURNS trigger AS $$
BEGIN
    -- Insert or update leaderboard entry
    INSERT INTO leaderboard (user_id, period, xp_points, period_start_date, period_end_date)
    VALUES (
        NEW.user_id,
        'weekly',
        COALESCE(NEW.xp_earned, 0),
        date_trunc('week', NEW.completed_at),
        date_trunc('week', NEW.completed_at) + interval '6 days'
    )
    ON CONFLICT (user_id, period, period_start_date)
    DO UPDATE SET
        xp_points = leaderboard.xp_points + COALESCE(NEW.xp_earned, 0),
        updated_at = now();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger the function
CREATE TRIGGER trigger_update_leaderboard
    AFTER INSERT OR UPDATE ON user_progress
    FOR EACH ROW
    WHEN (NEW.completed = true)
    EXECUTE FUNCTION update_leaderboard();
```

## 🔄 Data Migration Strategy

### Migration Files Structure
```
supabase/
├── migrations/
│   ├── 20231101_initial_schema.sql
│   ├── 20231102_add_user_profiles.sql
│   ├── 20231103_community_features.sql
│   └── 20231104_subscription_billing.sql
├── seed.sql (Sample data)
└── config.toml
```

### Migration Example
```sql
-- Migration: 20231101_initial_schema.sql
BEGIN;

-- Create enum types
CREATE TYPE activity_type AS ENUM ('login', 'lesson_complete', 'achievement_gain', 'post_create', 'session_join');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'unpaid', 'trialing');

-- Create tables in order
CREATE TABLE ... -- (user profiles, lessons, progress, etc.)

-- Create indexes
CREATE INDEX ... -- (all performance indexes)

-- Enable RLS
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY ... -- (all RLS policies)

COMMIT;
```

---

## 📈 Performance Considerations

### Query Optimization
- Use `EXPLAIN ANALYZE` for slow queries (>100ms)
- Avoid `SELECT *` in production code
- Implement cursor-based pagination for large result sets
- Use database functions for complex calculations

### Indexing Strategy
- Composite indexes for common WHERE clauses
- Partial indexes for filtered queries
- GIN indexes for JSONB column searches
- Regular maintenance with `REINDEX` and `VACUUM`

### Connection Management
- Connection pooling via pg_bouncer
- Max connections: 100 (Supabase managed)
- Statement timeout: 30 seconds
- Idle timeout: 5 minutes

---

*Schema documentation maintained by development team. Last updated: November 24, 2025*
