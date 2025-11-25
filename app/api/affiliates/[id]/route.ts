import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PUT /api/affiliates/[id] - Update an affiliate
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

    // Get affiliate ID from params
    const { id: affiliateId } = await params;
    if (!affiliateId) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Affiliate ID is required' },
        { status: 400 }
      );
    }

    // Verify affiliate exists and belongs to user
    const { data: existingAffiliate, error: affiliateError } = await supabase
      .from('mentor_affiliates')
      .select('*')
      .eq('id', affiliateId)
      .eq('mentor_id', user.id)
      .single();

    if (affiliateError || !existingAffiliate) {
      return NextResponse.json(
        { error: 'Not found', message: 'Affiliate not found or not owned by you' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate commission rate if provided
    if (body.commission_rate !== undefined && (body.commission_rate < 0 || body.commission_rate > 100)) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Commission rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validate URL format if provided
    if (body.affiliate_url) {
      try {
        new URL(body.affiliate_url);
      } catch {
        return NextResponse.json(
          { error: 'Validation error', message: 'Invalid affiliate URL format' },
          { status: 400 }
        );
      }
    }

    // Update affiliate
    const updateData: any = {};
    const allowedFields = [
      'name', 'provider_type', 'provider_name', 'affiliate_url',
      'commission_rate', 'description', 'is_active'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data: updatedAffiliate, error: updateError } = await supabase
      .from('mentor_affiliates')
      .update(updateData)
      .eq('id', affiliateId)
      .eq('mentor_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating affiliate:', updateError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to update affiliate' },
        { status: 500 }
      );
    }

    return NextResponse.json({ affiliate: updatedAffiliate });

  } catch (error) {
    console.error('Unexpected error in PUT /api/affiliates/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/affiliates/[id] - Delete an affiliate
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

    // Get affiliate ID from params
    const { id: affiliateId } = await params;
    if (!affiliateId) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Affiliate ID is required' },
        { status: 400 }
      );
    }

    // Check if affiliate is used by any campaigns
    const { data: campaignsUsingAffiliate, error: checkError } = await supabase
      .from('advertising_campaigns')
      .select('id, title')
      .eq('affiliate_id', affiliateId)
      .eq('mentor_id', user.id);

    if (checkError) {
      console.error('Error checking campaigns using affiliate:', checkError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to check affiliate usage' },
        { status: 500 }
      );
    }

    // If affiliate is used by campaigns, prevent deletion
    if (campaignsUsingAffiliate && campaignsUsingAffiliate.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete affiliate',
          message: `This affiliate is used by ${campaignsUsingAffiliate.length} campaign(s). Please remove the affiliate from campaigns first.`
        },
        { status: 409 }
      );
    }

    // Delete affiliate
    const { error: deleteError } = await supabase
      .from('mentor_affiliates')
      .delete()
      .eq('id', affiliateId)
      .eq('mentor_id', user.id);

    if (deleteError) {
      console.error('Error deleting affiliate:', deleteError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to delete affiliate' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Affiliate deleted successfully'
    });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/affiliates/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
