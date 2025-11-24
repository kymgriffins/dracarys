"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, TrendingUp, TrendingDown, Clock, Target, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JournalEntry {
  id: string;
  date: string;
  mood?: string | { label: string; emoji: string };
  pnl: number;
  winRate: number;
  keyMetric?: string;
  intention: string;
  finalIntention?: string;
}

export default function JawGnarlPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem('jawgnarl_entries') || '[]');
    setEntries(savedEntries);
  }, []);

  const getMoodEmoji = (mood?: string | { label: string; emoji: string }) => {
    if (!mood) return '😐';
    if (typeof mood === 'string') {
      switch (mood) {
        case 'frustrated': return '😞';
        case 'neutral': return '😐';
        case 'euphoric': return '😊';
        default: return '😐';
      }
    }
    return mood.emoji;
  };

  const getMoodColor = (mood?: string | { label: string; emoji: string }) => {
    if (!mood) return 'bg-gray-500/10 text-gray-600';
    const moodLabel = typeof mood === 'string' ? mood : mood.label.toLowerCase();
    switch (moodLabel) {
      case 'frustrated': return 'bg-red-500/10 text-red-600';
      case 'neutral': return 'bg-blue-500/10 text-blue-600';
      case 'euphoric': return 'bg-green-500/10 text-green-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getMoodLabel = (mood?: string | { label: string; emoji: string }) => {
    if (!mood) return 'Neutral';
    if (typeof mood === 'string') return mood.charAt(0).toUpperCase() + mood.slice(1);
    return mood.label;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">JawGnarl Journal v2</h1>
          <p className="text-muted-foreground">The 3-minute post-trade ritual for professional trading</p>
        </div>
        <Link href="/app/jawgnarl/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Journal Entry
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$1,250.75</div>
            <p className="text-xs text-muted-foreground">+8.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">12 wins / 4 losses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5h</div>
            <p className="text-xs text-muted-foreground">9:30 AM - 2:00 PM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entries Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">3-min averages</p>
          </CardContent>
        </Card>
      </div>

      {/* Journal Entries */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Journal Entries</h2>

        {entries.length === 0 ? (
          <Card className="text-center p-8">
            <div className="text-muted-foreground">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No journal entries yet</h3>
              <p className="mb-4">Start your first 3-minute journaling session to begin tracking your trading journey.</p>
              <Link href="/app/jawgnarl/new">
                <Button>Create Your First Entry</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Link key={entry.id} href={`/app/jawgnarl/${entry.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{entry.date}</Badge>
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getMoodColor(entry.mood)}`}>
                          {getMoodLabel(entry.mood)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${entry.pnl && entry.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.pnl && entry.pnl >= 0 ? '+' : ''}{(entry.pnl ?? 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">{entry.winRate}% win rate</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{entry.keyMetric}</p>
                      <p className="text-sm">
                        <span className="font-medium">Tomorrow's Intention:</span> {entry.intention}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-end text-xs text-muted-foreground">
                      <Eye className="w-3 h-3 mr-1" />
                      Click to view full entry
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
