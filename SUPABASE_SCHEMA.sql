-- ============================================================================
-- AFFILIATE ADVERTISING SYSTEM TABLES
-- ============================================================================

-- Mentor affiliate links (prop firms and brokers)
CREATE TABLE public.mentor_affiliates (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id uuid REFERENCES public.mentors(profile_id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL, -- Friendly name for the affiliate
  provider_type text CHECK (provider_type IN ('prop_firm', 'broker', 'other')) NOT NULL,
  provider_name text NOT NULL, -- "TradeThePool", "IC Markets", etc.
  affiliate_url text NOT NULL, -- The actual affiliate link
  commission_rate decimal(5,2), -- Optional commission rate if shared
  description text, -- Brief description of the opportunity
  is_active boolean DEFAULT true,
  click_count integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  revenue_generated decimal(10,2) DEFAULT 0,
  last_clicked_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ad campaigns that mentor can create and run
CREATE TABLE public.advertising_campaigns (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id uuid REFERENCES public.mentors(profile_id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  affiliate_id uuid REFERENCES public.mentor_affiliates(id) ON DELETE SET NULL,
  campaign_type text CHECK (campaign_type IN ('banner', 'sidebar', 'feed', 'modal', 'notification')) NOT NULL,
  target_audience text CHECK (target_audience IN ('all_students', 'active_students', 'beginner', 'intermediate', 'advanced')) DEFAULT 'all_students',
  status text CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')) DEFAULT 'draft',
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  budget_limit decimal(10,2), -- Optional budget cap
  daily_cap integer, -- Max impressions per day
  total_budget_spent decimal(10,2) DEFAULT 0,
  priority integer DEFAULT 1 CHECK (priority >= 1 AND priority <= 10), -- Higher priority ads show more
  click_url text, -- Override URL if different from affiliate link
  image_url text, -- For banner/image ads
  headline text,
  body_text text,
  call_to_action text DEFAULT 'Learn More',
  is_active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Individual ad impressions (serving tracking)
CREATE TABLE public.ad_impressions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id uuid REFERENCES public.advertising_campaigns(id) ON DELETE CASCADE NOT NULL,
  affiliate_id uuid REFERENCES public.mentor_affiliates(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  impression_timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_agent text,
  ip_address inet, -- For geographic analytics (anonymized)
  location text, -- Country/region if available
  device_type text CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  referrer text -- Which page the ad was shown on
);

-- Ad click tracking
CREATE TABLE public.ad_clicks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  impression_id uuid REFERENCES public.ad_impressions(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.advertising_campaigns(id) ON DELETE CASCADE NOT NULL,
  affiliate_id uuid REFERENCES public.mentor_affiliates(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  click_timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  click_url text NOT NULL, -- The URL that was clicked
  user_agent text,
  ip_address inet,
  location text,
  device_type text CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  referrer text
);

-- Conversion tracking (when affiliate actions convert to actual signups/trades)
CREATE TABLE public.ad_conversions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  click_id uuid REFERENCES public.ad_clicks(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.advertising_campaigns(id) ON DELETE CASCADE NOT NULL,
  affiliate_id uuid REFERENCES public.mentor_affiliates(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- May be null if user signs up later
  conversion_type text CHECK (conversion_type IN ('account_opened', 'first_deposit', 'first_trade', 'commission_earned')) NOT NULL,
  conversion_value decimal(10,2), -- Value of the conversion
  conversion_timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  external_transaction_id text, -- From the affiliate network
  notes text
);

-- Ad analytics cache (pre-calculated metrics for dashboard)
CREATE TABLE public.ad_analytics_cache (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id uuid REFERENCES public.mentors(profile_id) ON DELETE CASCADE NOT NULL,
  campaign_id uuid REFERENCES public.advertising_campaigns(id) ON DELETE CASCADE,
  affiliate_id uuid REFERENCES public.mentor_affiliates(id) ON DELETE CASCADE,
  date_recorded date DEFAULT CURRENT_DATE NOT NULL,
  impressions_count integer DEFAULT 0,
  clicks_count integer DEFAULT 0,
  conversions_count integer DEFAULT 0,
  total_revenue decimal(10,2) DEFAULT 0,
  ctr decimal(5,4), -- Click-through rate
  conversion_rate decimal(5,4),
  cpc decimal(5,2), -- Cost per click
  roas decimal(5,2), -- Return on ad spend
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(mentor_id, campaign_id, affiliate_id, date_recorded)
);

-- Enable RLS for affiliate advertising system
ALTER TABLE public.mentor_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertising_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_analytics_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentors (they can only manage their own affiliates and campaigns)
CREATE POLICY "Mentors can CRUD their own affiliates" ON public.mentor_affiliates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.mentors
      WHERE mentors.profile_id = auth.uid()
      AND mentors.profile_id = mentor_affiliates.mentor_id
    )
  );

CREATE POLICY "Everyone can view active affiliates" ON public.mentor_affiliates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Mentors can CRUD their own campaigns" ON public.advertising_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.mentors
      WHERE mentors.profile_id = auth.uid()
      AND mentors.profile_id = advertising_campaigns.mentor_id
    )
  );

-- Students can only view active campaigns (for ad serving)
CREATE POLICY "Students can view active campaigns" ON public.advertising_campaigns
  FOR SELECT USING (status = 'active');

-- Impressions: Students can only create, mentors can view their campaign impressions
CREATE POLICY "Students can create impressions on active campaigns" ON public.ad_impressions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.advertising_campaigns
      WHERE advertising_campaigns.id = ad_impressions.campaign_id
      AND advertising_campaigns.status = 'active'
      AND advertising_campaigns.mentor_id != auth.uid() -- Can't create impressions on own ads
    )
  );

CREATE POLICY "Mentors can view impressions for their campaigns" ON public.ad_impressions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.advertising_campaigns
      WHERE advertising_campaigns.id = ad_impressions.campaign_id
      AND advertising_campaigns.mentor_id = auth.uid()
    )
  );

-- Clicks: Similar to impressions
CREATE POLICY "Students can create clicks on active campaigns" ON public.ad_clicks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.advertising_campaigns
      WHERE advertising_campaigns.id = ad_clicks.campaign_id
      AND advertising_campaigns.status = 'active'
    )
  );

CREATE POLICY "Mentors can view clicks for their campaigns" ON public.ad_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.advertising_campaigns
      WHERE advertising_campaigns.id = ad_clicks.campaign_id
      AND advertising_campaigns.mentor_id = auth.uid()
    )
  );

-- Conversions: Private to mentors
CREATE POLICY "Mentors can CRUD conversions for their affiliates" ON public.ad_conversions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.mentor_affiliates
      WHERE mentor_affiliates.id = ad_conversions.affiliate_id
      AND mentor_affiliates.mentor_id = auth.uid()
    )
  );

-- Analytics: Private to mentors
CREATE POLICY "Mentors can view their own analytics" ON public.ad_analytics_cache
  FOR SELECT USING (auth.uid() = mentor_id);

-- Indexes for performance
CREATE INDEX idx_mentor_affiliates_mentor ON public.mentor_affiliates(mentor_id);
CREATE INDEX idx_campaigns_mentor_status ON public.advertising_campaigns(mentor_id, status);
CREATE INDEX idx_ad_impressions_campaign ON public.ad_impressions(campaign_id, impression_timestamp DESC);
CREATE INDEX idx_ad_clicks_campaign ON public.ad_clicks(campaign_id, click_timestamp DESC);
CREATE INDEX idx_ad_conversions_affiliate ON public.ad_conversions(affiliate_id, conversion_timestamp DESC);
CREATE INDEX idx_ad_analytics_cache_mentor ON public.ad_analytics_cache(mentor_id, date_recorded DESC);

-- Functions for updating counters and analytics
CREATE OR REPLACE FUNCTION update_affiliate_counters()
RETURNS trigger AS $$
BEGIN
  IF NEW.conversion_type IN ('account_opened', 'first_deposit', 'first_trade') THEN
    UPDATE public.mentor_affiliates
    SET
      conversion_count = conversion_count + 1,
      revenue_generated = revenue_generated + COALESCE(NEW.conversion_value, 0),
      updated_at = now()
    WHERE id = NEW.affiliate_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliate_counters_on_conversion
  AFTER INSERT ON public.ad_conversions
  FOR EACH ROW EXECUTE FUNCTION update_affiliate_counters();

-- Function to update campaign click counts (could be used for daily caps)
CREATE OR REPLACE FUNCTION update_campaign_click_count()
RETURNS trigger AS $$
BEGIN
  -- Update affiliate click count if present
  IF NEW.affiliate_id IS NOT NULL THEN
    UPDATE public.mentor_affiliates
    SET
      click_count = click_count + 1,
      last_clicked_at = now(),
      updated_at = now()
    WHERE id = NEW.affiliate_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaign_click_count_on_click
  AFTER INSERT ON public.ad_clicks
  FOR EACH ROW EXECUTE FUNCTION update_campaign_click_count();

-- Updated_at triggers for affiliate tables
CREATE TRIGGER update_mentor_affiliates_updated_at BEFORE UPDATE ON public.mentor_affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertising_campaigns_updated_at BEFORE UPDATE ON public.advertising_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
