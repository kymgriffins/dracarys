import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/rooms/join - Join a room
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = body;

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    // Check if room exists and is joinable
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*, room_participants(count)')
      .eq('id', roomId)
      .in('status', ['waiting', 'active', 'starting'])
      .single();

    if (roomError) {
      console.error('Error fetching room:', roomError);
      return NextResponse.json({ error: 'Room not found or not joinable' }, { status: 404 });
    }

    // Check if room is full
    const participantCount = room.room_participants?.[0]?.count || 0;
    if (participantCount >= room.max_participants) {
      return NextResponse.json({ error: 'Room is full' }, { status: 400 });
    }

    // Check if user is already in the room
    const { data: existingParticipant, error: checkError } = await supabase
      .from('room_participants')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_id', user.id)
      .single();

    if (existingParticipant) {
      return NextResponse.json({ error: 'Already joined this room' }, { status: 400 });
    }

    // Join room
    const { data: participantData, error: joinError } = await supabase
      .from('room_participants')
      .insert({
        room_id: roomId,
        user_id: user.id,
        role: room.host_id === user.id ? 'host' : 'participant'
      })
      .select()
      .single();

    if (joinError) {
      console.error('Error joining room:', joinError);
      return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      participant: participantData
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
