import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/chapters - Get all chapters and user's progress
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all chapters with user's progress
    const { data: chaptersData, error: chaptersError } = await supabase
      .from('chapters')
      .select(`
        *,
        user_chapter_progress!inner(*)
      `)
      .eq('user_chapter_progress.user_id', user.id)
      .order('order_position');

    if (chaptersError) {
      console.error('Error fetching chapters:', chaptersError);
      return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
    }

    // Transform data for frontend
    const chapters = chaptersData?.map((chapter: any) => ({
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      difficulty: chapter.difficulty,
      progress: chapter.user_chapter_progress?.[0]?.progress_percentage || 0,
      status: chapter.user_chapter_progress?.[0]?.status || 'locked',
      points: chapter.points_value,
      lessons: chapter.lesson_count,
      completedLessons: chapter.user_chapter_progress?.[0]?.completed_lessons_count || 0
    })) || [];

    return NextResponse.json(chapters);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
