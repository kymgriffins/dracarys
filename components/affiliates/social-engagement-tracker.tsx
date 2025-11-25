"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Twitter,
  Youtube,
  MessageCircle,
  Heart,
  Share2,
  Users,
  TrendingUp,
  Zap,
  CheckCircle,
  ExternalLink,
  Plus,
  Crown,
  Star
} from "lucide-react";
import { SocialEngagement } from "@/lib/types/affiliate-points";

interface SocialEngagementTrackerProps {
  engagements: SocialEngagement[];
  onEngage: (type: 'follow' | 'comment' | 'share' | 'live_participation', platform?: string, metadata?: any) => void;
  userPoints: number;
}

export function SocialEngagementTracker({
  engagements,
  onEngage,
  userPoints
}: SocialEngagementTrackerProps) {
  const [commentText, setCommentText] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-50' },
    { id: 'discord', name: 'Discord', icon: MessageCircle, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { id: 'twitch', name: 'Twitch', icon: Zap, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const engagementTypes = [
    {
      type: 'follow' as const,
      label: 'Follow Me',
      description: 'Follow on social media',
      points: 25,
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      type: 'comment' as const,
      label: 'Leave a Comment',
      description: 'Share your thoughts',
      points: 15,
      icon: MessageCircle,
      color: 'text-blue-500'
    },
    {
      type: 'share' as const,
      label: 'Share Content',
      description: 'Share my content',
      points: 20,
      icon: Share2,
      color: 'text-green-500'
    },
    {
      type: 'live_participation' as const,
      label: 'Join Live Stream',
      description: 'Participate in live sessions',
      points: 30,
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  const handleEngagement = (type: 'follow' | 'comment' | 'share' | 'live_participation', platform?: string) => {
    const metadata: any = {};

    if (type === 'comment' && commentText.trim()) {
      metadata.comment = commentText;
      metadata.platform = platform || selectedPlatform;
    }

    onEngage(type, platform || selectedPlatform, metadata);

    if (type === 'comment') {
      setCommentText('');
    }
  };

  const getEngagementStats = () => {
    const stats = {
      follows: engagements.filter(e => e.type === 'follow').length,
      comments: engagements.filter(e => e.type === 'comment').length,
      shares: engagements.filter(e => e.type === 'share').length,
      liveParticipation: engagements.filter(e => e.type === 'live_participation').length,
      totalPoints: engagements.reduce((sum, e) => sum + e.points_earned, 0)
    };
    return stats;
  };

  const stats = getEngagementStats();

  return (
    <div className="space-y-6">
      {/* Engagement Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Social Engagement Stats
          </CardTitle>
          <CardDescription>
            Track your community interactions and points earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
              <div className="text-2xl font-bold text-pink-600">{stats.follows}</div>
              <div className="text-sm text-muted-foreground">Follows</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-blue-600">{stats.comments}</div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <Share2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-600">{stats.shares}</div>
              <div className="text-sm text-muted-foreground">Shares</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold text-purple-600">{stats.liveParticipation}</div>
              <div className="text-sm text-muted-foreground">Live Sessions</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold text-purple-600">
              Total Points Earned: {stats.totalPoints}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Earn Points Through Engagement</CardTitle>
          <CardDescription>
            Interact with my content and build your points balance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Platform</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={selectedPlatform === platform.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPlatform(platform.id)}
                  className="flex items-center gap-2"
                >
                  <platform.icon className="w-4 h-4" />
                  {platform.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Engagement Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engagementTypes.map((engagement) => (
              <Card key={engagement.type} className="border-2 hover:border-purple-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <engagement.icon className={`w-5 h-5 ${engagement.color}`} />
                      <span className="font-medium">{engagement.label}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +{engagement.points} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{engagement.description}</p>

                  {engagement.type === 'comment' ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button
                        className="w-full"
                        onClick={() => handleEngagement('comment')}
                        disabled={!commentText.trim() || !selectedPlatform}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleEngagement(engagement.type)}
                      disabled={!selectedPlatform && engagement.type !== 'live_participation'}
                    >
                      <engagement.icon className="w-4 h-4 mr-2" />
                      {engagement.label}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Engagements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recent Engagements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {engagements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No engagements yet. Start interacting to earn points!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {engagements.slice(0, 10).map((engagement) => {
                const platform = platforms.find(p => p.id === engagement.platform);
                const engagementType = engagementTypes.find(e => e.type === engagement.type);

                return (
                  <div key={engagement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {platform && <platform.icon className={`w-4 h-4 ${platform.color}`} />}
                      {engagementType && <engagementType.icon className={`w-4 h-4 ${engagementType.color}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {engagement.type.replace('_', ' ')}
                        {platform && ` on ${platform.name}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(engagement.created_at).toLocaleDateString()}
                        {engagement.metadata?.comment && (
                          <span className="ml-2">• "{engagement.metadata.comment.slice(0, 50)}..."</span>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +{engagement.points_earned} pts
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
