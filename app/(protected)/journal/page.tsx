"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Filter
} from "lucide-react";

interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  trades: Array<{
    pair: string;
    action: 'buy' | 'sell';
    outcome: 'profit' | 'loss';
    amount: number;
    notes: string;
  }>;
  lessons: string[];
  goals: {
    achieved: string[];
    pending: string[];
  };
}

// Mock journal data
const mockEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date(),
    title: "Overcoming Analysis Paralysis",
    content: "Today I struggled with over-analyzing the EUR/USD pair. I spent hours looking at charts instead of taking action. Need to work on my decision-making process.",
    mood: 'negative',
    trades: [
      {
        pair: "EUR/USD",
        action: "buy",
        outcome: "loss",
        amount: -25,
        notes: "Entered based on trend analysis, but backed out due to hesitation"
      }
    ],
    lessons: [
      "Trust your analysis and commit to your trades",
      "Set time limits for trade analysis and decision making",
      "Maintain proper risk management regardless of timeframe"
    ],
    goals: {
      achieved: ["Journal consistently for a week straight"],
      pending: ["Maintain discipline in trade execution", "Improve analysis speed"]
    }
  },
  {
    id: "2",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    title: "Successful Risk Management Day",
    content: "Maintained discipline with risk management. Small but consistent gains show the importance of proper position sizing and stop losses.",
    mood: 'positive',
    trades: [
      {
        pair: "GBP/JPY",
        action: "sell",
        outcome: "profit",
        amount: 45,
        notes: "Clean execution following the setup perfectly"
      },
      {
        pair: "USD/CAD",
        action: "buy",
        outcome: "profit",
        amount: 38,
        notes: "Good timing on the retracement entry"
      }
    ],
    lessons: [
      "Consistent risk management leads to consistent results",
      "Emotional control is crucial for success",
      "Following the system works better than impulsive decisions"
    ],
    goals: {
      achieved: ["Achieved profit target for the day", "Maintained proper risk per trade"],
      pending: ["Increase average profit per trade", "Reduce number of losing trades"]
    }
  }
];

export default function JournalPage() {
  const [entries, setEntries] = useState(mockEntries);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("all");
  const [newEntryOpen, setNewEntryOpen] = useState(false);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === "all" || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'text-secondary-foreground bg-secondary';
      case 'negative': return 'text-muted-foreground bg-muted';
      case 'neutral': return 'text-accent-foreground bg-accent';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'positive': return 'Positive';
      case 'negative': return 'Difficult';
      case 'neutral': return 'Neutral';
      default: return mood;
    }
  };

  const getTradeTotal = (trades: JournalEntry['trades']) => {
    return trades.reduce((total, trade) => total + trade.amount, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Trading Journal</h1>
            <p className="text-muted-foreground">
              Reflect on your trades, track your progress, and improve your trading psychology
            </p>
          </div>

          <Link href="/journal/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedMood === "all" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedMood("all")}
            >
              All Moods
            </Button>
            <Button
              variant={selectedMood === "positive" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedMood("positive")}
            >
              Positive
            </Button>
            <Button
              variant={selectedMood === "negative" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedMood("negative")}
            >
              Difficult
            </Button>
            <Button
              variant={selectedMood === "neutral" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedMood("neutral")}
            >
              Neutral
            </Button>
          </div>
        </div>

        {/* Journal Entries */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{entry.title}</h3>
                      <Badge className={getMoodColor(entry.mood)}>
                        {getMoodLabel(entry.mood)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {entry.date.toLocaleDateString()}
                      </div>
                      {entry.trades.length > 0 && (
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          ${getTradeTotal(entry.trades).toFixed(2)}
                          {getTradeTotal(entry.trades) >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-secondary-foreground ml-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-muted-foreground ml-1" />
                          )}
                        </div>
                      )}
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {entry.trades.length} trade{entry.trades.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Main Reflection */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Reflection</h4>
                  <p className="text-muted-foreground leading-relaxed">{entry.content}</p>
                </div>

                {/* Trades */}
                {entry.trades.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Trades</h4>
                    <div className="space-y-3">
                      {entry.trades.map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Badge variant={trade.action === 'buy' ? 'default' : 'secondary'}>
                              {trade.action.toUpperCase()} {trade.pair}
                            </Badge>
                            <Badge variant={trade.outcome === 'profit' ? 'default' : 'destructive'}>
                              {trade.outcome === 'profit' ? 'Profit' : 'Loss'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold text-sm ${trade.amount >= 0 ? 'text-secondary-foreground' : 'text-muted-foreground'}`}>
                              {trade.amount >= 0 ? '+' : ''}${trade.amount}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">{trade.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lessons Learned */}
                {entry.lessons.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Lessons Learned</h4>
                    <div className="space-y-2">
                      {entry.lessons.map((lesson, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 border border-border rounded-lg">
                          <CheckCircle className="w-4 h-4 text-secondary-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Goals Progress */}
                {(entry.goals.achieved.length > 0 || entry.goals.pending.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {entry.goals.achieved.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Goals Achieved ✓</h4>
                        <div className="space-y-2">
                          {entry.goals.achieved.map((goal, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-secondary border border-secondary rounded-lg">
                              <CheckCircle className="w-4 h-4 text-secondary-foreground flex-shrink-0" />
                              <span className="text-sm text-secondary-foreground">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.goals.pending.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Goals Pending</h4>
                        <div className="space-y-2">
                          {entry.goals.pending.map((goal, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-accent border border-accent rounded-lg">
                              <AlertTriangle className="w-4 h-4 text-accent-foreground flex-shrink-0" />
                              <span className="text-sm text-accent-foreground">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No journal entries found</h3>
            <p className="text-muted-foreground">Start your trading journey by creating your first journal entry</p>
          </div>
        )}
      </div>
    </div>
  );
}
