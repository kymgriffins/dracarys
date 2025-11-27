import { createClient } from '@/lib/supabase/server';
import { CreateAffiliateForm, MentorAffiliate } from '@/lib/types/mentor';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/affiliates - Get all affiliates for the current mentor
export async function GET(request: NextRequest) {
  try {
    // Check for mock data query parameter
    const url = new URL(request.url);
    const isMock = url.searchParams.get('mock') === 'true';

    // Return mock data for prop firms and brokers
    // This ensures we are not pulling data from Supabase tables as requested
    const mockAffiliates: MentorAffiliate[] = [
      {
        id: 'mock-fundednext',
        mentor_id: 'mock-user-id',
        name: 'FundedNext Professional',
        provider_type: 'prop_firm',
        provider_name: 'FundedNext',
        affiliate_url: 'https://fundednext.com/ref/mentor123',
        commission_rate: 25,
        description: 'Leading prop trading firm offering $100K-$2M funded accounts after evaluation phase',
        is_active: true,
        click_count: 1247,
        conversion_count: 89,
        revenue_generated: 22350.00,
        last_clicked_at: '2024-01-20T10:30:00Z',
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-20T10:30:00Z'
      },
      {
        id: 'mock-tradeify',
        mentor_id: 'mock-user-id',
        name: 'Tradeify Prime Account',
        provider_type: 'prop_firm',
        provider_name: 'Tradeify',
        affiliate_url: 'https://tradeify.com/referred-by/mentor123',
        commission_rate: 30,
        description: 'International prop firm with competitive payouts and flexible trading rules',
        is_active: true,
        click_count: 2156,
        conversion_count: 156,
        revenue_generated: 46800.00,
        last_clicked_at: '2024-01-21T14:45:00Z',
        created_at: '2024-01-14T11:20:00Z',
        updated_at: '2024-01-21T14:45:00Z'
      },
      {
        id: 'mock-hfm',
        mentor_id: 'mock-user-id',
        name: 'HFM Broker Pro',
        provider_type: 'broker',
        provider_name: 'HFM',
        affiliate_url: 'https://hfmtrading.com/partner/mentor123',
        commission_rate: 15,
        description: 'Established forex broker with competitive spreads and superior execution speeds',
        is_active: true,
        click_count: 3241,
        conversion_count: 234,
        revenue_generated: 35100.00,
        last_clicked_at: '2024-01-22T08:15:00Z',
        created_at: '2024-01-13T13:45:00Z',
        updated_at: '2024-01-22T08:15:00Z'
      },
      {
        id: 'mock-ftmo',
        mentor_id: 'mock-user-id',
        name: 'FTMO Challenge Account',
        provider_type: 'prop_firm',
        provider_name: 'FTMO',
        affiliate_url: 'https://ftmo.com/register?ref=mentor123',
        commission_rate: 35,
        description: 'World-renowned prop firm with $100K-$2M accounts and industry-leading reputation',
        is_active: true,
        click_count: 4567,
        conversion_count: 312,
        revenue_generated: 109200.00,
        last_clicked_at: '2024-01-22T16:30:00Z',
        created_at: '2024-01-12T10:15:00Z',
        updated_at: '2024-01-22T16:30:00Z'
      },
      {
        id: 'mock-myforexfunds',
        mentor_id: 'mock-user-id',
        name: 'MyForexFunds Express',
        provider_type: 'prop_firm',
        provider_name: 'MyForexFunds',
        affiliate_url: 'https://myforexfunds.com/affiliate/mentor123',
        commission_rate: 28,
        description: 'Fast-track prop firm offering up to $4M funded accounts with flexible leverage options',
        is_active: true,
        click_count: 1893,
        conversion_count: 98,
        revenue_generated: 27440.00,
        last_clicked_at: '2024-01-21T19:20:00Z',
        created_at: '2024-01-16T12:00:00Z',
        updated_at: '2024-01-21T19:20:00Z'
      }
    ];

    return NextResponse.json({ affiliates: mockAffiliates });

  } catch (error) {
    console.error('Unexpected error in GET /api/affiliates:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/affiliates - Create a new affiliate link
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
    const body: CreateAffiliateForm = await request.json();

    // Validate required fields
    if (!body.name || !body.provider_type || !body.provider_name || !body.affiliate_url) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(body.affiliate_url);
    } catch {
      return NextResponse.json(
        { error: 'Validation error', message: 'Invalid affiliate URL format' },
        { status: 400 }
      );
    }

    // Validate commission rate if provided
    if (body.commission_rate !== undefined && (body.commission_rate < 0 || body.commission_rate > 100)) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Commission rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Create affiliate
    const { data: newAffiliate, error: createError } = await supabase
      .from('mentor_affiliates')
      .insert({
        mentor_id: user.id,
        name: body.name,
        provider_type: body.provider_type,
        provider_name: body.provider_name,
        affiliate_url: body.affiliate_url,
        commission_rate: body.commission_rate,
        description: body.description,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating affiliate:', createError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to create affiliate' },
        { status: 500 }
      );
    }

    return NextResponse.json({ affiliate: newAffiliate }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/affiliates:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
