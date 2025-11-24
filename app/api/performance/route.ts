import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/performance - Get user's performance analytics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent trades for weekly performance
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentTrades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_time', sevenDaysAgo.toISOString())
      .order('entry_time', { ascending: false });

    if (tradesError) {
      console.error('Error fetching trades:', tradesError);
    }

    // Calculate weekly stats
    const weeklyStats = recentTrades ? {
      totalTrades: recentTrades.length,
      winningTrades: recentTrades.filter((t: any) => t.result === 'win').length,
      losingTrades: recentTrades.filter((t: any) => t.result === 'loss').length,
      breakevenTrades: recentTrades.filter((t: any) => t.result === 'breakeven').length,
      totalPL: recentTrades.reduce((sum: number, t: any) => sum + (t.reward_amount || 0) - (t.risk_amount || 0), 0),
      avgWin: recentTrades.filter((t: any) => t.result === 'win').reduce((sum: number, t: any) => sum + (t.reward_amount || 0), 0) / (recentTrades.filter((t: any) => t.result === 'win').length || 1),
      avgLoss: recentTrades.filter((t: any) => t.result === 'loss').reduce((sum: number, t: any) => sum + (t.risk_amount || 0), 0) / (recentTrades.filter((t: any) => t.result === 'loss').length || 1),
    } : {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      breakevenTrades: 0,
      totalPL: 0,
      avgWin: 0,
      avgLoss: 0,
    };

    // Get room performance
    const { data: roomEvaluations, error: evalError } = await supabase
      .from('room_evaluations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (evalError) {
      console.error('Error fetching evaluations:', evalError);
    }

    // Transform evaluations for frontend
    const evaluations = roomEvaluations?.map((evaluation: any) => ({
      id: evaluation.id,
      roomId: evaluation.room_id,
      type: evaluation.evaluation_type,
      overall: evaluation.overall_score,
      technical: evaluation.technical_score,
      psychology: evaluation.psychology_score,
      riskManagement: evaluation.risk_management_score,
      communication: evaluation.communication_score,
      grade: evaluation.grade,
      pointsAwarded: evaluation.points_awarded,
      feedback: evaluation.feedback_summary,
      createdAt: evaluation.created_at
    })) || [];

    // Generate daily trade counts for the week (simplified)
    const dailyTrades = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTrades = recentTrades?.filter((t: any) =>
        new Date(t.entry_time).toDateString() === date.toDateString()
      ).length || 0;
      dailyTrades.push(dayTrades);
    }

    // Calculate win rate trend (simplified)
    const winRateTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTrades = recentTrades?.filter((t: any) =>
        new Date(t.entry_time).toDateString() === date.toDateString()
      ) || [];
      const winRate = dayTrades.length > 0
        ? (dayTrades.filter((t: any) => t.result === 'win').length / dayTrades.length) * 100
        : 0;
      winRateTrend.push(Math.round(winRate));
    }

    const performance = {
      weeklyTrades: {
        ...weeklyStats,
        dailyBreakdown: dailyTrades,
        winRateTrend: winRateTrend,
      },
      recentEvaluations: evaluations,
      calculated_at: new Date().toISOString(),
      cache_expires: new Date(Date.now() + 15 * 60 * 1000).toISOString() // Cache for 15 minutes
    };

    return NextResponse.json(performance);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
