"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  Brain,
  Target,
  BookOpen,
  CheckCircle,
  Plus,
  Calendar,
  MessageSquare,
  Award,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Users,
  Play,
  ChevronRight,
  BookOpen as LessonIcon,
  Zap,
  Trophy,
  Gamepad2,
  Sword,
  Shield,
  Crown,
  Star,
  Lock,
  Unlock,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

// Custom Progress Component
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn("w-full bg-secondary rounded-full h-2", className)}>
    <div
      className="bg-primary h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Types for API responses
interface DashboardStats {
  activeRooms: number;
  successRate: number;
  currentChapter: {
    title: string;
    progress: number;
    difficulty: string;
  } | null;
  userRanking: number;
}

interface Chapter {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  progress: number;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  points: number;
  lessons: number;
  completedLessons: number;
}

interface Room {
  id: number;
  title: string;
  description: string;
  type: 'interview' | 'practice' | 'multiplayer';
  host: {
    name: string;
    avatar: string;
  };
  participants: number;
  maxParticipants: number;
  skillLevel: string;
  duration: string;
  tags: string[];
  status: 'waiting' | 'active' | 'starting';
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  score: number;
  change: string;
  badge: string;
  isCurrentUser?: boolean;
}

interface PerformanceStats {
  weeklyTrades: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    breakevenTrades: number;
    totalPL: number;
    avgWin: number;
    avgLoss: number;
    dailyBreakdown: number[];
    winRateTrend: number[];
  };
  recentEvaluations: any[];
}

export default function DashboardV2Page() {
  const { user, isLoading: authLoading } = useAuth();

  // API Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);

  // Loading States
  const [loading, setLoading] = useState({
    stats: true,
    chapters: true,
    rooms: true,
    leaderboard: true,
    performance: true
  });

  // Error States
  const [errors, setErrors] = useState({
    stats: false,
    chapters: false,
    rooms: false,
    leaderboard: false,
    performance: false
  });

  // Joining rooms
  const [joiningRoom, setJoiningRoom] = useState<number | null>(null);

  // Fetch functions
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setErrors(prev => ({ ...prev, stats: false }));
      } else {
        setErrors(prev => ({ ...prev, stats: true }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setErrors(prev => ({ ...prev, stats: true }));
    }
    setLoading(prev => ({ ...prev, stats: false }));
  };

  const fetchChapters = async () => {
    try {
      const response = await fetch('/api/chapters');
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
        setErrors(prev => ({ ...prev, chapters: false }));
      } else {
        setErrors(prev => ({ ...prev, chapters: true }));
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setErrors(prev => ({ ...prev, chapters: true }));
    }
    setLoading(prev => ({ ...prev, chapters: false }));
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
        setErrors(prev => ({ ...prev, rooms: false }));
      } else {
        setErrors(prev => ({ ...prev, rooms: true }));
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setErrors(prev => ({ ...prev, rooms: true }));
    }
    setLoading(prev => ({ ...prev, rooms: false }));
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard?period=weekly&limit=5');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        setErrors(prev => ({ ...prev, leaderboard: false }));
      } else {
        setErrors(prev => ({ ...prev, leaderboard: true }));
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setErrors(prev => ({ ...prev, leaderboard: true }));
    }
    setLoading(prev => ({ ...prev, leaderboard: false }));
  };

  const fetchPerformance = async () => {
    try {
      const response = await fetch('/api/performance');
      if (response.ok) {
        const data = await response.json();
        setPerformanceStats(data);
        setErrors(prev => ({ ...prev, performance: false }));
      } else {
        setErrors(prev => ({ ...prev, performance: true }));
      }
    } catch (error) {
      console.error('Error fetching performance:', error);
      setErrors(prev => ({ ...prev, performance: true }));
    }
    setLoading(prev => ({ ...prev, performance: false }));
  };

  const handleJoinRoom = async (roomId: number) => {
    setJoiningRoom(roomId);
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to room or show success message
        console.log('Successfully joined room:', result);
        // You could add a toast notification here
        // Redirect to the room interface
        // window.location.href = `/rooms/${roomId}`;
      } else {
        const error = await response.json();
        console.error('Failed to join room:', error);
        // Show error message
      }
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setJoiningRoom(null);
    }
  };

  const refreshAllData = () => {
    if (!user) return;

    setLoading({
      stats: true,
      chapters: true,
      rooms: true,
      leaderboard: true,
      performance: true
    });

    fetchStats();
    fetchChapters();
    fetchRooms();
    fetchLeaderboard();
    fetchPerformance();
  };

  // Initial data load
  useEffect(() => {
    if (user) {
      refreshAllData();
    }
  }, [user]);

  // Auto-refresh rooms every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchRooms();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading your gamified dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Please log in to access your trading dashboard.</p>
      </div>
    );
  }

  // Fallback hardcoded data in case of API errors
  const fallbackStats = {
    activeRooms: 12,
    successRate: 78,
    currentChapter: {
      title: "Advanced Risk Management",
      progress: 80,
      difficulty: "advanced"
    },
    userRanking: 23
  };

  const fallbackChapters: Chapter[] = [
    {
      id: 1,
      title: "Basic Concepts",
      description: "Market basics and terminology",
      difficulty: "beginner",
      progress: 100,
      status: "completed",
      points: 1250,
      lessons: 8,
      completedLessons: 8
    },
    {
      id: 2,
      title: "Technical Analysis",
      description: "Chart patterns and indicators",
      difficulty: "intermediate",
      progress: 100,
      status: "completed",
      points: 1850,
      lessons: 12,
      completedLessons: 12
    },
    {
      id: 3,
      title: "Risk Management",
      description: "Position sizing and stop-losses",
      difficulty: "advanced",
      progress: 80,
      status: "in_progress",
      points: 2100,
      lessons: 10,
      completedLessons: 8
    }
  ];

  const fallbackRooms: Room[] = [
    {
      id: 1,
      title: "Risk Management Interview",
      description: "Live trading interview session",
      type: "interview",
      host: { name: "Sarah Chen", avatar: "" },
      participants: 1,
      maxParticipants: 2,
      skillLevel: "Advanced",
      duration: "45 min",
      tags: ["Risk", "Live Trading"],
      status: "waiting"
    }
  ];

  const fallbackLeaderboard: LeaderboardEntry[] = [
    { rank: 1, id: "1", name: "Alex Rodriguez", avatar: "", score: 98750, change: "+5", badge: "Champion" },
    { rank: 2, id: "2", name: "Emma Thompson", avatar: "", score: 95120, change: "+2", badge: "Elite" }
  ];

  const fallbackPerformance = {
    weeklyTrades: {
      totalTrades: 35,
      winningTrades: 23,
      losingTrades: 10,
      breakevenTrades: 2,
      totalPL: 6900,
      avgWin: 1247,
      avgLoss: 312,
      dailyBreakdown: [5, 3, 8, 6, 9, 4, 7],
      winRateTrend: [60, 75, 55, 80, 70, 65, 85]
    },
    recentEvaluations: []
  };

  // Use API data with fallbacks
  const currentStats = stats || fallbackStats;
  const currentChapters = !loading.chapters && !errors.chapters && chapters.length > 0 ? chapters : fallbackChapters;
  const currentRooms = !loading.rooms && !errors.rooms && rooms.length > 0 ? rooms : fallbackRooms;
  const currentLeaderboard = !loading.leaderboard && !errors.leaderboard && leaderboard.length > 0 ? leaderboard : fallbackLeaderboard;
  const currentPerformance = performanceStats || fallbackPerformance;

  // Live Stats Summary Cards
  const summaryCards = [
    {
      title: "Active Rooms",
      value: currentStats.activeRooms.toString(),
      detail: "Interviews happening now",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      loading: loading.stats
    },
    {
      title: "Success Rate",
      value: `${currentStats.successRate}%`,
      detail: "+5% this week",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      loading: loading.chapters
    },
    {
      title: "Current Chapter",
      value: currentStats.currentChapter?.title || "No chapter active",
      detail: currentStats.currentChapter ? `${currentStats.currentChapter.progress}% completed` : "Start learning",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      loading: loading.chapters
    },
    {
      title: "Your Ranking",
      value: `#${currentStats.userRanking}`,
      detail: `Top ${Math.round((100 - currentStats.userRanking / 100) * 100)}% globally`,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      loading: loading.stats
    },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="min-h-[calc(100vh-8rem)] space-y-6 lg:space-y-8 w-full max-w-full px-4 sm:px-6">

        {/* Welcome Header - Gamified Theme */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full max-w-full">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Gamepad2 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl lg:text-4xl font-bold truncate">
                Welcome to Trading Arena V2, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader'}!
              </h1>
            </div>
            <p className="text-muted-foreground text-lg truncate">
              Level up your trading skills through competitive challenges and real-time interviews.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAllData}
              disabled={Object.values(loading).some(Boolean)}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", Object.values(loading).some(Boolean) && "animate-spin")} />
              Refresh
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Zap className="w-3 h-3 mr-1" />
              Real-time Data
            </Badge>
            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
              <Crown className="w-3 h-3 mr-1" />
              Level 4 Trader
            </Badge>
          </div>
        </div>

        {/* Live Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {summaryCards.map((card, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                {card.loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between min-w-0">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">{card.title}</p>
                      <p className="text-xl lg:text-2xl font-bold mt-1 truncate">{card.value}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{card.detail}</p>
                    </div>
                    <div className={`p-2 rounded-full ${card.bgColor} flex-shrink-0`}>
                      <card.icon className={`h-4 w-4 lg:h-5 lg:w-5 ${card.color}`} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Error Messages */}
        {Object.values(errors).some(Boolean) && (
          <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Some data may be outdated. Using cached information. Click Refresh to try again.
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-full min-w-0">

          {/* Left Column - Chapter Progression */}
          <div className="lg:col-span-2 space-y-6 min-w-0">

            {/* Chapter Progression */}
            <Card className="border-0 shadow-sm w-full max-w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Chapter Progression
                  {loading.chapters && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                </CardTitle>
                <CardDescription>Your learning path through trading mastery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 w-full max-w-full">
                {loading.chapters ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-5 h-5 bg-muted rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  currentChapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors w-full max-w-full min-w-0"
                    >
                      <div className="flex items-center justify-between mb-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {chapter.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                          {chapter.status === 'in_progress' && <Play className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                          {chapter.status === 'locked' && <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold truncate">{chapter.title}</h4>
                            <p className="text-sm text-muted-foreground truncate">{chapter.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant="outline"
                            className={
                              chapter.difficulty === 'Beginner' ? 'border-green-500 text-green-600' :
                              chapter.difficulty === 'Intermediate' ? 'border-blue-500 text-blue-600' :
                              chapter.difficulty === 'Advanced' ? 'border-purple-500 text-purple-600' :
                              chapter.difficulty === 'Expert' ? 'border-red-500 text-red-600' :
                              'border-yellow-500 text-yellow-600'
                            }
                          >
                            {chapter.difficulty}
                          </Badge>
                          {chapter.status !== 'locked' && (
                            <span className="text-sm font-medium text-yellow-600 flex-shrink-0">
                              +{chapter.points.toLocaleString()} pts
                            </span>
                          )}
                        </div>
                      </div>

                      {chapter.status !== 'locked' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm min-w-0">
                            <span className="truncate">Progress: {chapter.completedLessons}/{chapter.lessons} lessons</span>
                            <span className="text-muted-foreground flex-shrink-0">{chapter.progress}%</span>
                          </div>
                          <Progress value={chapter.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Active Rooms */}
            <Card className="border-0 shadow-sm w-full max-w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Active Rooms
                  {loading.rooms && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                </CardTitle>
                <CardDescription>Join live trading interviews and practice sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 w-full max-w-full">
                {loading.rooms ? (
                  Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="animate-pulse p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/3"></div>
                        </div>
                        <div className="w-20 h-6 bg-muted rounded"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-1">
                          <div className="h-5 w-12 bg-muted rounded"></div>
                          <div className="h-5 w-16 bg-muted rounded"></div>
                        </div>
                        <div className="h-8 w-20 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  currentRooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group w-full max-w-full min-w-0"
                    >
                      <div className="flex items-start justify-between mb-3 min-w-0">
                        <div className="min-w-0 flex-1 mr-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={room.type === 'interview' ? 'default' : room.type === 'practice' ? 'secondary' : 'outline'}
                              className="text-xs flex-shrink-0"
                            >
                              {room.type === 'interview' && <Sword className="w-3 h-3 mr-1" />}
                              {room.type === 'practice' && <Shield className="w-3 h-3 mr-1" />}
                              {room.type === 'multiplayer' && <Trophy className="w-3 h-3 mr-1" />}
                              {room.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs flex-shrink-0">{room.skillLevel}</Badge>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{room.duration}</span>
                          </div>
                          <h4 className="font-semibold mb-1 truncate">{room.title}</h4>
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarImage src={room.host.avatar} alt={room.host.name} />
                              <AvatarFallback className="text-xs">
                                {room.host.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground truncate">{room.host.name}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-muted-foreground mb-1">
                            {room.participants}/{room.maxParticipants}
                          </div>
                          <Badge
                            variant={room.status === 'active' ? 'default' : room.status === 'waiting' ? 'secondary' : 'outline'}
                            className={
                              room.status === 'active' ? 'bg-green-100 text-green-700' :
                              room.status === 'waiting' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }
                          >
                            {room.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between min-w-0">
                        <div className="flex gap-1 min-w-0 flex-1">
                          {room.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs bg-muted px-2 py-1 rounded-md truncate">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          className="flex-shrink-0 group-hover:scale-105 transition-transform"
                          onClick={() => handleJoinRoom(room.id)}
                          disabled={joiningRoom === room.id || room.participants >= room.maxParticipants}
                        >
                          {joiningRoom === room.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Joining...
                            </>
                          ) : room.participants >= room.maxParticipants ? (
                            'Full'
                          ) : (
                            'Join Room'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Leaderboard & Performance */}
          <div className="space-y-6 min-w-0">

            {/* Global Leaderboard */}
            <Card className="border-0 shadow-sm w-full max-w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Leaderboard
                  {loading.leaderboard && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                </CardTitle>
                <CardDescription>Top performers this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 w-full max-w-full">
                {loading.leaderboard ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex items-center gap-3 p-2">
                      <div className="w-6 h-6 bg-muted rounded-full"></div>
                      <div className="w-8 h-8 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  currentLeaderboard.map((player) => (
                    <div key={player.rank} className={cn(
                      "flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors min-w-0",
                      player.isCurrentUser && "bg-primary/5 border border-primary/20"
                    )}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        player.rank === 1 ? 'bg-yellow-500 text-white' :
                        player.rank === 2 ? 'bg-gray-300 text-gray-700' :
                        player.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {player.rank}
                      </div>
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback className="text-xs">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-sm truncate">{player.name}</span>
                          {player.isCurrentUser && <Badge variant="secondary" className="text-xs px-1">You</Badge>}
                          <Badge variant="outline" className="text-xs px-1 flex-shrink-0">{player.badge}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                          <span className="flex-shrink-0">{player.score.toLocaleString()} pts</span>
                          <span className={`flex-shrink-0 ${player.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {player.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full Rankings
                </Button>
              </CardContent>
            </Card>

            {/* Performance Analytics */}
            <Card className="border-0 shadow-sm w-full max-w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Performance
                  {loading.performance && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                </CardTitle>
                <CardDescription>Weekly trading statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 w-full max-w-full">
                {loading.performance ? (
                  <div className="animate-pulse space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="aspect-square bg-muted rounded"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Trades per day */}
                    <div className="w-full max-w-full">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-3">Trades This Week</h4>
                      <div className="space-y-2 w-full max-w-full">
                        <div className="flex items-end justify-between h-16 w-full max-w-full min-w-0">
                          {currentPerformance.weeklyTrades.dailyBreakdown.map((trades, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                              <div
                                className="w-full max-w-full bg-primary/20 rounded-t-sm transition-all duration-300 hover:bg-primary/30"
                                style={{ height: `${Math.max((trades / 10) * 100, 5)}%` }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground w-full max-w-full min-w-0">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                            <span key={`${day}-${index}`} className="flex-1 text-center truncate">{day}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Win Rate */}
                    <div className="w-full max-w-full">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-3">Win Rate Trend</h4>
                      <div className="grid grid-cols-7 gap-1 w-full max-w-full">
                        {currentPerformance.weeklyTrades.winRateTrend.map((rate, index) => (
                          <div
                            key={index}
                            className={`aspect-square rounded ${rate >= 75 ? 'bg-green-500' :
                                rate >= 60 ? 'bg-green-400' :
                                  rate >= 45 ? 'bg-green-300' :
                                    rate >= 30 ? 'bg-orange-300' : 'bg-red-300'
                              }`}
                            title={`${rate}% win rate`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Weekly P/L</span>
                        <span className={currentPerformance.weeklyTrades.totalPL >= 0 ? "text-green-600" : "text-red-600"}>
                          {currentPerformance.weeklyTrades.totalPL >= 0 ? '+' : ''}£{Math.abs(currentPerformance.weeklyTrades.totalPL).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Trades</span>
                        <span className="font-medium">{currentPerformance.weeklyTrades.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Win Rate</span>
                        <span className="font-medium">
                          {currentPerformance.weeklyTrades.totalTrades > 0
                            ? Math.round((currentPerformance.weeklyTrades.winningTrades / currentPerformance.weeklyTrades.totalTrades) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
