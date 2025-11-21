"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MessageSquare,
  Target
} from "lucide-react";

// Sample data - in a real app this would come from your database/API
const stats = [
  {
    title: "Portfolio Value",
    value: "$127,543.21",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Today's P&L",
    value: "+$1,234.56",
    change: "+2.3%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Active Positions",
    value: "12",
    change: "-2",
    changeType: "negative" as const,
    icon: Target,
  },
  {
    title: "Win Rate",
    value: "68.5%",
    change: "+5.2%",
    changeType: "positive" as const,
    icon: BarChart3,
  },
];

const recentTrades = [
  {
    id: "1",
    symbol: "SPY",
    type: "Buy",
    quantity: 100,
    price: "$478.23",
    status: "Filled",
    time: "2 hours ago",
    pnl: null,
  },
  {
    id: "2",
    symbol: "NVDA",
    type: "Sell",
    quantity: 50,
    price: "$1,234.56",
    status: "Filled",
    time: "4 hours ago",
    pnl: "+$125.00",
  },
  {
    id: "3",
    symbol: "AAPL",
    type: "Buy",
    quantity: 75,
    price: "$192.85",
    status: "Pending",
    time: "6 hours ago",
    pnl: null,
  },
];

const activityFeed = [
  {
    id: "1",
    type: "trade",
    title: "Position opened",
    description: "Bought 100 shares of SPY at $478.23",
    time: "2h ago",
    icon: TrendingUp,
  },
  {
    id: "2",
    type: "alert",
    title: "Price alert triggered",
    description: "NVDA hit your target price of $1,250",
    time: "3h ago",
    icon: AlertCircle,
  },
  {
    id: "3",
    type: "task",
    title: "Task completed",
    description: "Review quarterly trading performance",
    time: "1d ago",
    icon: CheckCircle,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your trading.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Trade
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
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Trades
            </CardTitle>
            <CardDescription>
              Your latest trading activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      trade.status === 'Filled' ? 'bg-green-500' :
                      trade.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <div className="font-medium">{trade.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {trade.type} {trade.quantity} @ {trade.price}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={trade.status === 'Filled' ? 'default' : 'secondary'}>
                      {trade.status}
                    </Badge>
                    {trade.pnl && (
                      <div className="text-xs text-green-600 mt-1">{trade.pnl}</div>
                    )}
                    <div className="text-xs text-muted-foreground">{trade.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                View All Trades
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Activity Feed
            </CardTitle>
            <CardDescription>
              Recent notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                  <activity.icon className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-sm text-muted-foreground">{activity.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used features and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto p-4 flex flex-col items-start space-y-2">
              <Target className="w-5 h-5" />
              <span className="font-medium">New Trade</span>
              <span className="text-xs text-muted-foreground">Enter a position</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
              <span className="text-xs text-muted-foreground">View performance</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">Workspace</span>
              <span className="text-xs text-muted-foreground">Team collaboration</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Schedule</span>
              <span className="text-xs text-muted-foreground">Plan your trades</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
