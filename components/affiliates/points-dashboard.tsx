"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Star,
  TrendingUp,
  Users,
  Target,
  Award,
  Zap,
  Crown,
  Flame,
  Gift,
  Calendar,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Minus,
  Medal,
  Sparkles
} from "lucide-react";
import { UserPoints, LeaderboardEntry, Achievement, Reward, PointsBreakdown } from "@/lib/types/affiliate-points";

interface PointsDashboardProps {
  userPoints: UserPoints | null;
  leaderboard: LeaderboardEntry[];
  recentAchievements: Achievement[];
  availableRewards: Reward[];
  onClaimReward: (rewardId: string) => void;
}

export function PointsDashboard({
  userPoints,
  leaderboard,
  recentAchievements,
  availableRewards,
  onClaimReward
}: PointsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!userPoints) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Points System Loading...</h3>
          <p className="text-muted-foreground text-center">
            Setting up your gamified experience
          </p>
        </CardContent>
      </Card>
    );
  }

  const getLevelProgress = () => {
    const currentLevelXP = userPoints.level * 1000; // Assuming 1000 XP per level
    const nextLevelXP = (userPoints.level + 1) * 1000;
    const progress = ((userPoints.experience_points - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ChevronDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Points Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Points Journey
              </CardTitle>
              <CardDescription>
                Level up by engaging with content and earning rewards
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{userPoints.total_points.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Level Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Level {userPoints.level}</span>
                <span className="text-sm text-muted-foreground">
                  {userPoints.experience_points - (userPoints.level * 1000)} / 1000 XP
                </span>
              </div>
              <Progress value={getLevelProgress()} className="h-3" />
              <div className="flex items-center gap-2 mt-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">
                  {userPoints.streak.current} day streak
                </span>
              </div>
            </div>

            {/* Points Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <Target className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <div className="font-semibold text-blue-600">{userPoints.points_breakdown.affiliate_clicks}</div>
                <div className="text-xs text-muted-foreground">Clicks</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <Users className="w-6 h-6 mx-auto mb-1 text-green-500" />
                <div className="font-semibold text-green-600">{userPoints.points_breakdown.social_follows}</div>
                <div className="text-xs text-muted-foreground">Follows</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <Zap className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                <div className="font-semibold text-purple-600">{userPoints.points_breakdown.live_stream_participation}</div>
                <div className="text-xs text-muted-foreground">Live Minutes</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <Star className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                <div className="font-semibold text-yellow-600">{userPoints.points_breakdown.comments}</div>
                <div className="text-xs text-muted-foreground">Comments</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAchievements.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No achievements yet. Start engaging to unlock rewards!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentAchievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-muted-foreground">{achievement.description}</div>
                        </div>
                        <Badge variant="secondary">+{achievement.points_reward} pts</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Points Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Points Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Affiliate Clicks</span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      +{userPoints.points_breakdown.affiliate_clicks * 10}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Social Engagement</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      +{userPoints.points_breakdown.social_follows * 5}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Live Participation</span>
                    </div>
                    <span className="font-semibold text-purple-600">
                      +{userPoints.points_breakdown.live_stream_participation}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Community Leaderboard
              </CardTitle>
              <CardDescription>
                Top performers this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div key={entry.user_id} className={`flex items-center gap-4 p-3 rounded-lg ${
                    entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {entry.rank}
                      </div>
                      <Avatar>
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{entry.username}</div>
                        <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      {getRankChangeIcon(entry.change)}
                      <span className="font-semibold">{entry.total_points.toLocaleString()} pts</span>
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">{entry.achievements_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPoints.achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h3 className="font-semibold mb-1">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      +{achievement.points_reward} points
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{reward.icon}</div>
                    <h3 className="font-semibold">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Cost:</span>
                    <Badge variant="outline">{reward.points_cost} points</Badge>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!reward.available || userPoints.total_points < reward.points_cost}
                    onClick={() => onClaimReward(reward.id)}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {userPoints.total_points >= reward.points_cost ? 'Claim Reward' : 'Not Enough Points'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
