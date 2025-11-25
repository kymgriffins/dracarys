import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PUT /api/campaigns/[id] - Update a campaign
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Get campaign ID from params
    const { id: campaignId } = await params;
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Verify campaign exists and belongs to user
    const { data: existingCampaign, error: campaignError } = await supabase
      .from('advertising_campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('mentor_id', user.id)
      .single();

    if (campaignError || !existingCampaign) {
      return NextResponse.json(
        { error: 'Not found', message: 'Campaign not found or not owned by you' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate priority if provided
    if (body.priority !== undefined && (body.priority < 1 || body.priority > 10)) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Priority must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate URL format if provided
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

    // Update campaign
    const updateData: any = {};
    const allowedFields = [
      'title', 'description', 'affiliate_id', 'campaign_type', 'target_audience',
      'status', 'start_date', 'end_date', 'budget_limit', 'daily_cap',
      'priority', 'click_url', 'image_url', 'headline', 'body_text', 'call_to_action', 'is_active'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data: updatedCampaign, error: updateError } = await supabase
      .from('advertising_campaigns')
      .update(updateData)
      .eq('id', campaignId)
      .eq('mentor_id', user.id)
      .select(`
        *,
        affiliate:mentor_affiliates(*)
      `)
      .single();

    if (updateError) {
      console.error('Error updating campaign:', updateError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to update campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaign: updatedCampaign });

  } catch (error) {
    console.error('Unexpected error in PUT /api/campaigns/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id] - Delete a campaign
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Get campaign ID from params
    const { id: campaignId } = await params;
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Verify campaign exists and belongs to user
    const { data: existingCampaign, error: campaignError } = await supabase
      .from('advertising_campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('mentor_id', user.id)
      .single();

    if (campaignError || !existingCampaign) {
      return NextResponse.json(
        { error: 'Not found', message: 'Campaign not found or not owned by you' },
        { status: 404 }
      );
    }

    // Check if campaign is active - prevent deletion of active campaigns
    if (existingCampaign.status === 'active') {
      return NextResponse.json(
        {
          error: 'Cannot delete active campaign',
          message: 'Campaign must be paused or drafted before deletion'
        },
        { status: 409 }
      );
    }

    // Delete campaign
    const { error: deleteError } = await supabase
      .from('advertising_campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('mentor_id', user.id);

    if (deleteError) {
      console.error('Error deleting campaign:', deleteError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to delete campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/campaigns/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
