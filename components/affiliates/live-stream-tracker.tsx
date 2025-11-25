"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  Pause,
  Users,
  Clock,
  Zap,
  Trophy,
  Calendar,
  Video,
  Mic,
  MicOff,
  Eye,
  Heart,
  MessageCircle,
  Crown,
  Star,
  Timer,
  Flame
} from "lucide-react";
import { LiveStreamSession } from "@/lib/types/affiliate-points";

interface LiveStreamTrackerProps {
  currentSession: LiveStreamSession | null;
  upcomingSessions: LiveStreamSession[];
  pastSessions: LiveStreamSession[];
  onJoinSession: (sessionId: string) => void;
  onLeaveSession: (sessionId: string) => void;
  userParticipation: {
    currentSessionId: string | null;
    totalMinutes: number;
    pointsEarned: number;
    streak: number;
  };
}

export function LiveStreamTracker({
  currentSession,
  upcomingSessions,
  pastSessions,
  onJoinSession,
  onLeaveSession,
  userParticipation
}: LiveStreamTrackerProps) {
  const [participationTime, setParticipationTime] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isParticipating && currentSession) {
      interval = setInterval(() => {
        setParticipationTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isParticipating, currentSession]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getStatusColor = (status: LiveStreamSession['status']) => {
    switch (status) {
      case 'live': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'ended': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Live Session */}
      {currentSession && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <CardTitle className="text-green-700">🔴 LIVE NOW</CardTitle>
                  <CardDescription>{currentSession.title}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-600">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">{currentSession.participants.length}</span>
                </div>
                <div className="text-sm text-muted-foreground">watching</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">{currentSession.description}</p>

              {/* Participation Controls */}
              <div className="flex items-center justify-between p-4 bg-white/60 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Your Session Time</div>
                    <div className="font-mono text-lg font-semibold text-green-600">
                      {formatTime(participationTime)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Points Rate</div>
                    <div className="font-semibold text-purple-600">
                      +{currentSession.points_per_minute}/min
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Points Earned</div>
                    <div className="font-semibold text-blue-600">
                      +{Math.floor(participationTime / 60) * currentSession.points_per_minute}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isParticipating ? (
                    <Button
                      onClick={() => {
                        setIsParticipating(true);
                        onJoinSession(currentSession.id);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Join Live
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsParticipating(false);
                        onLeaveSession(currentSession.id);
                      }}
                      variant="outline"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Leave Session
                    </Button>
                  )}
                </div>
              </div>

              {/* Participants */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Live Participants ({currentSession.participants.length})
                </h4>
                <div className="flex -space-x-2">
                  {currentSession.participants.slice(0, 8).map((participantId, index) => (
                    <Avatar key={participantId} className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="text-xs">
                        {participantId.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {currentSession.participants.length > 8 && (
                    <div className="w-8 h-8 bg-gray-200 border-2 border-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">+{currentSession.participants.length - 8}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participation Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            Your Live Participation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(userParticipation.totalMinutes)}
              </div>
              <div className="text-sm text-muted-foreground">Total Watch Time</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{userParticipation.pointsEarned}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Flame className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{userParticipation.streak}</div>
              <div className="text-sm text-muted-foreground">Participation Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Live Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming sessions scheduled</p>
              <p className="text-sm">Check back later for live trading sessions!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{session.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.scheduled_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.scheduled_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          {formatDuration(session.duration)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        +{session.points_per_minute}/min
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Past Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{session.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.scheduled_at).toLocaleDateString()} • {formatDuration(session.duration)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    +{session.total_points_distributed} pts distributed
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.participants.length} participants
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
