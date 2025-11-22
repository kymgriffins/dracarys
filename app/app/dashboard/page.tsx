"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ArrowDownRight,
  User as UserIcon,
  Mail,
  Calendar as CalendarIcon
} from "lucide-react";

// Sample psychology-focused trader development data
const stats = [
  {
    title: "Discipline Score",
    value: "8.2/10",
    change: "+0.3",
    changeType: "positive" as const,
    icon: Target,
    description: "Daily routine adherence"
  },
  {
    title: "Psychological Win Rate",
    value: "72.4%",
    change: "+5.1%",
    changeType: "positive" as const,
    icon: Brain,
    description: "Trades where emotions were controlled"
  },
  {
    title: "Journal Streak",
    value: "12 days",
    change: "Current",
    changeType: "neutral" as const,
    icon: BookOpen,
    description: "Consecutive daily entries"
  },
  {
    title: "Routine Completion",
    value: "85%",
    change: "+12%",
    changeType: "positive" as const,
    icon: CheckCircle,
    description: "Weekly ritual adherence"
  },
];

// Psychology-focused recent journal entries
const recentJournalEntries = [
  {
    id: "1",
    title: "Morning Preparation Missed - Need to Fix",
    emotionalState: "Rushed",
    disciplineScore: 6,
    time: "2 hours ago",
    status: "needs-review",
  },
  {
    id: "2",
    title: "Perfect Entry on Setup #3",
    emotionalState: "Calm",
    disciplineScore: 9,
    time: "1 day ago",
    status: "reviewed",
  },
  {
    id: "3",
    title: "Dealt with FOMO, exited early",
    emotionalState: "Anxious",
    disciplineScore: 8,
    time: "2 days ago",
    status: "reviewed",
  },
];

// Psychology-focused activity feed
const activityFeed = [
  {
    id: "1",
    type: "journal",
    title: "New journal entry",
    description: "Completed today's pre-session routine",
    time: "2h ago",
    icon: BookOpen,
  },
  {
    id: "2",
    type: "routine",
    title: "Routine completed",
    description: "Morning preparation checklist finished",
    time: "3h ago",
    icon: CheckCircle,
  },
  {
    id: "3",
    type: "mentor",
    title: "Mentor feedback received",
    description: "Coach reviewed your latest bias pattern analysis",
    time: "1d ago",
    icon: MessageSquare,
  },
  {
    id: "4",
    type: "goal",
    title: "Goal milestone achieved",
    description: "30-day consistency streak reached",
    time: "2d ago",
    icon: Award,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  // Get user initials for avatar fallback
  const getUserInitials = (email?: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  // Format creation date
  const formatCreationDate = (createdAt?: string) => {
    if (!createdAt) return "Unknown";
    return new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* User Profile Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src="" alt={user?.email || "User"} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                {getUserInitials(user?.email)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader'}!</h1>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <UserIcon className="w-4 h-4" />
                  <span>ID: {user?.id?.substring(0, 8)}...</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Joined {formatCreationDate(user?.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
              <Button size="sm">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Trader Development Dashboard</h2>
          <p className="text-muted-foreground">
            Focus on your psychology and discipline. Your mental game drives results.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Journal Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stat.changeType === "positive" ? (
              <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-red-600 mr-1" />
            )}
            <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
              {stat.change}
            </span>
            <span className="ml-1">{stat.description}</span>
          </div>
        </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Performance Trend
          </CardTitle>
          <CardDescription>
            Your psychological performance over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-end justify-between space-x-1">
            {/* Simple bar chart representation */}
            {[65, 72, 68, 78, 82, 79, 85].map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-primary/20 rounded-t-sm transition-all duration-300 hover:bg-primary/30"
                  style={{ height: `${value}%` }}
                >
                  <div
                    className="w-full bg-primary rounded-t-sm transition-all duration-300"
                    style={{ height: `${Math.min(value, 85)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-muted-foreground">Average: 75.6%</span>
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>+8.4% this week</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
