"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, DollarSign, Eye, TrendingUp, Users, Plus, ExternalLink, CheckCircle, Award, Star, Zap, Crown, Flame } from "lucide-react";
import { MentorAffiliate } from "@/lib/types/mentor";
import { CreateAffiliateDialog } from "@/components/affiliates/create-affiliate-dialog";
import { EditAffiliateDialog } from "@/components/affiliates/edit-affiliate-dialog";
import { DeleteAffiliateDialog } from "@/components/affiliates/delete-affiliate-dialog";
import { RealTimeNotifications } from "@/components/affiliates/real-time-notifications";

interface BrokersPageProps {}

// Popular broker logos and data
const brokerLogos = {
  "IC Markets": true,
  "Pepperstone": true,
  "OANDA": true,
  "Interactive Brokers": false,
  "IG Markets": false,
  "CMC Markets": false,
  "XM": false,
  "FXTM": false,
  "AvaTrade": false,
  "Plus500": false
};

// Mock broker data for demonstration
const mockBrokers: MentorAffiliate[] = [
  {
    id: "icmarkets-1",
    mentor_id: "mentor-1",
    name: "IC Markets Pro Account",
    provider_type: "broker",
    provider_name: "IC Markets",
    affiliate_url: "https://www.icmarkets.com/en/open-trading-account",
    commission_rate: 15,
    description: "ECN broker with tight spreads and fast execution",
    is_active: true,
    click_count: 345,
    conversion_count: 28,
    revenue_generated: 4200.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-01-15").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "pepperstone-1",
    mentor_id: "mentor-1",
    name: "Pepperstone Razor Account",
    provider_type: "broker",
    provider_name: "Pepperstone",
    affiliate_url: "https://pepperstone.com/en/open-account",
    commission_rate: 12,
    description: "Award-winning broker with competitive spreads",
    is_active: true,
    click_count: 298,
    conversion_count: 24,
    revenue_generated: 3456.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-02-01").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "oanda-1",
    mentor_id: "mentor-1",
    name: "OANDA fxTrade",
    provider_type: "broker",
    provider_name: "OANDA",
    affiliate_url: "https://www.oanda.com/us-en/trading/",
    commission_rate: 10,
    description: "Trusted forex and CFD broker since 1996",
    is_active: true,
    click_count: 267,
    conversion_count: 21,
    revenue_generated: 2520.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-02-15").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "ib-1",
    mentor_id: "mentor-1",
    name: "Interactive Brokers Pro",
    provider_type: "broker",
    provider_name: "Interactive Brokers",
    affiliate_url: "https://www.interactivebrokers.com/en/home.php",
    commission_rate: 8,
    description: "Professional trading platform with global markets access",
    is_active: true,
    click_count: 189,
    conversion_count: 16,
    revenue_generated: 1824.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-03-01").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "ig-1",
    mentor_id: "mentor-1",
    name: "IG Markets Pro",
    provider_type: "broker",
    provider_name: "IG Markets",
    affiliate_url: "https://www.ig.com/en/trading-platforms",
    commission_rate: 14,
    description: "Leading CFD and spread betting provider",
    is_active: true,
    click_count: 156,
    conversion_count: 13,
    revenue_generated: 2184.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-03-15").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "cmc-1",
    mentor_id: "mentor-1",
    name: "CMC Markets Next Generation",
    provider_type: "broker",
    provider_name: "CMC Markets",
    affiliate_url: "https://www.cmcmarkets.com/en/open-account",
    commission_rate: 11,
    description: "Advanced trading platform with professional tools",
    is_active: true,
    click_count: 134,
    conversion_count: 11,
    revenue_generated: 1454.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-04-01").toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function BrokersPage({}: BrokersPageProps) {
  const { user } = useAuth();
  const [brokers, setBrokers] = useState<MentorAffiliate[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Success/error messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper functions
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const refreshData = async () => {
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
        showMessage('error', 'Failed to load broker data. Please refresh the page.');
      }

      // Filter only brokers
      const brokerData = affiliatesData.filter(aff => aff.provider_type === 'broker');

      // If no real data, show mock data for demonstration
      if (brokerData.length === 0) {
        setBrokers(mockBrokers);
      } else {
        setBrokers(brokerData);
      }

    } catch (error) {
      console.error('Error fetching broker data:', error);
      showMessage('error', 'Failed to load data. Please check your connection and try again.');
    }
  };

  // Affiliate handlers
  const handleCreateAffiliate = async (newAffiliate: MentorAffiliate) => {
    if (newAffiliate.provider_type === 'broker') {
      setBrokers(prev => [newAffiliate, ...prev]);
    }
    await refreshData();
    showMessage('success', 'Broker added successfully!');
  };

  const handleUpdateAffiliate = async (updatedAffiliate: MentorAffiliate) => {
    setBrokers(prev => prev.map(aff =>
      aff.id === updatedAffiliate.id ? updatedAffiliate : aff
    ));
    await refreshData();
    showMessage('success', 'Broker updated successfully!');
  };

  const handleDeleteAffiliate = async (affiliateToDelete: MentorAffiliate) => {
    try {
      const response = await fetch(`/api/affiliates/${affiliateToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete broker');
      }

      setBrokers(prev => prev.filter(aff => aff.id !== affiliateToDelete.id));
      await refreshData();
      showMessage('success', 'Broker deleted successfully!');
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to delete broker');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real affiliates data
        const affiliatesResponse = await fetch('/api/affiliates');
        let affiliatesData: MentorAffiliate[] = [];

        if (affiliatesResponse.ok) {
          const data = await affiliatesResponse.json();
          affiliatesData = data.affiliates || [];
        }

        // Filter only brokers
        const brokerData = affiliatesData.filter(aff => aff.provider_type === 'broker');

        // If no real data, show mock data for demonstration
        if (brokerData.length === 0) {
          setBrokers(mockBrokers);
        } else {
          setBrokers(brokerData);
        }

      } catch (error) {
        console.error('Error fetching broker data:', error);
        showMessage('error', 'Failed to load data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

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

  const totalRevenue = brokers.reduce((sum, broker) => sum + Number(broker.revenue_generated), 0);
  const totalClicks = brokers.reduce((sum, broker) => sum + broker.click_count, 0);
  const totalConversions = brokers.reduce((sum, broker) => sum + broker.conversion_count, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success/Error Messages */}
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-lg p-8 mb-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-green-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Brokers Marketplace
              </h1>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              Professional trading accounts from regulated brokers. Access global markets with competitive spreads and advanced platforms.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Earn 10 Points</span> per broker click
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Regulated brokers only</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-500" />
                <span>Professional trading accounts</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-3">
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => setCreateAffiliateOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Broker
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
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>{liveStats.activeUsers} traders online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>{liveStats.pointsEarnedToday} points earned today</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>{liveStats.liveStreamsActive} live session{liveStats.liveStreamsActive !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Flame className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trading Brokers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brokers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active partnerships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              From commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Account links clicked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Openings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              New trading accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brokers Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Professional Trading Brokers</h2>
          <Button
            className="flex items-center gap-2"
            onClick={() => setCreateAffiliateOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Broker
          </Button>
        </div>

        {brokers.length === 0 ? (
          <Card className="border-dashed border-2 border-green-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-green-200 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No brokers yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Add trading brokers to expand your Funding Marketplace. Students get access to professional trading accounts and you earn commissions from account openings.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Broker
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker) => (
                <Card key={broker.id} className="border-green-100 hover:border-green-200 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center overflow-hidden">
                        {brokerLogos[broker.provider_name as keyof typeof brokerLogos] ? (
                          <img
                            src={`/logos/${broker.provider_name.replace(/\s+/g, '-').toLowerCase()}-logo.svg`}
                            alt={`${broker.provider_name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fallback to icon if logo fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
                            }}
                          />
                        ) : (
                          <Users className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {broker.name}
                          <Badge variant={broker.is_active ? "default" : "secondary"} className="text-xs">
                            {broker.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="font-medium text-green-600">
                          {broker.provider_name}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  {broker.description && (
                    <p className="text-sm text-muted-foreground mt-2">{broker.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Clicks</div>
                        <div className="font-semibold text-lg">{broker.click_count}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Accounts</div>
                        <div className="font-semibold text-lg text-green-600">{broker.conversion_count}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground mb-1">Revenue Generated</div>
                      <div className="text-xl font-bold text-green-600">
                        ${broker.revenue_generated.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      {broker.commission_rate && (
                        <div className="text-xs text-muted-foreground">
                          {broker.commission_rate}% commission rate
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground mb-2">Trading Account Link</div>
                      <a
                        href={broker.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 underline text-sm break-all inline-flex items-center gap-1"
                        title={broker.affiliate_url}
                      >
                        Open Account
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAffiliate(broker);
                          setEditAffiliateOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAffiliate(broker);
                          setDeleteAffiliateOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}
