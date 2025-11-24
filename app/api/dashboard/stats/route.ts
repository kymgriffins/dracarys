import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/dashboard/stats - Get dashboard summary stats for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active rooms count
    const { count: activeRoomsCount, error: roomsError } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .in('status', ['waiting', 'active', 'starting']);

    if (roomsError) {
      console.error('Error fetching active rooms:', roomsError);
    }

    // Get user's chapter progress and success rate
    const { data: chapterProgress, error: progressError } = await supabase
      .from('user_chapter_progress')
      .select(`
        *,
        chapters(title, difficulty)
      `)
      .eq('user_id', user.id);

    if (progressError) {
      console.error('Error fetching chapter progress:', progressError);
    }

    // Calculate user ranking (simplified)
    const { data: rankingData, error: rankError } = await supabase
      .from('leaderboard')
      .select('rank_current')
      .eq('user_id', user.id)
      .eq('period', 'all_time')
      .single();

    if (rankError && rankError.code !== 'PGRST116') {
      console.error('Error fetching ranking:', rankError);
    }

    // Get current chapter
    const currentChapter = chapterProgress?.find((p: any) => p.status === 'in_progress') ||
                          chapterProgress?.find((p: any) => p.status === 'unlocked') ||
                          null;

    // Calculate success rate
    const totalAttempted = chapterProgress?.filter((p: any) => ['in_progress', 'completed'].includes(p.status)).length || 0;
    const successRate = totalAttempted > 0
      ? Math.round((chapterProgress?.filter((p: any) => p.status === 'completed').length || 0) / totalAttempted * 100)
      : 0;

    const stats = {
      activeRooms: activeRoomsCount || 0,
      successRate: successRate,
      currentChapter: currentChapter ? {
        title: currentChapter.chapters?.title || 'Unknown',
        progress: currentChapter.progress_percentage || 0,
        difficulty: currentChapter.chapters?.difficulty || 'intermediate'
      } : null,
      userRanking: rankingData?.rank_current || 0,
      cached_at: new Date().toISOString(),
      cache_expires: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
