import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateCampaignForm, AdvertisingCampaign } from '@/lib/types/mentor';

// GET /api/campaigns - Get all campaigns for the current mentor
export async function GET(request: NextRequest) {
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

    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const campaign_type = searchParams.get('campaign_type');

    // Build query
    let query = supabase
      .from('advertising_campaigns')
      .select(`
        *,
        affiliate:mentor_affiliates(*)
      `)
      .eq('mentor_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (campaign_type && campaign_type !== 'all') {
      query = query.eq('campaign_type', campaign_type);
    }

    const { data: campaigns, error: campaignsError } = await query;

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaigns: campaigns || [] });

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
