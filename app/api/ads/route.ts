import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { AdImpressionData, AdClickData, AdToServe } from '@/lib/types/mentor';

// GET /api/ads - Get ads to serve to the current user
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

    // Get URL parameters for context
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'dashboard'; // dashboard, sidebar, feed, etc.
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 10); // Max 10 ads

    // Get user's trading experience level for targeting
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('trading_experience_level')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // Continue without profile data - use default targeting
    }

    // Build targeting logic
    let targetAudiences: string[] = [];

    if (profile?.trading_experience_level) {
      switch (profile.trading_experience_level) {
        case 'beginner':
          targetAudiences = ['all_students', 'beginner'];
          break;
        case 'intermediate':
          targetAudiences = ['all_students', 'intermediate'];
          break;
        case 'advanced':
        case 'professional':
          targetAudiences = ['all_students', 'advanced'];
          break;
        default:
          targetAudiences = ['all_students'];
      }
    } else {
      targetAudiences = ['all_students'];
    }

    // Get active campaigns that target this user, ordered by priority
    const { data: campaigns, error: campaignsError } = await supabase
      .from('advertising_campaigns')
      .select(`
        id,
        mentor_id,
        title,
        description,
        affiliate_id,
        campaign_type,
        target_audience,
        priority,
        click_url,
        image_url,
        headline,
        body_text,
        call_to_action,
        daily_cap,
        created_at
      `)
      .eq('status', 'active')
      .eq('is_active', true)
      .in('target_audience', targetAudiences)
      .neq('mentor_id', user.id) // Don't show own ads
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Get more than needed for intelligent selection

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      return NextResponse.json({ ads: [] });
    }

    // If we have campaigns, get affiliate data for those that have affiliates
    const campaignIds = campaigns?.map(c => c.id) || [];
    const affiliateIds = campaigns?.filter(c => c.affiliate_id).map(c => c.affiliate_id) || [];

    let affiliateData: any[] = [];
    if (affiliateIds.length > 0) {
      const { data: affiliates, error: affiliateError } = await supabase
        .from('mentor_affiliates')
        .select('id, name, provider_name, affiliate_url, commission_rate, description')
        .in('id', affiliateIds);

      if (!affiliateError) {
        affiliateData = affiliates || [];
      }
    }

    // If we have campaigns, select the best ones for this location/context
    const ads: AdToServe[] = [];

    if (campaigns && campaigns.length > 0) {
      // Group campaigns by type for location matching
      const locationAds = campaigns.filter(campaign =>
        campaign.campaign_type === location ||
        campaign.campaign_type === 'feed' // Feed ads can go anywhere
      );

      // If we don't have enough location-specific ads, add some general ones
      const generalAds = campaigns.filter(campaign =>
        campaign.campaign_type !== location &&
        !locationAds.find(la => la.id === campaign.id)
      );

      const selectedCampaigns = [
        ...locationAds.slice(0, Math.ceil(limit / 2)),
        ...generalAds.slice(0, Math.floor(limit / 2))
      ];

      // Convert to AdToServe format
      ads.push(...selectedCampaigns.map(campaign => {
        const affiliate = affiliateData.find(a => a.id === campaign.affiliate_id);
        return {
          campaign_id: campaign.id,
          affiliate_id: campaign.affiliate_id,
          campaign_type: campaign.campaign_type,
          priority: campaign.priority,
          click_url: campaign.click_url || (affiliate ? affiliate.affiliate_url : ''),
          image_url: campaign.image_url,
          headline: campaign.headline || (affiliate ? affiliate.name : campaign.title),
          body_text: campaign.body_text || (affiliate ? affiliate.description : campaign.description),
          call_to_action: campaign.call_to_action
        };
      }));

      // Track impressions for these ads (async, don't wait)
      if (ads.length > 0) {
        const impressionData: AdImpressionData = {
          campaign_id: ads[0].campaign_id,
          affiliate_id: ads[0].affiliate_id,
          referrer: location,
          user_agent: request.headers.get('user-agent') || '',
          location: request.headers.get('CF-IPCountry') || undefined,
          device_type: getDeviceType(request.headers.get('user-agent') || '')
        };

        // Track asynchronously - don't block response
        logImpression(impressionData, user.id, supabase).catch(err =>
          console.error('Failed to log impression:', err)
        );
      }
    }

    return NextResponse.json({ ads: ads.slice(0, limit) });

  } catch (error) {
    console.error('Unexpected error in GET /api/ads:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/ads/impression - Track ad impression
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

    const body: AdImpressionData = await request.json();

    // Validate required fields
    if (!body.campaign_id || !body.referrer) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify campaign exists and is active
    const { data: campaign, error: campaignError } = await supabase
      .from('advertising_campaigns')
      .select('*')
      .eq('id', body.campaign_id)
      .eq('status', 'active')
      .eq('is_active', true)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Campaign not found or inactive' },
        { status: 400 }
      );
    }

    // Insert impression
    const { error: impressionError } = await supabase
      .from('ad_impressions')
      .insert({
        campaign_id: body.campaign_id,
        affiliate_id: body.affiliate_id,
        student_id: user.id,
        user_agent: body.user_agent,
        location: body.location,
        device_type: body.device_type,
        referrer: body.referrer
      });

    if (impressionError) {
      console.error('Error logging impression:', impressionError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to log impression' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unexpected error in POST /api/ads/impression:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to get device type from user agent
function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase();

  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return ua.includes('tablet') || ua.includes('ipad') ? 'tablet' : 'mobile';
  }

  return 'desktop';
}

// Helper function to log impression asynchronously
async function logImpression(data: AdImpressionData, userId: string, supabase: any) {
  try {
    await supabase
      .from('ad_impressions')
      .insert({
        campaign_id: data.campaign_id,
        affiliate_id: data.affiliate_id,
        student_id: userId,
        user_agent: data.user_agent,
        location: data.location,
        device_type: data.device_type,
        referrer: data.referrer
      });
  } catch (error) {
    console.error('Async impression logging failed:', error);
  }
}
