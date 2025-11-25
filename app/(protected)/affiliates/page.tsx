"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, DollarSign, Eye, TrendingUp, Users, Plus, Settings, BarChart3, Trash2, Edit, Target, Award, Star, ExternalLink, CheckCircle } from "lucide-react";
import { MentorAffiliate, AdvertisingCampaign, AffiliateDashboardStats } from "@/lib/types/mentor";
import { CreateAffiliateDialog } from "@/components/affiliates/create-affiliate-dialog";
import { EditAffiliateDialog } from "@/components/affiliates/edit-affiliate-dialog";
import { DeleteAffiliateDialog } from "@/components/affiliates/delete-affiliate-dialog";
import { CreateCampaignDialog } from "@/components/affiliates/create-campaign-dialog";
import { EditCampaignDialog } from "@/components/affiliates/edit-campaign-dialog";
import { DeleteCampaignDialog } from "@/components/affiliates/delete-campaign-dialog";

interface AffiliatesPageProps {}

export default function AffiliatesPage({}: AffiliatesPageProps) {
  const { user } = useAuth();
  const [affiliates, setAffiliates] = useState<MentorAffiliate[]>([]);
  const [campaigns, setCampaigns] = useState<AdvertisingCampaign[]>([]);
  const [stats, setStats] = useState<AffiliateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Earn 10 Points</span> per prop firm click
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-500" />
                <span>Mentor-prepped for success</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified funding partnerships</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-3">
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              onClick={() => setCreateAffiliateOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Prop Firm
            </Button>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="affiliates">Prop Firms</TabsTrigger>
          <TabsTrigger value="campaigns">Brokers</TabsTrigger>
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
