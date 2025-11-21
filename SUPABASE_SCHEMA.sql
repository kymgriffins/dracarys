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
  FOR EACH ROW EXAMINE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playbooks_updated_at BEFORE UPDATE ON public.playbooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
