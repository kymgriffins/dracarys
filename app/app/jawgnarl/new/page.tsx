"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Clock, Calendar, ArrowRight, CheckCircle, Zap, Target } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { JawGnarlEntry, MoodScale, JournalReflection, AIInsights } from "@/lib/types/jawgnarl";
import { useRouter } from "next/navigation";

export default function NewJawGnarlEntry() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [entry, setEntry] = useState<Partial<JawGnarlEntry>>({
    id: Date.now().toString(),
    date: new Date().toLocaleDateString(),
    stage: 1,
    completed: false,
    tradingStats: {
      pnl: 1250.75,
      winRate: 75,
      largestDrawdown: -3.2,
      totalTrades: 16,
      winningTrades: 12,
      losingTrades: 4,
      mostTradedInstrument: "EUR/USD",
      sessionStartTime: "9:30 AM",
      sessionEndTime: "2:00 PM"
    },
    marketData: {
      headlines: [
        "Fed Holds Rates Steady, USD Strengthens",
        "Apple Reports Strong Q4 Earnings",
        "Oil Prices Surge on Supply Concerns"
      ],
      marketCharacter: "Trending Bullish - Nasdaq",
      volatility: "medium",
      sentiment: "bullish",
      sectorPerformance: [
        { name: "Technology", change: 2.3 },
        { name: "Financials", change: -1.2 },
        { name: "Energy", change: 1.8 }
      ]
    }
  });



  const updateEntry = (updates: Partial<JawGnarlEntry>) => {
    setEntry(prev => ({ ...prev, ...updates }));
  };

  const nextStage = () => {
    if (currentStage < 3) {
      setCurrentStage((currentStage + 1) as 1 | 2 | 3);
      updateEntry({ stage: (currentStage + 1) as 1 | 2 | 3 });
    }
  };

  const completeJournal = () => {
    updateEntry({ completed: true });
    // Save to local storage or API (for demo purposes, we'll use localStorage)
    const savedEntries = JSON.parse(localStorage.getItem('jawgnarl_entries') || '[]');
    savedEntries.unshift({
      ...entry,
      completed: true,
      finalIntention: entry.insights?.nextSessionGoals?.[0] || "Stay disciplined"
    });
    localStorage.setItem('jawgnarl_entries', JSON.stringify(savedEntries.slice(0, 10))); // Keep last 10
    router.push('/app/jawgnarl');
  };

  // Auto-generate insights on stage 3
  useEffect(() => {
    if (currentStage === 3 && !entry.insights) {
      const mood = entry.mood?.label.toLowerCase() || 'neutral';
      const pnl = entry.tradingStats?.pnl || 0;

      const insights: AIInsights = {
        pattern: pnl > 0
          ? "You're performing well in trending markets but tend to overtrade during range periods."
          : "Frustrated days correlate with excessive trading. Consider implementing a '2-loss rule' break system.",
        emotionalInsight: mood === 'frustrated'
          ? `Your ${mood} mood days show a 40% higher loss rate. Consider taking a 15-minute break after 2 consecutive losses.`
          : mood === 'euphoric'
          ? "High energy days boost performance by 25%. Channel this into maintaining your winning streak."
          : "Consistent neutral moods correlate with steady, profitable trading across 65% of sessions.",
        growthOpportunity: `Your win rate on ${entry.tradingStats?.mostTradedInstrument} is ${entry.tradingStats?.winRate || 70}%, consider allocating more capital there.`,
        quote: pnl > 0
          ? {
              text: "The essence of investment management is the management of risks, not returns.",
              author: "Benjamin Graham"
            }
          : {
              text: "The most important quality for an investor is temperament, not intellect.",
              author: "Warren Buffett"
            },
        nextSessionGoals: [
          pnl > 0
            ? "Wait for my high-probability setup without forcing trades"
            : "Strictly risk only 1% per trade and stop after 2 consecutive losses",
          "Maintain composure regardless of P&L",
          "Focus on consistency over quick profits"
        ]
      };

      updateEntry({ insights });
    }
  }, [currentStage, entry.insights, entry.mood, entry.tradingStats]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Journal Entry for {entry.date}</h1>
        <p className="text-muted-foreground mt-2">3-minute post-trade ritual</p>

        {/* Stage Progress */}
        <div className="flex items-center justify-center mt-6 space-x-4">
          {[1, 2, 3].map((stage) => (
            <div key={stage} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStage >= stage ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {currentStage > stage ? <CheckCircle className="w-4 h-4" /> : stage}
              </div>
              {stage < 3 && <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      {/* Stage 1: Autopilot Snapshot */}
      {currentStage === 1 && <Stage1 data={entry} onUpdate={updateEntry} onComplete={nextStage} />}

      {/* Stage 2: Guided Reflection */}
      {currentStage === 2 && <Stage2 data={entry} onUpdate={updateEntry} onComplete={nextStage} />}

      {/* Stage 3: AI Insights & Forward Look */}
      {currentStage === 3 && <Stage3 data={entry} onUpdate={updateEntry} onComplete={completeJournal} />}
    </div>
  );
}

// Stage 1 Component
function Stage1({ data, onUpdate, onComplete }: { data: Partial<JawGnarlEntry>; onUpdate: any; onComplete: () => void }) {
  const currentMood = data.mood || { value: 50, label: 'Neutral' as const, emoji: '😐' };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Stage 1: The Autopilot Snapshot</h2>
        <p className="text-muted-foreground">"Wow, it already knows everything."</p>
      </div>

      {/* Trade of the Day Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Trade of the Day
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${data.tradingStats!.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.tradingStats!.pnl >= 0 ? '+' : ''}{data.tradingStats!.pnl.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Today's P&L</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{data.tradingStats!.winRate}%</div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{data.tradingStats!.mostTradedInstrument}</div>
              <p className="text-sm text-muted-foreground">Most Traded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Headlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Market Headlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.marketData!.headlines.map((headline, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg border-l-4 border-primary">
                {headline}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="font-medium">Market Character: <span className="font-bold">{data.marketData!.marketCharacter}</span></p>
          </div>
          <div className="mt-2 p-3 bg-muted rounded-lg">
            <p className="text-sm">Session: {data.tradingStats!.sessionStartTime} - {data.tradingStats!.sessionEndTime}</p>
          </div>
        </CardContent>
      </Card>

      {/* Mood Selection */}
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling right now?</CardTitle>
          <p className="text-sm text-muted-foreground">Select your current emotional state to help analyze your trading performance.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { value: 10, label: 'Frustrated' as const, emoji: '😞', color: 'bg-red-500/10 border-red-200 text-red-700 hover:bg-red-500/20' },
              { value: 30, label: 'Annoyed' as const, emoji: '😠', color: 'bg-orange-500/10 border-orange-200 text-orange-700 hover:bg-orange-500/20' },
              { value: 50, label: 'Neutral' as const, emoji: '😐', color: 'bg-blue-500/10 border-blue-200 text-blue-700 hover:bg-blue-500/20' },
              { value: 70, label: 'Optimistic' as const, emoji: '😊', color: 'bg-yellow-500/10 border-yellow-200 text-yellow-700 hover:bg-yellow-500/20' },
              { value: 90, label: 'Euphoric' as const, emoji: '🎉', color: 'bg-green-500/10 border-green-200 text-green-700 hover:bg-green-500/20' },
            ].map((moodOption) => (
              <button
                key={moodOption.value}
                onClick={() => onUpdate({ mood: moodOption })}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                  currentMood.label === moodOption.label
                    ? `${moodOption.color} border-current shadow-md`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{moodOption.emoji}</div>
                <div className="font-medium">{moodOption.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onComplete} size="lg" className="gap-2">
          Refine the Story <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Stage 2 Component
function Stage2({ data, onUpdate, onComplete }: { data: Partial<JawGnarlEntry>; onUpdate: any; onComplete: () => void }) {
  const [reflection, setReflection] = useState<JournalReflection>({
    definingMoment: "",
    bestTrade: {
      id: "btc-001",
      pnl: 450.50,
      instrument: "BTC/USD",
      setup: "great_setup",
      execution: "flawless"
    },
    toughestTrade: {
      id: "eur-002",
      pnl: -280.25,
      instrument: "EUR/USD",
      setup: "revenge",
      execution: "rushed"
    },
    planFollowed: false,
    riskManaged: false,
    learnedSomething: false
  });

  const handleChange = (field: string, value: any) => {
    const updated = { ...reflection, [field]: value };
    setReflection(updated);
    if (field === 'definingMoment') {
      onUpdate({
        reflection: updated,
        tradingStats: {
          ...data.tradingStats!,
          pnl: field === 'definingMoment' ? 1250.75 : data.tradingStats!.pnl
        }
      });
    } else {
      onUpdate({ reflection: updated });
    }
  };

  const tradeDrivers = [
    { label: "Great Setup", value: "great_setup" },
    { label: "Patience", value: "patience" },
    { label: "Luck", value: "luck" },
    { label: "Revenge", value: "revenge" },
    { label: "FOMO", value: "fomo" }
  ];

  const executionQualities = [
    { label: "Flawless", value: "flawless" },
    { label: "Rushed", value: "rushed" },
    { label: "Hesitant", value: "hesitant" },
    { label: "Panicked", value: "panicked" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Stage 2: The Guided Reflection</h2>
        <p className="text-muted-foreground">"It's conversational, not interrogatory."</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>In one sentence, what defined your trading today?</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., 'I stayed disciplined and caught the morning trend' or 'I let FOMO get the best of me'"
            value={reflection.definingMoment}
            onChange={(e) => handleChange('definingMoment', e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Let's look at your key moments</CardTitle>
          <p className="text-sm text-muted-foreground">We've pre-selected your most significant trades</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Best Trade */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-medium">Best Trade: {reflection.bestTrade.instrument} (+${reflection.bestTrade.pnl})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">The primary driver was:</label>
                <Select value={reflection.bestTrade.setup} onValueChange={(value) => {
                  const updated = { ...reflection, bestTrade: { ...reflection.bestTrade, setup: value as any } };
                  setReflection(updated);
                  onUpdate({ reflection: updated });
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tradeDrivers.map(driver => (
                      <SelectItem key={driver.value} value={driver.value}>{driver.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Your execution was:</label>
                <Select value={reflection.bestTrade.execution} onValueChange={(value) => {
                  const updated = { ...reflection, bestTrade: { ...reflection.bestTrade, execution: value as any } };
                  setReflection(updated);
                  onUpdate({ reflection: updated });
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {executionQualities.map(quality => (
                      <SelectItem key={quality.value} value={quality.value}>{quality.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Toughest Trade */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="font-medium">Toughest Trade: {reflection.toughestTrade.instrument} (${reflection.toughestTrade.pnl})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">The primary driver was:</label>
                <Select value={reflection.toughestTrade.setup} onValueChange={(value) => {
                  const updated = { ...reflection, toughestTrade: { ...reflection.toughestTrade, setup: value as any } };
                  setReflection(updated);
                  onUpdate({ reflection: updated });
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tradeDrivers.map(driver => (
                      <SelectItem key={driver.value} value={driver.value}>{driver.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Your execution was:</label>
                <Select value={reflection.toughestTrade.execution} onValueChange={(value) => {
                  const updated = { ...reflection, toughestTrade: { ...reflection.toughestTrade, execution: value as any } };
                  setReflection(updated);
                  onUpdate({ reflection: updated });
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {executionQualities.map(quality => (
                      <SelectItem key={quality.value} value={quality.value}>{quality.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quick Check-In */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Quick Check-In:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plan-followed"
                  checked={reflection.planFollowed}
                  onCheckedChange={(checked) => handleChange('planFollowed', checked)}
                />
                <label htmlFor="plan-followed" className="text-sm">I stuck to my trading plan</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="risk-managed"
                  checked={reflection.riskManaged}
                  onCheckedChange={(checked) => handleChange('riskManaged', checked)}
                />
                <label htmlFor="risk-managed" className="text-sm">My risk management was automatic</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="learned-something"
                  checked={reflection.learnedSomething}
                  onCheckedChange={(checked) => handleChange('learnedSomething', checked)}
                />
                <label htmlFor="learned-something" className="text-sm">I learned something new</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onComplete} size="lg" className="gap-2">
          See the Insights <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Stage 3 Component
function Stage3({ data, onUpdate, onComplete }: { data: Partial<JawGnarlEntry>; onUpdate: any; onComplete: () => void }) {
  const [finalIntention, setFinalIntention] = useState("");

  const handleFinalize = () => {
    onUpdate({
      finalIntention,
      insights: {
        ...data.insights!,
        nextSessionGoals: [finalIntention, ...(data.insights?.nextSessionGoals?.slice(1) || [])]
      }
    });
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Stage 3: The AI-Powered Insights</h2>
        <p className="text-muted-foreground">"It understands me and shows me how to grow."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - AI Analysis */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Your AI Co-Pilot Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  Pattern Spotted: {data.insights?.pattern}
                </AlertDescription>
              </Alert>

              <Alert>
                <TrendingDown className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  Emotional Insight: {data.insights?.emotionalInsight}
                </AlertDescription>
              </Alert>

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  Growth Opportunity: {data.insights?.growthOpportunity}
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                <blockquote className="italic text-center">
                  "{data.insights?.quote.text}"
                </blockquote>
                <cite className="block text-right text-sm text-muted-foreground mt-2">
                  — {data.insights?.quote.author}
                </cite>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Next Session */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Your Next Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Based on today, set ONE intention for tomorrow:
                </label>
                <Textarea
                  placeholder="Start with the AI suggestions below, or customize your own..."
                  value={finalIntention}
                  onChange={(e) => setFinalIntention(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">AI Suggested Goals:</p>
                {data.insights?.nextSessionGoals?.map((goal, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted rounded cursor-pointer hover:bg-primary/5 transition-colors"
                    onClick={() => setFinalIntention(goal)}
                  >
                    <p className="text-sm">{goal}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleFinalize}
          size="lg"
          className="gap-2"
          disabled={!finalIntention.trim()}
        >
          Complete & Lock Journal <CheckCircle className="w-4 h-4" />
        </Button>
        {!finalIntention.trim() && (
          <p className="text-sm text-muted-foreground mt-2">Please set your intention for tomorrow to complete your journal</p>
        )}
      </div>
    </div>
  );
}
