"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, DollarSign, Eye, TrendingUp, Users, Plus, Settings, BarChart3, Trash2, Edit, Target, Award, Star, ExternalLink, CheckCircle, Trophy, Crown, Zap, Gift, Flame, Sparkles } from "lucide-react";
import { MentorAffiliate, AdvertisingCampaign, AffiliateDashboardStats } from "@/lib/types/mentor";
import { UserPoints, LeaderboardEntry, Achievement, Reward, SocialEngagement, LiveStreamSession, EngagementAnalytics } from "@/lib/types/affiliate-points";
import { CreateAffiliateDialog } from "@/components/affiliates/create-affiliate-dialog";
import { EditAffiliateDialog } from "@/components/affiliates/edit-affiliate-dialog";
import { DeleteAffiliateDialog } from "@/components/affiliates/delete-affiliate-dialog";
import { CreateCampaignDialog } from "@/components/affiliates/create-campaign-dialog";
import { EditCampaignDialog } from "@/components/affiliates/edit-campaign-dialog";
import { DeleteCampaignDialog } from "@/components/affiliates/delete-campaign-dialog";
import { PointsDashboard } from "@/components/affiliates/points-dashboard";
import { SocialEngagementTracker } from "@/components/affiliates/social-engagement-tracker";
import { LiveStreamTracker } from "@/components/affiliates/live-stream-tracker";
import { RewardsStore } from "@/components/affiliates/rewards-store";
import { AnalyticsDashboard } from "@/components/affiliates/analytics-dashboard";
import { RealTimeNotifications } from "@/components/affiliates/real-time-notifications";

interface AffiliatesPageProps {}

export default function AffiliatesPage({}: AffiliatesPageProps) {
  const { user } = useAuth();
  const [affiliates, setAffiliates] = useState<MentorAffiliate[]>([]);
  const [campaigns, setCampaigns] = useState<AdvertisingCampaign[]>([]);
  const [stats, setStats] = useState<AffiliateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Gamification state
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [socialEngagements, setSocialEngagements] = useState<SocialEngagement[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveStreamSession[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<EngagementAnalytics | null>(null);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [liveStats, setLiveStats] = useState({
    activeUsers: 89,
    pointsEarnedToday: 1247,
    liveStreamsActive: 1,
    recentEngagements: 23
  });

  // Dialog states
  const [createAffiliateOpen, setCreateAffiliateOpen] = useState(false);
  const [editAffiliateOpen, setEditAffiliateOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<MentorAffiliate | null>(null);
  const [deleteAffiliateOpen, setDeleteAffiliateOpen] = useState(false);

  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [editCampaignOpen, setEditCampaignOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<AdvertisingCampaign | null>(null);
  const [deleteCampaignOpen, setDeleteCampaignOpen] = useState(false);

  // Success/error messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper functions
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Mock data for gamification features
  const initializeGamificationData = () => {
    // Mock user points
    const mockUserPoints: UserPoints = {
      id: "user-1",
      user_id: user?.id || "user-1",
      total_points: 2847,
      level: 12,
      experience_points: 2847,
      points_breakdown: {
        affiliate_clicks: 45,
        social_follows: 23,
        live_stream_participation: 156,
        comments: 18,
        content_shares: 12,
        referrals: 7,
        daily_login: 30,
        challenge_completion: 5,
        leaderboard_position: 8
      },
      achievements: [
        {
          id: "first-click",
          name: "First Affiliate Click",
          description: "Made your first affiliate link click",
          icon: "🎯",
          points_reward: 10,
          unlocked_at: new Date("2024-01-15"),
          category: "affiliate_master"
        },
        {
          id: "social-butterfly",
          name: "Social Butterfly",
          description: "Followed on 5 different platforms",
          icon: "🦋",
          points_reward: 50,
          unlocked_at: new Date("2024-02-01"),
          category: "social_influencer"
        },
        {
          id: "live-stream-champion",
          name: "Live Stream Champion",
          description: "Participated in 10 live sessions",
          icon: "🏆",
          points_reward: 100,
          unlocked_at: new Date("2024-02-15"),
          category: "community_builder"
        }
      ],
      badges: [
        {
          id: "early-adopter",
          name: "Early Adopter",
          description: "Joined the affiliate program early",
          icon: "🚀",
          rarity: "rare",
          unlocked_at: new Date("2024-01-01")
        }
      ],
      streak: {
        current: 7,
        longest: 14,
        last_activity: new Date()
      },
      created_at: new Date("2024-01-01"),
      updated_at: new Date()
    };

    // Mock leaderboard
    const mockLeaderboard: LeaderboardEntry[] = [
      { user_id: "user-1", username: "You", avatar: undefined, total_points: 2847, level: 12, rank: 3, change: 1, achievements_count: 15 },
      { user_id: "user-2", username: "TradingPro2024", avatar: undefined, total_points: 3456, level: 15, rank: 1, change: -1, achievements_count: 22 },
      { user_id: "user-3", username: "CryptoKing", avatar: undefined, total_points: 3124, level: 14, rank: 2, change: 0, achievements_count: 18 },
      { user_id: "user-4", username: "ForexMaster", avatar: undefined, total_points: 2654, level: 11, rank: 4, change: 2, achievements_count: 14 },
      { user_id: "user-5", username: "TradeGuru", avatar: undefined, total_points: 2341, level: 10, rank: 5, change: -1, achievements_count: 12 }
    ];

    // Mock social engagements
    const mockEngagements: SocialEngagement[] = [
      {
        id: "eng-1",
        user_id: user?.id || "user-1",
        type: "follow",
        platform: "twitter",
        points_earned: 25,
        metadata: {},
        created_at: new Date("2024-12-01")
      },
      {
        id: "eng-2",
        user_id: user?.id || "user-1",
        type: "comment",
        platform: "youtube",
        points_earned: 15,
        metadata: { comment: "Great trading insights!" },
        created_at: new Date("2024-12-02")
      },
      {
        id: "eng-3",
        user_id: user?.id || "user-1",
        type: "live_participation",
        platform: "twitch",
        points_earned: 45,
        metadata: {},
        created_at: new Date("2024-12-03")
      }
    ];

    // Mock live sessions
    const mockLiveSessions: LiveStreamSession[] = [
      {
        id: "live-1",
        title: "Weekly Trading Strategy Session",
        description: "Deep dive into current market trends and trading strategies",
        scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 90,
        participants: ["user-1", "user-2", "user-3"],
        points_per_minute: 2,
        total_points_distributed: 270,
        status: "scheduled",
        recording_url: undefined
      },
      {
        id: "live-2",
        title: "Market Analysis Live",
        description: "Real-time market analysis and trade opportunities",
        scheduled_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        duration: 60,
        participants: ["user-1", "user-2", "user-4", "user-5"],
        points_per_minute: 2,
        total_points_distributed: 480,
        status: "ended",
        recording_url: "https://youtube.com/watch?v=example"
      }
    ];

    // Mock rewards
    const mockRewards: Reward[] = [
      {
        id: "reward-1",
        name: "10% Trading Course Discount",
        description: "Get 10% off any premium trading course",
        points_cost: 500,
        type: "discount",
        value: 10,
        icon: "💰",
        available: true,
        claims_count: 45,
        max_claims: 100
      },
      {
        id: "reward-2",
        name: "VIP Community Access",
        description: "1 month of premium community access",
        points_cost: 750,
        type: "feature",
        value: 30,
        icon: "👑",
        available: true,
        claims_count: 23,
        max_claims: 50
      },
      {
        id: "reward-3",
        name: "Exclusive Webinar Invite",
        description: "Invitation to private trading webinar",
        points_cost: 1000,
        type: "exclusive",
        value: 1,
        icon: "🎟️",
        available: true,
        claims_count: 8,
        max_claims: 20
      }
    ];

    // Mock analytics data
    const mockAnalytics: EngagementAnalytics = {
      total_users: 1247,
      active_users_today: 89,
      active_users_week: 423,
      active_users_month: 892,
      total_points_distributed: 45632,
      average_points_per_user: 36.5,
      top_engagement_categories: [
        { category: 'affiliate_clicks', points: 15240, percentage: 33.4 },
        { category: 'live_stream_participation', points: 12450, percentage: 27.3 },
        { category: 'social_follows', points: 9870, percentage: 21.6 },
        { category: 'comments', points: 4560, percentage: 10.0 },
        { category: 'content_shares', points: 3512, percentage: 7.7 }
      ],
      growth_trends: {
        daily: [45, 67, 89, 123, 156, 178, 201],
        weekly: [320, 380, 425, 480, 520, 580, 650],
        monthly: [1200, 1350, 1480, 1620, 1750, 1890, 2100]
      }
    };

    setUserPoints(mockUserPoints);
    setLeaderboard(mockLeaderboard);
    setSocialEngagements(mockEngagements);
    setLiveSessions(mockLiveSessions);
    setAvailableRewards(mockRewards);
    setClaimedRewards(["reward-1"]); // Mock some claimed rewards
    setAnalytics(mockAnalytics);
  };

  // Gamification handlers
  const handleEngage = async (type: 'follow' | 'comment' | 'share' | 'live_participation', platform?: string, metadata?: any) => {
    const pointsEarned = type === 'follow' ? 25 : type === 'comment' ? 15 : type === 'share' ? 20 : 30;

    const newEngagement: SocialEngagement = {
      id: `eng-${Date.now()}`,
      user_id: user?.id || "user-1",
      type,
      platform,
      points_earned: pointsEarned,
      metadata: metadata || {},
      created_at: new Date()
    };

    setSocialEngagements(prev => [newEngagement, ...prev]);
    setUserPoints(prev => prev ? {
      ...prev,
      total_points: prev.total_points + pointsEarned,
      points_breakdown: {
        ...prev.points_breakdown,
        [type === 'follow' ? 'social_follows' :
         type === 'comment' ? 'comments' :
         type === 'share' ? 'content_shares' : 'live_stream_participation']:
          prev.points_breakdown[type === 'follow' ? 'social_follows' :
                              type === 'comment' ? 'comments' :
                              type === 'share' ? 'content_shares' : 'live_stream_participation'] + 1
      }
    } : null);

    showMessage('success', `+${pointsEarned} points earned for ${type.replace('_', ' ')}!`);
  };

  const handleClaimReward = async (rewardId: string) => {
    const reward = availableRewards.find(r => r.id === rewardId);
    if (!reward || !userPoints || userPoints.total_points < reward.points_cost) return;

    setUserPoints(prev => prev ? {
      ...prev,
      total_points: prev.total_points - reward.points_cost
    } : null);

    setClaimedRewards(prev => [...prev, rewardId]);
    showMessage('success', `Successfully claimed "${reward.name}"!`);
  };

  const handleJoinLiveSession = async (sessionId: string) => {
    setLiveSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, participants: [...session.participants, user?.id || "user-1"] }
        : session
    ));
    showMessage('success', 'Joined live session! Start earning points by participating.');
  };

  const handleLeaveLiveSession = async (sessionId: string) => {
    setLiveSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, participants: session.participants.filter(id => id !== (user?.id || "user-1")) }
        : session
    ));
  };

  const refreshData = async () => {
    try {
      // Fetch affiliates (with mock data for demonstration)
      const affiliatesResponse = await fetch('/api/affiliates?mock=true');
      if (affiliatesResponse.ok) {
        const affiliatesData = await affiliatesResponse.json();
        setAffiliates(affiliatesData.affiliates || []);
      }

      // Fetch campaigns
      const campaignsResponse = await fetch('/api/campaigns');
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      // Update stats
      const totalClicks = affiliates.reduce((sum, aff) => sum + aff.click_count, 0);
      const totalConversions = affiliates.reduce((sum, aff) => sum + aff.conversion_count, 0);
      const totalRevenue = affiliates.reduce((sum, aff) => sum + Number(aff.revenue_generated), 0);
      const totalImpressions = campaigns.reduce((sum, camp) => sum + (camp.target_audience === 'all_students' ? 1000 : 500), 0);

      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      setStats({
        total_affiliates: affiliates.length,
        total_campaigns: campaigns.length,
        active_campaigns: campaigns.filter(c => c.status === 'active').length,
        total_clicks: totalClicks,
        total_conversions: totalConversions,
        total_revenue: totalRevenue,
        ctr_average: ctr,
        conversion_rate_average: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Affiliate handlers
  const handleCreateAffiliate = async (newAffiliate: MentorAffiliate) => {
    setAffiliates(prev => [newAffiliate, ...prev]);
    await refreshData();
    showMessage('success', 'Affiliate created successfully!');
  };

  const handleUpdateAffiliate = async (updatedAffiliate: MentorAffiliate) => {
    setAffiliates(prev => prev.map(aff =>
      aff.id === updatedAffiliate.id ? updatedAffiliate : aff
    ));
    await refreshData();
    showMessage('success', 'Affiliate updated successfully!');
  };

  const handleDeleteAffiliate = async (affiliateToDelete: MentorAffiliate) => {
    try {
      const response = await fetch(`/api/affiliates/${affiliateToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete affiliate');
      }

      setAffiliates(prev => prev.filter(aff => aff.id !== affiliateToDelete.id));
      setCampaigns(prev => prev.map(campaign =>
        campaign.affiliate_id === affiliateToDelete.id
          ? { ...campaign, affiliate_id: undefined, affiliate: undefined }
          : campaign
      ));
      await refreshData();
      showMessage('success', 'Affiliate deleted successfully!');
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to delete affiliate');
    }
  };

  // Campaign handlers
  const handleCreateCampaign = async (newCampaign: AdvertisingCampaign) => {
    setCampaigns(prev => [newCampaign, ...prev]);
    await refreshData();
    showMessage('success', 'Campaign created successfully!');
  };

  const handleUpdateCampaign = async (updatedCampaign: AdvertisingCampaign) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
    await refreshData();
    showMessage('success', 'Campaign updated successfully!');
  };

  const handleDeleteCampaign = async (campaignToDelete: AdvertisingCampaign) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete campaign');
      }

      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignToDelete.id));
      await refreshData();
      showMessage('success', 'Campaign deleted successfully!');
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to delete campaign');
    }
  };

  // Fetch affiliates and campaigns data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real affiliates data
        const affiliatesResponse = await fetch('/api/affiliates');
        let affiliatesData: MentorAffiliate[] = [];

        if (affiliatesResponse.ok) {
          const data = await affiliatesResponse.json();
          affiliatesData = data.affiliates || [];
        } else {
          console.error('Failed to fetch affiliates:', affiliatesResponse.statusText);
          // Show error message to user
          showMessage('error', 'Failed to load affiliate data. Please refresh the page.');
        }

        // If no real data, show mock data for demonstration
        if (affiliatesData.length === 0) {
          const mockResponse = await fetch('/api/affiliates?mock=true');
          if (mockResponse.ok) {
            const mockData = await mockResponse.json();
            affiliatesData = mockData.affiliates || [];
          }
        }

        setAffiliates(affiliatesData);

        // Fetch campaigns
        const campaignsResponse = await fetch('/api/campaigns');
        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json();
          setCampaigns(campaignsData.campaigns || []);
        }

        // Generate stats based on the data we have
        const totalClicks = affiliatesData.reduce((sum, aff) => sum + aff.click_count, 0);
        const totalConversions = affiliatesData.reduce((sum, aff) => sum + aff.conversion_count, 0);
        const totalRevenue = affiliatesData.reduce((sum, aff) => sum + Number(aff.revenue_generated), 0);
        const totalImpressions = campaigns.reduce((sum, camp) => sum + (camp.target_audience === 'all_students' ? 1000 : 500), 0); // Placeholder

        const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

        setStats({
          total_affiliates: affiliatesData.length,
          total_campaigns: campaigns.length,
          active_campaigns: campaigns.filter(c => c.status === 'active').length,
          total_clicks: totalClicks,
          total_conversions: totalConversions,
          total_revenue: totalRevenue,
          ctr_average: ctr,
          conversion_rate_average: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
        });

      } catch (error) {
        console.error('Error fetching affiliate data:', error);
        showMessage('error', 'Failed to load data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    initializeGamificationData();

    // Simulate live updates
    const liveUpdateInterval = setInterval(() => {
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        pointsEarnedToday: prev.pointsEarnedToday + Math.floor(Math.random() * 10),
        liveStreamsActive: Math.max(0, prev.liveStreamsActive + (Math.random() > 0.8 ? 1 : 0) - (Math.random() > 0.9 ? 1 : 0)),
        recentEngagements: prev.recentEngagements + Math.floor(Math.random() * 2)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(liveUpdateInterval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success/Error Messages */}
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* SaaS Platform Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 rounded-lg p-8 mb-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Funded Trader Toolkit
              </h1>
            </div>
            <p className="text-lg text-gray-700 mb-3">
              Curated marketplace of top trading prop firms and brokers to help traders get funded faster.
            </p>
            {userPoints && (
              <div className="flex items-center gap-4 mb-3 p-3 bg-white/60 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold">Level {userPoints.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">{userPoints.total_points.toLocaleString()} Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">{userPoints.streak.current} Day Streak</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Earn 10 Points</span> per prop firm click
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>25 Points for following me</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <span>Live stream participation rewards</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-500" />
                <span>Redeem points for exclusive rewards</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                onClick={() => setCreateAffiliateOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Prop Firm
              </Button>
              <RealTimeNotifications
                onNotificationClick={(notification) => {
                  showMessage('success', `Clicked: ${notification.title}`);
                }}
                onMarkAsRead={(id) => {
                  showMessage('success', 'Notification marked as read');
                }}
                onMarkAllAsRead={() => {
                  showMessage('success', 'All notifications marked as read');
                }}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setCreateCampaignOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Live Activity Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">LIVE ACTIVITY</span>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>{liveStats.activeUsers} users online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>{liveStats.pointsEarnedToday} points earned today</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>{liveStats.liveStreamsActive} live stream{liveStats.liveStreamsActive !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span>{liveStats.recentEngagements} recent engagements</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Sparkles className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_revenue?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              From affiliate commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_clicks?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Affiliate links clicked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_conversions?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Students who signed up
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_campaigns || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Running ad campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="affiliates">Prop Firms</TabsTrigger>
          <TabsTrigger value="campaigns">Brokers</TabsTrigger>
          <TabsTrigger value="points" className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            Points
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            Live
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Affiliates */}
            <Card>
              <CardHeader>
                <CardTitle>Your Affiliates</CardTitle>
                <CardDescription>
                  Prop firms and brokers you're promoting
                </CardDescription>
              </CardHeader>
              <CardContent>
                {affiliates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50 text-blue-500" />
                    <p className="mb-2">No prop firms in your marketplace yet</p>
                    <p className="text-sm mb-4">Add trading prop firms to create your Funding Marketplace.</p>
                    <Button mt-4 size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Prop Firm
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {affiliates.slice(0, 3).map((affiliate) => (
                      <div key={affiliate.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium">{affiliate.name}</div>
                            <div className="text-sm text-muted-foreground">{affiliate.provider_name}</div>
                          </div>
                          <Badge variant={affiliate.is_active ? "default" : "secondary"}>
                            {affiliate.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{affiliate.click_count} clicks</span>
                          <a
                            href={affiliate.affiliate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-800 underline truncate max-w-48"
                            title={affiliate.affiliate_url}
                          >
                            {affiliate.affiliate_url.length > 25 ? affiliate.affiliate_url.substring(0, 25) + "..." : affiliate.affiliate_url}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>
                  Currently running advertising campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {campaigns.filter(c => c.status === 'active').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active campaigns</p>
                    <Button className="mt-4" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.filter(c => c.status === 'active').slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{campaign.title}</div>
                          <div className="text-sm text-muted-foreground">{campaign.campaign_type} campaign</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{campaign.priority}/10</div>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Prop Firms</h2>
            <Button
              className="flex items-center gap-2"
              onClick={() => setCreateAffiliateOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Prop Firm
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Trading Prop Firms</h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {affiliates.filter(a => a.provider_type === 'prop_firm').length}
            </Badge>
          </div>

          {affiliates.filter(a => a.provider_type === 'prop_firm').length === 0 ? (
            <Card className="border-dashed border-2 border-blue-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="w-16 h-16 text-blue-200 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No prop firms yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Add trading prop firms to create your Funding Marketplace. Students earn 10 points per click and you'll earn commissions from successful sign-ups.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Prop Firm
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {affiliates.filter(a => a.provider_type === 'prop_firm').map((affiliate) => (
                <Card key={affiliate.id} className="border-blue-100 hover:border-blue-200 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      {affiliate.name}
                      <Badge variant={affiliate.is_active ? "default" : "secondary"} className="text-xs">
                        {affiliate.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{affiliate.provider_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Clicks</div>
                          <div className="font-semibold">{affiliate.click_count}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Conversions</div>
                          <div className="font-semibold">{affiliate.conversion_count}</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-sm text-muted-foreground mb-1">Revenue Generated</div>
                        <div className="text-lg font-semibold text-blue-600">
                          ${affiliate.revenue_generated.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-sm text-muted-foreground mb-1">Funding Challenge Link</div>
                        <a
                          href={affiliate.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                          title={affiliate.affiliate_url}
                        >
                          {affiliate.affiliate_url}
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedAffiliate(affiliate);
                            setEditAffiliateOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedAffiliate(affiliate);
                            setDeleteAffiliateOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Brokers</h2>
            <Button
              className="flex items-center gap-2"
              onClick={() => setCreateAffiliateOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Broker
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-semibold">Trading Brokers</h3>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {affiliates.filter(a => a.provider_type === 'broker').length}
            </Badge>
          </div>

          {affiliates.filter(a => a.provider_type === 'broker').length === 0 ? (
            <Card className="border-dashed border-2 border-green-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-16 h-16 text-green-200 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No brokers yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Add trading brokers to expand your Funding Marketplace. Students benefit from professional trading accounts and you earn commissions from sign-ups.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Broker
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {affiliates.filter(a => a.provider_type === 'broker').map((affiliate) => (
                <Card key={affiliate.id} className="border-green-100 hover:border-green-200 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      {affiliate.name}
                      <Badge variant={affiliate.is_active ? "default" : "secondary"} className="text-xs">
                        {affiliate.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{affiliate.provider_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Clicks</div>
                          <div className="font-semibold">{affiliate.click_count}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Conversions</div>
                          <div className="font-semibold">{affiliate.conversion_count}</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-sm text-muted-foreground mb-1">Revenue Generated</div>
                        <div className="text-lg font-semibold text-green-600">
                          ${affiliate.revenue_generated.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-sm text-muted-foreground mb-1">Trading Account Link</div>
                        <a
                          href={affiliate.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 underline text-sm break-all"
                          title={affiliate.affiliate_url}
                        >
                          {affiliate.affiliate_url}
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedAffiliate(affiliate);
                            setEditAffiliateOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedAffiliate(affiliate);
                            setDeleteAffiliateOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Points & Rewards Tab */}
        <TabsContent value="points" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Points & Rewards</h2>
              <p className="text-muted-foreground">Track your engagement and redeem rewards</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Sparkles className="w-4 h-4 mr-1" />
                Level {userPoints?.level || 1}
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Crown className="w-4 h-4 mr-1" />
                {userPoints?.total_points.toLocaleString() || 0} Points
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <PointsDashboard
                userPoints={userPoints}
                leaderboard={leaderboard}
                recentAchievements={userPoints?.achievements.slice(-3) || []}
                availableRewards={availableRewards}
                onClaimReward={handleClaimReward}
              />
            </TabsContent>
            <TabsContent value="rewards">
              <RewardsStore
                availableRewards={availableRewards}
                userPoints={userPoints?.total_points || 0}
                claimedRewards={claimedRewards}
                onClaimReward={handleClaimReward}
                onRedeemDiscount={(rewardId, code) => {
                  handleClaimReward(rewardId);
                  if (code) {
                    showMessage('success', `Discount code "${code}" applied!`);
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="analytics">
              {analytics && (
                <AnalyticsDashboard
                  analytics={analytics}
                  engagements={socialEngagements}
                  userPoints={userPoints}
                  timeframe={analyticsTimeframe}
                  onTimeframeChange={setAnalyticsTimeframe}
                />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Social Engagement Tab */}
        <TabsContent value="social" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Social Engagement</h2>
              <p className="text-muted-foreground">Connect with me across platforms and earn points</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Flame className="w-4 h-4 mr-1" />
                {userPoints?.streak.current || 0} Day Streak
              </Badge>
            </div>
          </div>

          <SocialEngagementTracker
            engagements={socialEngagements}
            onEngage={handleEngage}
            userPoints={userPoints?.total_points || 0}
          />
        </TabsContent>

        {/* Live Streams Tab */}
        <TabsContent value="live" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Live Streams</h2>
              <p className="text-muted-foreground">Join live sessions and earn points for participation</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Zap className="w-4 h-4 mr-1" />
                {userPoints?.points_breakdown.live_stream_participation || 0} Min Watched
              </Badge>
            </div>
          </div>

          <LiveStreamTracker
            currentSession={liveSessions.find(s => s.status === 'live') || null}
            upcomingSessions={liveSessions.filter(s => s.status === 'scheduled')}
            pastSessions={liveSessions.filter(s => s.status === 'ended')}
            onJoinSession={handleJoinLiveSession}
            onLeaveSession={handleLeaveLiveSession}
            userParticipation={{
              currentSessionId: liveSessions.find(s => s.status === 'live')?.id || null,
              totalMinutes: userPoints?.points_breakdown.live_stream_participation || 0,
              pointsEarned: (userPoints?.points_breakdown.live_stream_participation || 0),
              streak: 5
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog Components */}
      <CreateAffiliateDialog
        isOpen={createAffiliateOpen}
        onClose={() => setCreateAffiliateOpen(false)}
        onSuccess={handleCreateAffiliate}
      />

      <EditAffiliateDialog
        isOpen={editAffiliateOpen}
        affiliate={selectedAffiliate}
        onClose={() => setEditAffiliateOpen(false)}
        onSuccess={handleUpdateAffiliate}
      />

      <DeleteAffiliateDialog
        isOpen={deleteAffiliateOpen}
        affiliate={selectedAffiliate}
        onClose={() => setDeleteAffiliateOpen(false)}
        onConfirm={handleDeleteAffiliate}
      />

      <CreateCampaignDialog
        isOpen={createCampaignOpen}
        affiliates={affiliates}
        onClose={() => setCreateCampaignOpen(false)}
        onSuccess={handleCreateCampaign}
      />

      <EditCampaignDialog
        isOpen={editCampaignOpen}
        campaign={selectedCampaign}
        affiliates={affiliates}
        onClose={() => setEditCampaignOpen(false)}
        onSuccess={handleUpdateCampaign}
      />

      <DeleteCampaignDialog
        isOpen={deleteCampaignOpen}
        campaign={selectedCampaign}
        onClose={() => setDeleteCampaignOpen(false)}
        onConfirm={handleDeleteCampaign}
      />
    </div>
  );
}
