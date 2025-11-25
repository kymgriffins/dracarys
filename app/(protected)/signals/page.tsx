"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  X,
  Bell,
  BellOff,
  Filter,
  Crown,
  Zap,
  Lock
} from "lucide-react";

interface Signal {
  id: string;
  ticker: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  target: number;
  stoploss: number;
  timeframe: string;
  timestamp: Date;
  confidence: number;
  status: 'active' | 'hit' | 'stopped' | 'expired';
  description: string;
  risk: 'low' | 'medium' | 'high';
  provider: {
    name: string;
    avatar: string;
    rating: number;
    accuracy: number;
  };
  isPremium: boolean;
  performance?: {
    entry: number;
    current: number;
    pnl: number;
    pnlPercent: number;
  };
}

// Mock signals data
const mockSignals: Signal[] = [
  {
    id: "1",
    ticker: "EUR/USD",
    action: "BUY",
    price: 1.0850,
    target: 1.0950,
    stoploss: 1.0780,
    timeframe: "H1",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    confidence: 85,
    status: "active",
    description: "Strong bullish momentum with RSI divergence. Break above resistance at 1.0900 would confirm the move.",
    risk: "medium",
    provider: {
      name: "Alex Rodriguez",
      avatar: "/avatars/alex.jpg",
      rating: 4.8,
      accuracy: 87
    },
    isPremium: true,
    performance: {
      entry: 1.0850,
      current: 1.0885,
      pnl: 35,
      pnlPercent: 3.23
    }
  },
  {
    id: "2",
    ticker: "GBP/JPY",
    action: "SELL",
    price: 158.40,
    target: 156.20,
    stoploss: 159.50,
    timeframe: "H4",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    confidence: 78,
    status: "active",
    description: "Bearish butterfly pattern forming. Momentum indicators show potential reversal from overbought conditions.",
    risk: "high",
    provider: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      rating: 4.9,
      accuracy: 92
    },
    isPremium: true,
    performance: {
      entry: 158.40,
      current: 157.85,
      pnl: 550,
      pnlPercent: 3.47
    }
  },
  {
    id: "3",
    ticker: "USD/CHF",
    action: "BUY",
    price: 0.9230,
    target: 0.9300,
    stoploss: 0.9180,
    timeframe: "D1",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    confidence: 92,
    status: "hit",
    description: "Long-term bullish accumulation pattern with institutional buying volume.",
    risk: "low",
    provider: {
      name: "Marcus Johnson",
      avatar: "/avatars/marcus.jpg",
      rating: 5.0,
      accuracy: 94
    },
    isPremium: true,
    performance: {
      entry: 0.9230,
      current: 0.9275,
      pnl: 450,
      pnlPercent: 4.88
    }
  }
];

export default function SignalsPage() {
  const [signals, setSignals] = useState(mockSignals);
  const [filter, setFilter] = useState<"all" | "active" | "premium">("all");
  const [notifications, setNotifications] = useState(true);

  const filteredSignals = signals.filter(signal => {
    if (filter === "active") return signal.status === "active";
    if (filter === "premium") return signal.isPremium;
    return true;
  });

  const getActionColor = (action: Signal["action"]) => {
    switch (action) {
      case "BUY": return "text-success-foreground bg-success";
      case "SELL": return "text-destructive bg-destructive/10";
      case "HOLD": return "text-info-foreground bg-info";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getRiskColor = (risk: Signal["risk"]) => {
    switch (risk) {
      case "low": return "text-success-foreground bg-success/10";
      case "medium": return "text-warning-foreground bg-warning";
      case "high": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-secondary";
    }
  };

  const getStatusIcon = (status: Signal["status"]) => {
    switch (status) {
      case "active": return <Clock className="w-4 h-4 text-info" />;
      case "hit": return <CheckCircle className="w-4 h-4 text-success" />;
      case "stopped": return <X className="w-4 h-4 text-destructive" />;
      case "expired": return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Trading Signals</h1>
            <p className="text-muted-foreground">
              Professional trading signals with real-time analysis and performance tracking
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={toggleNotifications}
              className={notifications ? "bg-secondary border-secondary-foreground/20" : ""}
            >
              {notifications ? (
                <Bell className="w-4 h-4 mr-2" />
              ) : (
                <BellOff className="w-4 h-4 mr-2" />
              )}
              {notifications ? "Notifications ON" : "Notifications OFF"}
            </Button>

            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <Crown className="w-3 h-3 mr-1" />
              Pro Feature
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Signals</p>
                  <p className="text-2xl font-bold">{signals.filter(s => s.status === 'active').length}</p>
                </div>
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">89%</p>
                </div>
                <Target className="w-8 h-8 text-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                  <p className="text-2xl font-bold text-foreground">+$2,450</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={filter === "all" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Signals
          </Button>
          <Button
            variant={filter === "active" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active Only
          </Button>
          <Button
            variant={filter === "premium" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter("premium")}
          >
            <Crown className="w-3 h-3 mr-1" />
            Premium Only
          </Button>
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSignals.map((signal) => (
            <Card key={signal.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getActionColor(signal.action)}>
                      {signal.action}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground">{signal.ticker}</h3>
                    <Badge variant="outline">{signal.timeframe}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(signal.status)}
                    <span className="text-sm font-medium capitalize text-muted-foreground">
                      {signal.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(signal.timestamp)}
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {signal.confidence}% confidence
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price Levels */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Entry</p>
                    <p className="text-lg font-bold text-foreground">{signal.price}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="text-lg font-bold text-success">{signal.target}</p>
                    <p className="text-xs text-primary">
                      +{((signal.target - signal.price) / signal.price * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Stop Loss</p>
                    <p className="text-lg font-bold text-destructive">{signal.stoploss}</p>
                    <p className="text-xs text-muted-foreground">
                      -{Math.abs((signal.stoploss - signal.price) / signal.price * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {signal.description}
                </p>

                {/* Signal Provider */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={signal.provider.avatar} />
                      <AvatarFallback>{signal.provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{signal.provider.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>⭐ {signal.provider.rating}</span>
                        <span>{signal.provider.accuracy}% accuracy</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(signal.risk)}>
                      {signal.risk} risk
                    </Badge>

                    {signal.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Crown className="w-3 h-3 mr-1" />
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Performance (if available) */}
                {signal.performance && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground">
                      Current: <span className="font-medium text-foreground">{signal.performance.current}</span>
                    </div>
                    <div className={`text-sm font-bold ${
                      signal.performance.pnl >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {signal.performance.pnl >= 0 ? '+' : ''}${signal.performance.pnl}
                      ({signal.performance.pnlPercent >= 0 ? '+' : ''}{signal.performance.pnlPercent}%)
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {!signal.isPremium && (
                    <Button variant="outline" size="sm" className="flex-1">
                      Copy Signal
                    </Button>
                  )}
                  {signal.isPremium && (
                    <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                      <Crown className="w-4 h-4 mr-2" />
                      Unlock Premium Signal
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No signals found</h3>
            <p className="text-muted-foreground">
              {filter === "active"
                ? "No active signals at the moment. Check back later!"
                : "No signals match your current filters."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
