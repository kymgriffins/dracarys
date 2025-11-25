"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Clock,
  BarChart3
} from "lucide-react";
import { JawGnarlEntry } from "@/lib/types/jawgnarl";

export default function JawGnarlEntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [entry, setEntry] = useState<JawGnarlEntry | null>(null);

  useEffect(() => {
    // Load entry from localStorage
    const savedEntries = JSON.parse(localStorage.getItem('jawgnarl_entries') || '[]');
    const foundEntry = savedEntries.find((e: JawGnarlEntry) => e.id === params.id);
    if (foundEntry) {
      setEntry(foundEntry);
    } else {
      // Entry not found, redirect back
      router.push('/jawgnarl');
    }
  }, [params.id, router]);

  if (!entry) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading journal entry...</p>
        </div>
      </div>
    );
  }

  const getMoodColor = (mood?: any) => {
    if (!mood) return 'bg-gray-500/10 text-gray-600';
    const moodLabel = mood.label.toLowerCase();
    switch (moodLabel) {
      case 'frustrated': return 'bg-muted/10 text-muted-foreground';
      case 'annoyed': return 'bg-muted/10 text-muted-foreground';
      case 'neutral': return 'bg-primary/10 text-primary';
      case 'optimistic': return 'bg-accent/10 text-accent-foreground';
      case 'euphoric': return 'bg-secondary/10 text-secondary-foreground';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getTradeDriverLabel = (value: string) => {
    const drivers: { [key: string]: string } = {
      'great_setup': 'Great Setup',
      'patience': 'Patience',
      'luck': 'Luck',
      'revenge': 'Revenge',
      'fomo': 'FOMO'
    };
    return drivers[value] || value;
  };

  const getExecutionQualityLabel = (value: string) => {
    const qualities: { [key: string]: string } = {
      'flawless': 'Flawless',
      'rushed': 'Rushed',
      'hesitant': 'Hesitant',
      'panicked': 'Panicked'
    };
    return qualities[value] || value;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.push('/jawgnarl')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journal
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal Entry</h1>
          <p className="text-muted-foreground">{entry.date}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Trading Stats Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-foreground" />
              Trading Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${entry.tradingStats.pnl >= 0 ? 'text-secondary-foreground' : 'text-muted-foreground'}`}>
                  {entry.tradingStats.pnl >= 0 ? '+' : ''}{entry.tradingStats.pnl.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">P&L</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{entry.tradingStats.winRate}%</div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{entry.tradingStats.totalTrades}</div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
              </div>
              <div className="text-center">
                <div className={`px-3 py-1 rounded-full text-sm ${entry.mood ? getMoodColor(entry.mood) : 'bg-gray-100'}`}>
                  {entry.mood?.emoji} {entry.mood?.label || 'Neutral'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Mood</p>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Most Traded:</span>
                <span className="font-medium">{entry.tradingStats.mostTradedInstrument}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session Time:</span>
                <span className="font-medium">{entry.tradingStats.sessionStartTime} - {entry.tradingStats.sessionEndTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Winning Trades:</span>
                <span className="font-medium text-secondary-foreground">{entry.tradingStats.winningTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Losing Trades:</span>
                <span className="font-medium text-muted-foreground">{entry.tradingStats.losingTrades}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Market Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Market Character</h4>
                <p className="text-sm text-muted-foreground">{entry.marketData.marketCharacter}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sentiment</h4>
                <Badge variant={entry.marketData.sentiment === 'bullish' ? 'default' : entry.marketData.sentiment === 'bearish' ? 'destructive' : 'secondary'}>
                  {entry.marketData.sentiment}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Today's Headlines</h4>
              <div className="space-y-2">
                {entry.marketData.headlines.map((headline, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg border-l-4 border-primary text-sm">
                    {headline}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Sector Performance</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {entry.marketData.sectorPerformance.map((sector, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                    <span>{sector.name}</span>
                    <span className={sector.change >= 0 ? 'text-secondary-foreground' : 'text-muted-foreground'}>
                      {sector.change >= 0 ? '+' : ''}{sector.change}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reflection */}
        {entry.reflection && (
          <Card>
            <CardHeader>
              <CardTitle>Reflection & Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Defining Moment */}
              <div>
                <h4 className="font-medium mb-2">What defined your trading today?</h4>
                <p className="text-muted-foreground italic">"{entry.reflection.definingMoment}"</p>
              </div>

              <div className="border-t"></div>

              {/* Best Trade */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-secondary-foreground" />
                  Best Trade
                </h4>
                <Card className="border-secondary bg-secondary/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">{entry.reflection.bestTrade.instrument}</p>
                        <p className="text-2xl font-bold text-secondary-foreground">
                          +${entry.reflection.bestTrade.pnl}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Driver: </span>
                          <Badge variant="outline">{getTradeDriverLabel(entry.reflection.bestTrade.setup)}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Execution: </span>
                          <Badge variant="outline">{getExecutionQualityLabel(entry.reflection.bestTrade.execution)}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Toughest Trade */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-muted-foreground" />
                  Toughest Trade
                </h4>
                <Card className="border-muted bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">{entry.reflection.toughestTrade.instrument}</p>
                        <p className="text-2xl font-bold text-muted-foreground">
                          ${entry.reflection.toughestTrade.pnl}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Driver: </span>
                          <Badge variant="outline">{getTradeDriverLabel(entry.reflection.toughestTrade.setup)}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Execution: </span>
                          <Badge variant="outline">{getExecutionQualityLabel(entry.reflection.toughestTrade.execution)}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Check-ins */}
              <div>
                <h4 className="font-medium mb-3">Trading Discipline Check</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg border ${entry.reflection.planFollowed ? 'border-secondary bg-secondary' : 'border-muted bg-muted'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${entry.reflection.planFollowed ? 'bg-secondary' : 'bg-muted'}`}></div>
                      <span className="text-sm font-medium">Followed Plan</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${entry.reflection.riskManaged ? 'border-secondary bg-secondary' : 'border-muted bg-muted'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${entry.reflection.riskManaged ? 'bg-secondary' : 'bg-muted'}`}></div>
                      <span className="text-sm font-medium">Risk Managed</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${entry.reflection.learnedSomething ? 'border-secondary bg-secondary' : 'border-muted bg-muted'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${entry.reflection.learnedSomething ? 'bg-secondary' : 'bg-muted'}`}></div>
                      <span className="text-sm font-medium">Learned Something</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        {entry.insights && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  <strong>Pattern Spotted:</strong> {entry.insights.pattern}
                </AlertDescription>
              </Alert>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  <strong>Emotional Insight:</strong> {entry.insights.emotionalInsight}
                </AlertDescription>
              </Alert>

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  <strong>Growth Opportunity:</strong> {entry.insights.growthOpportunity}
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                <blockquote className="italic text-center text-lg">
                  "{entry.insights.quote.text}"
                </blockquote>
                <cite className="block text-right text-sm text-muted-foreground mt-2">
                  — {entry.insights.quote.author}
                </cite>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Session Goals */}
        {entry.insights?.nextSessionGoals && entry.insights.nextSessionGoals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary-foreground" />
                Next Session Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entry.insights.nextSessionGoals.map((goal, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{goal}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Intention */}
        {entry.finalIntention && (
          <Card>
            <CardHeader>
              <CardTitle>Tomorrow's Intention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic text-center text-primary font-medium">
                "{entry.finalIntention}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
