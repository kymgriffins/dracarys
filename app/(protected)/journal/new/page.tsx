"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Save,
  ArrowLeft,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Crown
} from "lucide-react";
import Link from "next/link";

const moodOptions = [
  { value: 'positive', label: 'Positive 😊', icon: TrendingUp },
  { value: 'negative', label: 'Difficult 😔', icon: TrendingDown },
  { value: 'neutral', label: 'Neutral 😐', icon: Minus }
];

const tradingStyles = ['scalper', 'day_trader', 'swing_trader', 'position_trader'];

export default function NewJournalPage() {
  const [entry, setEntry] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0,5),
    mood: 'neutral',
    content: '',
    tradingStyle: 'day_trader',
    marketCondition: '',
    emotionalState: '',
    lessons: '',
    goals: '',
    trades: []
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Journal entry saved:', entry);
      setIsSaving(false);
      // Redirect to journal list
      window.location.href = '/journal';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/journal">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">New Journal Entry</h1>
              <p className="text-muted-foreground">
                Reflect on your trading day and capture valuable insights
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Premium Feature
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Entry Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Entry Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Overcame Fear During Morning Session"
                      value={entry.title}
                      onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Trading Style</Label>
                    <div className="flex gap-2">
                      {tradingStyles.map(style => (
                        <Button
                          key={style}
                          variant={entry.tradingStyle === style ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setEntry(prev => ({ ...prev, tradingStyle: style }))}
                        >
                          {style.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={entry.date}
                      onChange={(e) => setEntry(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={entry.time}
                      onChange={(e) => setEntry(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Mood & Performance</Label>
                    <div className="flex gap-1">
                      {moodOptions.map(option => {
                        const Icon = option.icon;
                        return (
                          <Button
                            key={option.value}
                            variant={entry.mood === option.value ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setEntry(prev => ({ ...prev, mood: option.value }))}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Reflection</CardTitle>
                <CardDescription>
                  What happened during your trading session? What were your thoughts and emotions?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your trading session in detail. What opportunities did you see? How did you feel? What challenges did you face?"
                  value={entry.content}
                  onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Be honest about your wins, losses, fears, and learnings. This space is for you to grow.
                </p>
              </CardContent>
            </Card>

            {/* Trading Context */}
            <Card>
              <CardHeader>
                <CardTitle>Market Conditions</CardTitle>
                <CardDescription>
                  Describe the overall market environment and your setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="marketCondition">Market Volatility & Conditions</Label>
                  <Textarea
                    id="marketCondition"
                    placeholder="e.g., High volatility during FOMC announcement, ranging in EUR/USD, strong bullish momentum in crypto"
                    value={entry.marketCondition}
                    onChange={(e) => setEntry(prev => ({ ...prev, marketCondition: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="emotionalState">Emotional State & Mindset</Label>
                  <Textarea
                    id="emotionalState"
                    placeholder="e.g., Feeling confident after recent wins, struggling with FOMO, disciplined execution despite market noise"
                    value={entry.emotionalState}
                    onChange={(e) => setEntry(prev => ({ ...prev, emotionalState: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lessons & Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Learnings & Growth
                </CardTitle>
                <CardDescription>
                  What did you learn and what are your next goals?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="lessons">Key Lessons Learned</Label>
                  <Textarea
                    id="lessons"
                    placeholder="• Patience pays off in ranging markets
• Risk management saved me from a big loss
• Need to work on entry timing
• Emotional control is improving"
                    value={entry.lessons}
                    onChange={(e) => setEntry(prev => ({ ...prev, lessons: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="goals">Goals for Next Session</Label>
                  <Textarea
                    id="goals"
                    placeholder="• Maintain discipline with position sizing
• Practice better risk-reward ratios
• Study chart patterns before trading
• Work on emotional regulation techniques"
                    value={entry.goals}
                    onChange={(e) => setEntry(prev => ({ ...prev, goals: e.target.value }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Journal Entry'}
              </Button>
              <Link href="/journal">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features Reminder */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-secondary">
              <CardContent className="p-6 text-center">
                <Crown className="w-8 h-8 mx-auto mb-3 text-secondary-foreground" />
                <h3 className="font-bold mb-2">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized feedback, pattern recognition, and growth recommendations
                </p>
                <Badge className="bg-secondary text-secondary-foreground">
                  Premium Feature
                </Badge>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Journaling Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Be Honest:</strong> Write down both wins and losses without judgment</p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Focus on Learning:</strong> What opportunities did you miss? What went well?</p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Emotional Awareness:</strong> Acknowledge feelings of fear, greed, excitement</p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Action Items:</strong> Set specific, actionable goals for improvement</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Market Analysis Paralysis</p>
                  <p className="text-muted-foreground">2 days ago</p>
                </div>

                <div className="text-sm">
                  <p className="font-medium">Successful Risk Management</p>
                  <p className="text-muted-foreground">3 days ago</p>
                </div>

                <div className="text-sm">
                  <p className="font-medium">Learning from Losses</p>
                  <p className="text-muted-foreground">1 week ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
