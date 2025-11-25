// Mentor type definitions
export interface Mentor {
  id: string;
  profile_id: string;
  specialties: string[];
  experience_years: number;
}

// Affiliate and Advertising Types
export interface MentorAffiliate {
  id: string;
  mentor_id: string;
  name: string;
  provider_type: 'prop_firm' | 'broker' | 'other';
  provider_name: string;
  affiliate_url: string;
  commission_rate?: number;
  description?: string;
  is_active: boolean;
  click_count: number;
  conversion_count: number;
  revenue_generated: number;
  last_clicked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdvertisingCampaign {
  id: string;
  mentor_id: string;
  title: string;
  description?: string;
  affiliate_id?: string;
  campaign_type: 'banner' | 'sidebar' | 'feed' | 'modal' | 'notification';
  target_audience: 'all_students' | 'active_students' | 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
  budget_limit?: number;
  daily_cap?: number;
  total_budget_spent: number;
  priority: number;
  click_url?: string;
  image_url?: string;
  headline?: string;
  body_text?: string;
  call_to_action: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Populated relationships
  affiliate?: MentorAffiliate;
}

export interface AdImpression {
  id: string;
  campaign_id: string;
  affiliate_id?: string;
  student_id: string;
  impression_timestamp: string;
  user_agent?: string;
  ip_address?: string;
  location?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
  referrer?: string;
}

export interface AdClick {
  id: string;
  impression_id?: string;
  campaign_id: string;
  affiliate_id?: string;
  student_id: string;
  click_timestamp: string;
  click_url: string;
  user_agent?: string;
  ip_address?: string;
  location?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
  referrer?: string;
}

export interface AdConversion {
  id: string;
  click_id?: string;
  campaign_id: string;
  affiliate_id: string;
  student_id?: string;
  conversion_type: 'account_opened' | 'first_deposit' | 'first_trade' | 'commission_earned';
  conversion_value?: number;
  conversion_timestamp: string;
  external_transaction_id?: string;
  notes?: string;
}

export interface AdAnalytics {
  id: string;
  mentor_id: string;
  campaign_id?: string;
  affiliate_id?: string;
  date_recorded: string;
  impressions_count: number;
  clicks_count: number;
  conversions_count: number;
  total_revenue: number;
  ctr?: number; // Click-through rate (decimal)
  conversion_rate?: number;
  cpc?: number; // Cost per click
  roas?: number; // Return on ad spend
  last_updated: string;
}

// Dashboard/Analytics types
export interface AffiliateDashboardStats {
  total_affiliates: number;
  total_campaigns: number;
  active_campaigns: number;
  total_clicks: number;
  total_conversions: number;
  total_revenue: number;
  ctr_average: number;
  conversion_rate_average: number;
}

export interface CampaignPerformance {
  campaign_id: string;
  campaign_title: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversion_rate: number;
  status: AdvertisingCampaign['status'];
}

export interface AffiliatePerformance {
  affiliate_id: string;
  affiliate_name: string;
  provider_name: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversion_rate: number;
  last_clicked_at?: string;
}

// Form types for creating/editing
export interface CreateAffiliateForm {
  name: string;
  provider_type: MentorAffiliate['provider_type'];
  provider_name: string;
  affiliate_url: string;
  commission_rate?: number;
  description?: string;
}

export interface CreateCampaignForm {
  title: string;
  description?: string;
  affiliate_id?: string;
  campaign_type: AdvertisingCampaign['campaign_type'];
  target_audience: AdvertisingCampaign['target_audience'];
  priority: number;
  click_url?: string;
  image_url?: string;
  headline?: string;
  body_text?: string;
  call_to_action: string;
  start_date?: string;
  end_date?: string;
  budget_limit?: number;
  daily_cap?: number;
}

// Ad serving types
export interface AdToServe {
  campaign_id: string;
  affiliate_id?: string;
  campaign_type: AdvertisingCampaign['campaign_type'];
  priority: number;
  click_url: string;
  image_url?: string;
  headline?: string;
  body_text?: string;
  call_to_action: string;
}

export interface AdImpressionData {
  campaign_id: string;
  affiliate_id?: string;
  referrer: string;
  user_agent: string;
  location?: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
}

export interface AdClickData {
  impression_id?: string;
  campaign_id: string;
  affiliate_id?: string;
  click_url: string;
  referrer: string;
  user_agent: string;
  location?: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
}
