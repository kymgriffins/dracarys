import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/rooms - Get active rooms with participants
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select(`
        *,
        profiles!rooms_host_id_fkey(full_name, avatar_url),
        room_participants(count)
      `)
      .in('status', ['waiting', 'active', 'starting'])
      .order('created_at', { ascending: false });

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError);
      return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
    }

    // Transform data for frontend
    const rooms = roomsData?.map((room: any) => ({
      id: room.id,
      title: room.title,
      description: room.description,
      type: room.type,
      host: {
        name: room.profiles?.full_name || 'Unknown',
        avatar: room.profiles?.avatar_url || ''
      },
      participants: room.room_participants?.[0]?.count || 0,
      maxParticipants: room.max_participants,
      skillLevel: room.skill_level,
      duration: room.duration_minutes,
      tags: room.tags || [],
      status: room.status
    })) || [];

    return NextResponse.json(rooms);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, type, maxParticipants, skillLevel, duration, tags } = body;

    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .insert({
        title,
        description,
        type,
        host_id: user.id,
        max_participants: maxParticipants || 12,
        skill_level: skillLevel || 'all',
        duration_minutes: duration,
        tags: tags || []
      })
      .select()
      .single();

    if (roomError) {
      console.error('Error creating room:', roomError);
      return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
    }

    return NextResponse.json(roomData, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
