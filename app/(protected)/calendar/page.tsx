"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Bell,
  TrendingUp,
  AlertTriangle,
  Info,
  DollarSign,
  Globe,
  BarChart3
} from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Economic Calendar</h1>
              <p className="text-muted-foreground text-xl mt-2 leading-relaxed">
                Stay ahead of market-moving economic events that impact trading psychology and market sentiment
              </p>
            </div>
          </div>
        </div>

        {/* Education Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 border border-primary dark:border-primary rounded-3xl backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-start gap-6">
              <div className="p-3 rounded-2xl bg-primary/20 dark:bg-primary/20">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-3">Psychology Tip: Economic Events & Trader Emotions</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Economic data releases create uncertainty waves in markets. High-impact events (marked with 🔴) often trigger emotional responses like FOMO, panic selling, or euphoria. Use this calendar to schedule your mental preparation around these events.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <span className="text-sm font-medium">High Impact</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <span className="text-sm font-medium">Medium Impact</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-sm font-medium">Low Impact</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Calendar Iframe */}
        <Card className="rounded-3xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-2xl bg-primary/10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Real-Time Economic Events</CardTitle>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Live data from major economies that shape market psychology and trader behavior
                </p>
              </div>
              <Badge className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground border border-secondary">
                Live Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Investing.com Economic Calendar Embed */}
            <div className="w-full overflow-hidden rounded-b-lg">
              <iframe
                src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_employment,_economicActivity,_inflation,_credit,_centralBanks,_confidenceIndex,_balance,_Bonds&features=datepicker,timezone,timeselector,filters&countries=5&calType=week&timeZone=8&lang=1"
                width="100%"
                height="550"
                frameBorder="0"
                marginWidth={0}
                marginHeight={0}
                className="w-full min-h-[550px]"
              ></iframe>
              <div className="px-6 py-3 bg-muted/50 rounded-b-lg border-t">
                <p className="text-xs text-muted-foreground">
                  Real Time Economic Calendar provided by{" "}
                  <a
                    href="https://www.investing.com/"
                    rel="nofollow"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Investing.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Psychology Preparation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="rounded-3xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-primary/20 dark:bg-primary/20 w-fit">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Pre-Event Preparation</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Review your bias checklist before high-impact events. Are you emotionally prepared for volatility?
              </p>
              <Button className="w-full h-12 rounded-xl hover:bg-primary/90 transition-colors">
                Open Bias Checklist
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-muted/20 dark:bg-muted/20 w-fit">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Event Reminders</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Set mental preparation reminders for upcoming economic events that might affect your trading.
              </p>
              <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 hover:bg-white/10 transition-colors">
                Set Reminder
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-secondary/20 dark:bg-secondary/20 w-fit">
                <TrendingUp className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Trading Plan Review</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Adapt your trading plan for potential increased volatility around these events.
              </p>
              <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 hover:bg-white/10 transition-colors">
                Review Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="bg-accent/80 dark:bg-accent/50 border border-accent dark:border-accent rounded-3xl backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-start gap-6">
              <div className="p-3 rounded-2xl bg-accent/20 dark:bg-accent/20">
                <Info className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-foreground mb-3">Trading Psychology Disclaimer</h4>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  This calendar is provided for educational purposes to help you understand market psychology around economic events. It does not constitute financial advice or trading signals. Always trade with proper risk management and consult your journal for personal psychological patterns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
