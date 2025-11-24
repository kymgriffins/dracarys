import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/leaderboard - Get leaderboard data
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const period = url.searchParams.get('period') || 'weekly';
  const limit = parseInt(url.searchParams.get('limit') || '10');

  try {
    const supabase = await createClient();

    // Get current user for context
    const { data: { user } } = await supabase.auth.getUser();

    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select(`
        *,
        profiles:user_id(full_name, avatar_url)
      `)
      .eq('period', period)
      .order('total_points', { ascending: false })
      .limit(limit);

    if (leaderboardError) {
      console.error('Error fetching leaderboard:', leaderboardError);
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    // Transform data for frontend
    const leaderboard = leaderboardData?.map((entry: any, index: number) => ({
      rank: index + 1,
      id: entry.user_id,
      name: entry.profiles?.full_name || 'Anonymous',
      avatar: entry.profiles?.avatar_url || '',
      score: entry.total_points,
      change: entry.rank_current ? (entry.rank_current - (index + 1)) : 0,
      badge: entry.badge_level,
      isCurrentUser: entry.user_id === user?.id
    })) || [];

    return NextResponse.json({
      period,
      leaderboard,
      total: leaderboardData?.length || 0
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
