"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Download,
  PieChart,
  LineChart,
  Activity,
  Award,
  Zap,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  Clock
} from "lucide-react";
import { EngagementAnalytics, SocialEngagement, UserPoints } from "@/lib/types/affiliate-points";

interface AnalyticsDashboardProps {
  analytics: EngagementAnalytics;
  engagements: SocialEngagement[];
  userPoints: UserPoints | null;
  timeframe: '7d' | '30d' | '90d' | 'all';
  onTimeframeChange: (timeframe: '7d' | '30d' | '90d' | 'all') => void;
}

export function AnalyticsDashboard({
  analytics,
  engagements,
  userPoints,
  timeframe,
  onTimeframeChange
}: AnalyticsDashboardProps) {
  const [activeMetric, setActiveMetric] = useState('points');

  // Mock chart data - in real app this would come from analytics API
  const chartData = {
    points: [
      { date: '2024-12-01', value: 45 },
      { date: '2024-12-02', value: 67 },
      { date: '2024-12-03', value: 89 },
      { date: '2024-12-04', value: 123 },
      { date: '2024-12-05', value: 156 },
      { date: '2024-12-06', value: 178 },
      { date: '2024-12-07', value: 201 }
    ],
    users: [
      { date: '2024-12-01', value: 12 },
      { date: '2024-12-02', value: 18 },
      { date: '2024-12-03', value: 25 },
      { date: '2024-12-04', value: 32 },
      { date: '2024-12-05', value: 28 },
      { date: '2024-12-06', value: 35 },
      { date: '2024-12-07', value: 42 }
    ]
  };

  const getTimeframeLabel = (tf: string) => {
    switch (tf) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'All Time';
    }
  };

  const getEngagementTypeStats = () => {
    const stats = {
      follows: engagements.filter(e => e.type === 'follow').length,
      comments: engagements.filter(e => e.type === 'comment').length,
      shares: engagements.filter(e => e.type === 'share').length,
      liveParticipation: engagements.filter(e => e.type === 'live_participation').length,
      totalPoints: engagements.reduce((sum, e) => sum + e.points_earned, 0)
    };

    const totalEngagements = stats.follows + stats.comments + stats.shares + stats.liveParticipation;

    return {
      ...stats,
      totalEngagements,
      averagePointsPerEngagement: totalEngagements > 0 ? stats.totalPoints / totalEngagements : 0
    };
  };

  const engagementStats = getEngagementTypeStats();

  const exportData = () => {
    const data = {
      analytics,
      engagements,
      userPoints,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Detailed insights into your affiliate program performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analytics.total_users.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Points Distributed</p>
                <p className="text-2xl font-bold">{analytics.total_points_distributed.toLocaleString()}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+8% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{analytics.active_users_today}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-muted-foreground">Real-time</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Points/User</p>
                <p className="text-2xl font-bold">{analytics.average_points_per_user.toFixed(0)}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <BarChart3 className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-muted-foreground">Per active user</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeMetric} onValueChange={setActiveMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="points">Points Distribution</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Types</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Points Distribution by Category</CardTitle>
              <CardDescription>How points are earned across different activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.top_engagement_categories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium capitalize">{category.category.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">{category.points} points</div>
                      </div>
                    </div>
                    <Badge variant="secondary">{category.percentage.toFixed(1)}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
                <CardDescription>Distribution of different engagement types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span>Follows</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{engagementStats.follows}</div>
                      <div className="text-sm text-muted-foreground">{((engagementStats.follows / engagementStats.totalEngagements) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      <span>Comments</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{engagementStats.comments}</div>
                      <div className="text-sm text-muted-foreground">{((engagementStats.comments / engagementStats.totalEngagements) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-green-500" />
                      <span>Shares</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{engagementStats.shares}</div>
                      <div className="text-sm text-muted-foreground">{((engagementStats.shares / engagementStats.totalEngagements) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <span>Live Participation</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{engagementStats.liveParticipation}</div>
                      <div className="text-sm text-muted-foreground">{((engagementStats.liveParticipation / engagementStats.totalEngagements) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key engagement statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{engagementStats.totalEngagements}</div>
                    <div className="text-sm text-muted-foreground">Total Engagements</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{engagementStats.totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Points Earned</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{engagementStats.averagePointsPerEngagement.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Avg Points/Engagement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Levels</CardTitle>
              <CardDescription>Breakdown of user engagement by activity frequency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{Math.round(analytics.total_users * 0.1)}</div>
                  <div className="text-sm text-muted-foreground">Highly Active</div>
                  <div className="text-xs text-muted-foreground mt-1">Daily engagement</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{Math.round(analytics.total_users * 0.3)}</div>
                  <div className="text-sm text-muted-foreground">Moderately Active</div>
                  <div className="text-xs text-muted-foreground mt-1">Weekly engagement</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{Math.round(analytics.total_users * 0.6)}</div>
                  <div className="text-sm text-muted-foreground">Lightly Active</div>
                  <div className="text-xs text-muted-foreground mt-1">Monthly engagement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>Track program growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">+24%</div>
                  <div className="text-sm text-muted-foreground">User Growth</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">+18%</div>
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">+31%</div>
                  <div className="text-sm text-muted-foreground">Points Distribution</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">7-Day Activity Summary</h4>
                <div className="space-y-2">
                  {chartData.points.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{chartData.points[index].value} points</span>
                        <span className="text-sm text-muted-foreground">{chartData.users[index].value} users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
