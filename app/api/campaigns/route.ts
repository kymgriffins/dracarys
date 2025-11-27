import { createClient } from '@/lib/supabase/server';
import { AdvertisingCampaign, CreateCampaignForm } from '@/lib/types/mentor';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/campaigns - Get all campaigns for the current mentor
export async function GET(request: NextRequest) {
  try {
    // Return mock data for campaigns
    // This ensures we are not pulling data from Supabase tables as requested
    const mockCampaigns: AdvertisingCampaign[] = [
      {
        id: 'mock-campaign-1',
        mentor_id: 'mock-user-id',
        title: 'FundedNext Winter Special',
        description: 'Special promotion for winter season',
        affiliate_id: 'mock-fundednext',
        campaign_type: 'banner',
        target_audience: 'all_students',
        status: 'active',
        start_date: '2024-01-01T00:00:00Z',
        priority: 10,
        click_url: 'https://fundednext.com/winter',
        headline: 'Get 10% Off Your Challenge',
        body_text: 'Use code WINTER10 for a discount on any evaluation account.',
        call_to_action: 'Claim Offer',
        total_budget_spent: 0,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'mock-campaign-2',
        mentor_id: 'mock-user-id',
        title: 'Tradeify Flash Sale',
        description: '24-hour flash sale',
        affiliate_id: 'mock-tradeify',
        campaign_type: 'sidebar',
        target_audience: 'advanced',
        status: 'active',
        priority: 8,
        headline: 'Flash Sale Alert!',
        body_text: 'Huge discounts on instant funding accounts.',
        call_to_action: 'Shop Now',
        total_budget_spent: 0,
        is_active: true,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      }
    ];

    return NextResponse.json({ campaigns: mockCampaigns });

  } catch (error) {
    console.error('Unexpected error in GET /api/campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create a new ad campaign
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is a mentor
    const { data: mentor, error: mentorError } = await supabase
      .from('mentors')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    if (mentorError || !mentor) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'User is not a mentor' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: CreateCampaignForm = await request.json();

    // Validate required fields
    if (!body.title || !body.campaign_type || !body.target_audience) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate priority
    if (body.priority < 1 || body.priority > 10) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Priority must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate affiliate exists if provided
    if (body.affiliate_id) {
      const { data: affiliate, error: affiliateError } = await supabase
        .from('mentor_affiliates')
        .select('*')
        .eq('id', body.affiliate_id)
        .eq('mentor_id', user.id)
        .single();

      if (affiliateError || !affiliate) {
        return NextResponse.json(
          { error: 'Validation error', message: 'Affiliate not found or not owned by you' },
          { status: 400 }
        );
      }
    }

    // Validate click_url format if provided
    if (body.click_url) {
      try {
        new URL(body.click_url);
      } catch {
        return NextResponse.json(
          { error: 'Validation error', message: 'Invalid click URL format' },
          { status: 400 }
        );
      }
    }

    // Create campaign
    const { data: newCampaign, error: createError } = await supabase
      .from('advertising_campaigns')
      .insert({
        mentor_id: user.id,
        title: body.title,
        description: body.description,
        affiliate_id: body.affiliate_id,
        campaign_type: body.campaign_type,
        target_audience: body.target_audience,
        priority: body.priority,
        click_url: body.click_url || undefined,
        image_url: body.image_url,
        headline: body.headline,
        body_text: body.body_text,
        call_to_action: body.call_to_action,
        start_date: body.start_date,
        end_date: body.end_date,
        budget_limit: body.budget_limit,
        daily_cap: body.daily_cap,
      })
      .select(`
        *,
        affiliate:mentor_affiliates(*)
      `)
      .single();

    if (createError) {
      console.error('Error creating campaign:', createError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to create campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaign: newCampaign }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
