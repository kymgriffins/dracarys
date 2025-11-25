"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, DollarSign, Eye, TrendingUp, Target, Plus, ExternalLink, CheckCircle, Award, Star, Zap, Crown, Flame } from "lucide-react";
import { MentorAffiliate } from "@/lib/types/mentor";
import { CreateAffiliateDialog } from "@/components/affiliates/create-affiliate-dialog";
import { EditAffiliateDialog } from "@/components/affiliates/edit-affiliate-dialog";
import { DeleteAffiliateDialog } from "@/components/affiliates/delete-affiliate-dialog";
import { RealTimeNotifications } from "@/components/affiliates/real-time-notifications";

interface PropsPageProps {}

// Popular prop firm logos and data
const propFirmLogos = {
  "FTMO": true,
  "MyForexFunds": true,
  "The5ers": true,
  "TrueForexFunds": true,
  "FundingPips": false,
  "City Traders Imperium": false,
  "Aquanox": false,
  "E8 Funding": false,
  "Leveled Up Society": false,
  "SurgeTrader": false
};

// Mock prop firm data for demonstration
const mockPropFirms: MentorAffiliate[] = [
  {
    id: "ftmo-1",
    mentor_id: "mentor-1",
    name: "FTMO Challenge",
    provider_type: "prop_firm",
    provider_name: "FTMO",
    affiliate_url: "https://ftmo.com/en/trading-challenge",
    commission_rate: 8,
    description: "Industry-leading prop trading firm with $400K funding options",
    is_active: true,
    click_count: 247,
    conversion_count: 23,
    revenue_generated: 1840.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-01-15").toISOString(),
    updated_at: new Date().toISOString()
  } as MentorAffiliate & { discount?: { percentage: number; code: string } },
  {
    id: "mff-1",
    mentor_id: "mentor-1",
    name: "MyForexFunds Evaluation",
    provider_type: "prop_firm",
    provider_name: "MyForexFunds",
    affiliate_url: "https://myforexfunds.com/en/trading-challenge",
    commission_rate: 10,
    description: "Flexible evaluation accounts with scaling options up to $2M",
    is_active: true,
    click_count: 189,
    conversion_count: 18,
    revenue_generated: 2250.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-02-01").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "the5ers-1",
    mentor_id: "mentor-1",
    name: "The5ers Trader",
    provider_type: "prop_firm",
    provider_name: "The5ers",
    affiliate_url: "https://the5ers.com/trading-challenge",
    commission_rate: 12,
    description: "Premium prop firm with instant funding and low spreads",
    is_active: true,
    click_count: 156,
    conversion_count: 15,
    revenue_generated: 2700.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-02-15").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "truefx-1",
    mentor_id: "mentor-1",
    name: "True Forex Funds",
    provider_type: "prop_firm",
    provider_name: "TrueForexFunds",
    affiliate_url: "https://trueforexfunds.com/trading-challenge",
    commission_rate: 9,
    description: "Reliable prop firm with competitive trading conditions",
    is_active: true,
    click_count: 134,
    conversion_count: 12,
    revenue_generated: 1620.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-03-01").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "fp-1",
    mentor_id: "mentor-1",
    name: "Funding Pips",
    provider_type: "prop_firm",
    provider_name: "FundingPips",
    affiliate_url: "https://fundingpips.com/trading-challenge",
    commission_rate: 11,
    description: "Fast-growing prop firm with excellent payout terms",
    is_active: true,
    click_count: 98,
    conversion_count: 9,
    revenue_generated: 1188.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-03-15").toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "cti-1",
    mentor_id: "mentor-1",
    name: "City Traders Imperium",
    provider_type: "prop_firm",
    provider_name: "City Traders Imperium",
    affiliate_url: "https://citytradersimperium.com/trading-challenge",
    commission_rate: 7,
    description: "Established prop firm with multiple account sizes",
    is_active: true,
    click_count: 87,
    conversion_count: 8,
    revenue_generated: 672.00,
    last_clicked_at: new Date().toISOString(),
    created_at: new Date("2024-04-01").toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function PropsPage({}: PropsPageProps) {
  const { user } = useAuth();
  const [propFirms, setPropFirms] = useState<MentorAffiliate[]>([]);
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
        showMessage('error', 'Failed to load prop firm data. Please refresh the page.');
      }

      // Filter only prop firms
      const propFirmData = affiliatesData.filter(aff => aff.provider_type === 'prop_firm');

      // If no real data, show mock data for demonstration
      if (propFirmData.length === 0) {
        setPropFirms(mockPropFirms);
      } else {
        setPropFirms(propFirmData);
      }

    } catch (error) {
      console.error('Error fetching prop firm data:', error);
      showMessage('error', 'Failed to load data. Please check your connection and try again.');
    }
  };

  // Affiliate handlers
  const handleCreateAffiliate = async (newAffiliate: MentorAffiliate) => {
    if (newAffiliate.provider_type === 'prop_firm') {
      setPropFirms(prev => [newAffiliate, ...prev]);
    }
    await refreshData();
    showMessage('success', 'Prop firm added successfully!');
  };

  const handleUpdateAffiliate = async (updatedAffiliate: MentorAffiliate) => {
    setPropFirms(prev => prev.map(aff =>
      aff.id === updatedAffiliate.id ? updatedAffiliate : aff
    ));
    await refreshData();
    showMessage('success', 'Prop firm updated successfully!');
  };

  const handleDeleteAffiliate = async (affiliateToDelete: MentorAffiliate) => {
    try {
      const response = await fetch(`/api/affiliates/${affiliateToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete prop firm');
      }

      setPropFirms(prev => prev.filter(aff => aff.id !== affiliateToDelete.id));
      await refreshData();
      showMessage('success', 'Prop firm deleted successfully!');
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to delete prop firm');
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

        // Filter only prop firms
        const propFirmData = affiliatesData.filter(aff => aff.provider_type === 'prop_firm');

        // If no real data, show mock data for demonstration
        if (propFirmData.length === 0) {
          setPropFirms(mockPropFirms);
        } else {
          setPropFirms(propFirmData);
        }

      } catch (error) {
        console.error('Error fetching prop firm data:', error);
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

  const totalRevenue = propFirms.reduce((sum, firm) => sum + Number(firm.revenue_generated), 0);
  const totalClicks = propFirms.reduce((sum, firm) => sum + firm.click_count, 0);
  const totalConversions = propFirms.reduce((sum, firm) => sum + firm.conversion_count, 0);

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
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 rounded-lg p-8 mb-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Prop Firms Marketplace
              </h1>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              Get funded by top proprietary trading firms. Pass their evaluation challenges and trade with their capital.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Earn 10 Points</span> per prop firm click
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Vetted prop firms only</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-500" />
                <span>Real funding opportunities</span>
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
                  <span>{liveStats.liveStreamsActive} live challenge{liveStats.liveStreamsActive !== 1 ? 's' : ''}</span>
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
            <CardTitle className="text-sm font-medium">Prop Firms</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propFirms.length}</div>
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
              Challenge links clicked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Traders funded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prop Firms Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Trading Prop Firms</h2>
          <Button
            className="flex items-center gap-2"
            onClick={() => setCreateAffiliateOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Prop Firm
          </Button>
        </div>

        {propFirms.length === 0 ? (
          <Card className="border-dashed border-2 border-blue-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="w-16 h-16 text-blue-200 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No prop firms yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Add trading prop firms to create your Funding Marketplace. Students earn 10 points per click and you'll earn commissions from successful funding.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Prop Firm
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propFirms.map((firm) => (
                <Card key={firm.id} className="border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center overflow-hidden">
                        {propFirmLogos[firm.provider_name as keyof typeof propFirmLogos] ? (
                          <img
                            src={`/logos/${firm.provider_name.replace(/\s+/g, '-').toLowerCase()}-logo.svg`}
                            alt={`${firm.provider_name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fallback to icon if logo fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
                            }}
                          />
                        ) : (
                          <Target className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {firm.name}
                          <Badge variant={firm.is_active ? "default" : "secondary"} className="text-xs">
                            {firm.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="font-medium text-blue-600">
                          {firm.provider_name}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  {firm.description && (
                    <p className="text-sm text-muted-foreground mt-2">{firm.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Clicks</div>
                        <div className="font-semibold text-lg">{firm.click_count}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Funded</div>
                        <div className="font-semibold text-lg text-green-600">{firm.conversion_count}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground mb-1">Revenue Generated</div>
                      <div className="text-xl font-bold text-blue-600">
                        ${firm.revenue_generated.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      {firm.commission_rate && (
                        <div className="text-xs text-muted-foreground">
                          {firm.commission_rate}% commission rate
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground mb-2">Funding Challenge Link</div>
                      <a
                        href={firm.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm break-all inline-flex items-center gap-1"
                        title={firm.affiliate_url}
                      >
                        Start Challenge
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAffiliate(firm);
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
                          setSelectedAffiliate(firm);
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
