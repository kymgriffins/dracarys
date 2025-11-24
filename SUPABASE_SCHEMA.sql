-- Trader Development Platform Supabase Schema
-- This schema is designed for trader psychology, journaling, and mentorship
-- NO market data, charts, or trading execution features

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  timezone text DEFAULT 'UTC',
  trading_experience_level text CHECK (trading_experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
  trading_style text CHECK (trading_style IN ('scalper', 'day_trader', 'swing_trader', 'position_trader')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trading psychology assessments (onboarding)
CREATE TABLE public.psychology_assessments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  assessment_date date DEFAULT CURRENT_DATE NOT NULL,
  emotional_regulation_score integer CHECK (emotional_regulation_score >= 1 AND emotional_regulation_score <= 10),
  discipline_score integer CHECK (discipline_score >= 1 AND discipline_score <= 10),
  bias_awareness_score integer CHECK (bias_awareness_score >= 1 AND bias_awareness_score <= 10),
  risk_management_score integer CHECK (risk_management_score >= 1 AND risk_management_score <= 10),
  primary_biases text[], -- Array of identified bias patterns
  strengths text[], -- Key psychological strengths
  growth_areas text[], -- Areas needing development
  baseline_confidence_level integer CHECK (baseline_confidence_level >= 1 AND baseline_confidence_level <= 10),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trading journals (core feature)
CREATE TABLE public.journals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date date DEFAULT CURRENT_DATE NOT NULL,
  session_start_time time,
  session_end_time time,
  pre_session_emotional_state text CHECK (pre_session_emotional_state IN ('calm', 'anxious', 'excited', 'frustrated', 'confident', 'unsure')),
  pre_session_bias_checklist jsonb, -- JSON object of bias checks
  trades_count integer DEFAULT 0,
  session_rating integer CHECK (session_rating >= 1 AND session_rating <= 10),
  discipline_score integer CHECK (discipline_score >= 1 AND discipline_score <= 10),
  lessons_learned text,
  tomorrow_focus_areas text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Individual trade entries within journals
CREATE TABLE public.trades (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  journal_id uuid REFERENCES public.journals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_time timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  exit_time timestamp with time zone,
  setup_type text, -- User's category from their playbook
  confidence_level integer CHECK (confidence_level >= 1 AND confidence_level <= 10),
  emotional_state_entry text CHECK (emotional_state_entry IN ('calm', 'greedy', 'fearful', 'overconfident', 'unsure')),
  bias_present text[], -- JSON array of biases during trade
  risk_amount decimal(10,2),
  reward_amount decimal(10,2),
  result text CHECK (result IN ('win', 'loss', 'breakeven')),
  post_trade_emotional_state text CHECK (post_trade_emotional_state IN ('satisfied', 'frustrated', 'relieved', 'regretful', 'indifferent')),
  lessons_from_trade text,
  mistake_category text[] CHECK (mistake_category <@ ARRAY['emotional', 'technical', 'discipline', 'risk_management', 'timing', 'setup_recognition']),
  what_to_improve text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trading playbooks (personalized rule sets)
CREATE TABLE public.playbooks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  version integer DEFAULT 1,
  is_active boolean DEFAULT true,
  psychological_conditions text[], -- Mental states required for trading
  setup_definitions jsonb, -- JSON object defining user's approved setups
  entry_rules text[],
  exit_rules text[],
  risk_management_rules text[],
  psychological_rules text[], -- Mental game rules
  invalidation_criteria text[],
  created_by_mentor boolean DEFAULT false, -- If personalized by a mentor
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Playbook revisions (version control)
CREATE TABLE public.playbook_revisions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  playbook_id uuid REFERENCES public.playbooks(id) ON DELETE CASCADE NOT NULL,
  revision_number integer NOT NULL,
  changes_summary text,
  updated_by_mentor boolean DEFAULT false,
  revision_data jsonb, -- Complete playbook snapshot
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Routines and rituals
CREATE TABLE public.routines (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('pre_session', 'post_session', 'daily', 'weekly')) NOT NULL,
  description text,
  steps jsonb, -- Ordered array of steps
  estimated_duration_minutes integer,
  is_active boolean DEFAULT true,
  success_rate_target decimal(3,2) DEFAULT 0.80, -- Target completion rate
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Routine completions tracking
CREATE TABLE public.routine_completions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  routine_id uuid REFERENCES public.routines(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completion_rating integer CHECK (completion_rating >= 1 AND completion_rating <= 5),
  notes text
);

-- Performance analytics (calculated views)
CREATE TABLE public.performance_analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  analysis_period text CHECK (analysis_period IN ('7_days', '30_days', '90_days', '1_year')) NOT NULL,
  analysis_date date DEFAULT CURRENT_DATE NOT NULL,
  total_trades integer DEFAULT 0,
  win_rate decimal(5,4),
  avg_win_amount decimal(10,2),
  avg_loss_amount decimal(10,2),
  profit_factor decimal(5,2),
  expectancy decimal(10,2),
  psychological_win_rate decimal(5,4), -- Wins where emotions were managed well
  discipline_score_avg decimal(3,2),
  consistency_score decimal(3,2), -- Regularity of performance
  bias_patterns jsonb, -- Common biases identified
  strengths text[],
  focus_areas text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, analysis_period, analysis_date)
);

-- Mentorship system
CREATE TABLE public.mentors (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  specialties text[], -- Areas of expertise
  experience_years integer CHECK (experience_years >= 0),
  success_metrics jsonb, -- Track record stats
  availability_schedule jsonb, -- Weekly availability
  is_active boolean DEFAULT true,
  hourly_rate decimal(6,2),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mentorship engagements
CREATE TABLE public.mentoring_engagements (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mentor_id uuid REFERENCES public.mentors(profile_id) ON DELETE CASCADE NOT NULL,
  engagement_type text CHECK (engagement_type IN ('one_on_one', 'package', 'program')) NOT NULL,
  status text CHECK (status IN ('active', 'completed', 'paused', 'cancelled')) NOT NULL,
  start_date date DEFAULT CURRENT_DATE NOT NULL,
  end_date date,
  goals jsonb, -- Shared goals for the engagement
  current_focus_areas text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now() NOT NULL
);

-- Mentoring sessions (chat/call logs)
CREATE TABLE public.mentoring_sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  engagement_id uuid REFERENCES public.mentoring_engagements(id) ON DELETE CASCADE NOT NULL,
  session_datetime timestamp with time zone NOT NULL,
  session_type text CHECK (session_type IN ('onboarding', 'weekly_review', 'monthly_deep_dive', 'ad_hoc')) NOT NULL,
  duration_minutes integer,
  session_notes text,
  action_items jsonb, -- Things for student to work on
  student_feedback_rating integer CHECK (student_feedback_rating >= 1 AND student_feedback_rating <= 5),
  mentor_notes_private text,
  resources_shared jsonb, -- Educational materials suggested
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Educational alerts (mentor educational signals, not trading signals)
CREATE TABLE public.educational_alerts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id uuid REFERENCES public.mentors(profile_id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  educational_content text NOT NULL,
  psychological_focus text, -- Psychology concept being demonstrated
  learning_objectives text[],
  is_active boolean DEFAULT true,
  target_audience text CHECK (target_audience IN ('beginners', 'intermediates', 'advanced', 'all')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Alert deliveries to students
CREATE TABLE public.alert_deliveries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  alert_id uuid REFERENCES public.educational_alerts(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  delivered_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  opened_at timestamp with time zone,
  engagement_metrics jsonb -- Reading time, clicked links, etc.
);

-- Goals and milestones
CREATE TABLE public.goals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text CHECK (category IN ('psychological', 'discipline', 'performance', 'knowledge')) NOT NULL,
  target_value jsonb, -- What success looks like
  current_value jsonb, -- Current progress
  target_date date,
  status text CHECK (status IN ('active', 'achieved', 'abandoned')) DEFAULT 'active',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now() NOT NULL
);

-- Goal progress tracking
CREATE TABLE public.goal_progress (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  progress_date date DEFAULT CURRENT_DATE NOT NULL,
  progress_value jsonb,
  progress_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbook_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_progress ENABLE ROW LEVEL SECURITY;

-- Create policies (basic example - expand as needed)
-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Journals: Users can only access their own journals
CREATE POLICY "Users can CRUD own journals" ON public.journals
  FOR ALL USING (auth.uid() = user_id);

-- Similar pattern for other user-owned tables...
-- (Additional policies would be added for mentors, admin access, etc.)

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(id);
CREATE INDEX idx_journals_user_date ON public.journals(user_id, entry_date DESC);
CREATE INDEX idx_trades_journal ON public.trades(journal_id);
CREATE INDEX idx_performance_analytics_user_period ON public.performance_analytics(user_id, analysis_period, analysis_date DESC);
CREATE INDEX idx_alert_deliveries_student ON public.alert_deliveries(student_id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- GAMIFIED TRADING EDUCATION PLATFORM TABLES
-- ============================================================================

-- Gaming chapters for progressive learning
CREATE TABLE public.chapters (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert', 'master')) NOT NULL,
  lesson_count integer NOT NULL DEFAULT 1,
  points_value integer DEFAULT 100,
  order_position integer NOT NULL,
  is_active boolean DEFAULT true,
  prerequisites text[], -- Array of chapter IDs that must be completed first
  learning_objectives text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User chapter progress tracking
CREATE TABLE public.user_chapter_progress (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')) DEFAULT 'locked',
  progress_percentage decimal(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_lessons_count integer DEFAULT 0,
  points_earned integer DEFAULT 0,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  last_activity_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, chapter_id)
);

-- Trading training rooms (interviews, practice, multiplayer)
CREATE TABLE public.rooms (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('interview', 'practice', 'multiplayer')) NOT NULL,
  host_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  max_participants integer DEFAULT 12,
  current_participants integer DEFAULT 0,
  status text CHECK (status IN ('waiting', 'active', 'starting', 'completed', 'cancelled')) DEFAULT 'waiting',
  skill_level text CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'all')) DEFAULT 'all',
  duration_minutes integer,
  tags text[],
  chapter_focus text, -- Specific chapter/practice focus
  is_private boolean DEFAULT false,
  password_hash text,
  room_settings jsonb, -- WebRTC, screen sharing, whiteboard settings
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Room participants (who is in each room)
CREATE TABLE public.room_participants (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('host', 'participant', 'observer')) DEFAULT 'participant',
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  left_at timestamp with time zone,
  performance_score integer CHECK (performance_score >= 0 AND performance_score <= 100),
  notes text,
  is_active boolean DEFAULT true,
  UNIQUE(room_id, user_id)
);

-- Room chat messages
CREATE TABLE public.room_messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message_type text CHECK (message_type IN ('text', 'trading_command', 'system', 'announcement')) DEFAULT 'text',
  content text NOT NULL,
  metadata jsonb, -- For trading commands, links, etc.
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Gamified leaderboard/points system
CREATE TABLE public.leaderboard (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  period text CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')) NOT NULL,
  total_points integer DEFAULT 0,
  room_participation_count integer DEFAULT 0,
  successful_rooms_count integer DEFAULT 0,
  chapter_completions_count integer DEFAULT 0,
  streak_current integer DEFAULT 0,
  streak_best integer DEFAULT 0,
  rank_current integer DEFAULT 0,
  badge_level text CHECK (badge_level IN ('novice', 'apprentice', 'expert', 'master', 'legend')) DEFAULT 'novice',
  performance_multiplier decimal(3,2) DEFAULT 1.0,
  last_calculated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, period)
);

-- Room performance/evaluation results
CREATE TABLE public.room_evaluations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  evaluator_id uuid REFERENCES public.profiles(id), -- NULL for AI evaluation
  evaluation_type text CHECK (evaluation_type IN ('ai', 'peer', 'mentor', 'self')) DEFAULT 'ai',
  technical_score integer CHECK (technical_score >= 0 AND technical_score <= 100),
  psychology_score integer CHECK (psychology_score >= 0 AND psychology_score <= 100),
  risk_management_score integer CHECK (risk_management_score >= 0 AND risk_management_score <= 100),
  communication_score integer CHECK (communication_score >= 0 AND communication_score <= 100),
  overall_score integer CHECK (overall_score >= 0 AND overall_score <= 100),
  strengths text[],
  improvements_needed text[],
  feedback_summary text,
  detailed_feedback jsonb,
  points_awarded integer DEFAULT 0,
  grade text CHECK (grade IN ('excellent', 'good', 'needs_improvement', 'poor')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User dashboard statistics cache
CREATE TABLE public.user_dashboard_stats (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stat_name text NOT NULL,
  stat_value jsonb,
  calculated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  expires_at timestamp with time zone DEFAULT timezone('utc'::text, now() + interval '1 hour'),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, stat_name)
);

-- Global statistics for dashboard
CREATE TABLE public.global_stats (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  stat_name text NOT NULL UNIQUE,
  stat_value jsonb,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for gamified tables
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gamified system

-- Chapters: Everyone can read public chapter data
CREATE POLICY "Anyone can read chapters" ON public.chapters
  FOR SELECT USING (true);

-- User Chapter Progress: Users can only see their own progress
CREATE POLICY "Users can CRUD own chapter progress" ON public.user_chapter_progress
  FOR ALL USING (auth.uid() = user_id);

-- Rooms: Everyone can read active rooms, only hosts can manage their rooms
CREATE POLICY "Anyone can view active rooms" ON public.rooms
  FOR SELECT USING (status IN ('waiting', 'active', 'starting'));

CREATE POLICY "Hosts can manage their rooms" ON public.rooms
  FOR ALL USING (auth.uid() = host_id);

-- Room Participants: Room owners can see participants, participants can see their own status
CREATE POLICY "Room hosts can see all participants" ON public.room_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rooms
      WHERE rooms.id = room_participants.room_id
      AND rooms.host_id = auth.uid()
    )
  );

CREATE POLICY "Users can see their own participation" ON public.room_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join rooms" ON public.room_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" ON public.room_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Room Messages: Room participants can see messages in their rooms
CREATE POLICY "Room participants can see room messages" ON public.room_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.room_participants
      WHERE room_participants.room_id = room_messages.room_id
      AND room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Room participants can send messages" ON public.room_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.room_participants
      WHERE room_participants.room_id = room_messages.room_id
      AND room_participants.user_id = auth.uid()
    )
  );

-- Leaderboard: Everyone can read, users can only update their own
CREATE POLICY "Anyone can read leaderboard" ON public.leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own leaderboard" ON public.leaderboard
  FOR ALL USING (auth.uid() = user_id);

-- Room Evaluations: Private to the user and evaluators
CREATE POLICY "Users can read their own evaluations" ON public.room_evaluations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Evaluators can create evaluations" ON public.room_evaluations
  FOR INSERT WITH CHECK (auth.uid() = evaluator_id OR evaluator_id IS NULL);

-- User Dashboard Stats: Private to each user
CREATE POLICY "Users can read their own dashboard stats" ON public.user_dashboard_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Global Stats: Read-only for everyone
CREATE POLICY "Anyone can read global stats" ON public.global_stats
  FOR SELECT USING (true);

-- Indexes for gamified system performance

-- Chapter progress lookups
CREATE INDEX idx_user_chapter_progress_user ON public.user_chapter_progress(user_id, status);
CREATE INDEX idx_user_chapter_progress_chapter ON public.user_chapter_progress(chapter_id);

-- Room lookups and active room queries
CREATE INDEX idx_rooms_status_type ON public.rooms(status, type);
CREATE INDEX idx_rooms_host ON public.rooms(host_id);
CREATE INDEX idx_rooms_active ON public.rooms(status) WHERE status IN ('waiting', 'active', 'starting');

-- Room participants lookups
CREATE INDEX idx_room_participants_room ON public.room_participants(room_id);
CREATE INDEX idx_room_participants_user ON public.room_participants(user_id, is_active);

-- Room messages by room and time
CREATE INDEX idx_room_messages_room_time ON public.room_messages(room_id, created_at DESC);

-- Leaderboard by period and points
CREATE INDEX idx_leaderboard_period_points ON public.leaderboard(period, total_points DESC);
CREATE INDEX idx_leaderboard_user_period ON public.leaderboard(user_id, period);

-- Room evaluations
CREATE INDEX idx_room_evaluations_room ON public.room_evaluations(room_id);
CREATE INDEX idx_room_evaluations_user ON public.room_evaluations(user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS FOR GAMIFIED SYSTEM
-- ============================================================================

-- Function to calculate leaderboard rank
CREATE OR REPLACE FUNCTION update_leaderboard_rank()
RETURNS trigger AS $$
BEGIN
  IF NEW.period = 'all_time' THEN
    -- Update rank for the current period
    WITH ranked_users AS (
      SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY total_points DESC, room_participation_count DESC) as new_rank
      FROM public.leaderboard
      WHERE period = NEW.period
    )
    UPDATE public.leaderboard
    SET rank_current = ranked_users.new_rank
    FROM ranked_users
    WHERE leaderboard.id = ranked_users.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ranks when leaderboard changes
CREATE TRIGGER update_leaderboard_ranks AFTER INSERT OR UPDATE ON public.leaderboard
  FOR EACH ROW EXECUTE FUNCTION update_leaderboard_rank();

-- Function to update room participant counts
CREATE OR REPLACE FUNCTION update_room_participant_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.rooms
    SET current_participants = current_participants + 1
    WHERE id = NEW.room_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_active != NEW.is_active THEN
    IF NEW.is_active THEN
      UPDATE public.rooms
      SET current_participants = current_participants + 1
      WHERE id = NEW.room_id;
    ELSE
      UPDATE public.rooms
      SET current_participants = current_participants - 1
      WHERE id = NEW.room_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.rooms
    SET current_participants = current_participants - 1
    WHERE id = OLD.room_id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain participant count
CREATE TRIGGER maintain_room_participant_count
  AFTER INSERT OR UPDATE OR DELETE ON public.room_participants
  FOR EACH ROW EXECUTE FUNCTION update_room_participant_count();

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to tables that need updated_at tracking
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON public.journals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playbooks_updated_at BEFORE UPDATE ON public.playbooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Gamified system updated_at triggers
CREATE TRIGGER update_user_chapter_progress_updated_at BEFORE UPDATE ON public.user_chapter_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
