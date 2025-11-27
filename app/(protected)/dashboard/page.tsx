"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  MessageSquare,
  Play,
  Plus,
  TrendingUp,
  Zap
} from "lucide-react";
import Link from "next/link";

// Top Summary Cards - aligned with blueprint
const summaryCards = [
  {
    title: "Today's Progress",
    value: "72%",
    detail: "+12% from yesterday",
    icon: TrendingUp,
    color: "text-secondary-foreground"
  },
  {
    title: "Active Course",
    value: "Advanced Market Psychology",
    detail: "5 lessons left",
    icon: BookOpen,
    color: "text-primary"
  },
  {
    title: "Next Session",
    value: "3:00 PM",
    detail: "Mentor: Daniel",
    icon: Clock,
    color: "text-secondary-foreground"
  },
  {
    title: "Notifications",
    value: "4",
    detail: "2 assignments due",
    icon: MessageSquare,
    color: "text-muted-foreground"
  },
];

// Learning Timeline - Upcoming and Recent Activity
const timelineData = {
  upcoming: [
    { title: "Live Psychology Workshop", time: "Today, 3 PM", type: "session" },
    { title: "Journal Review Meeting", time: "Tomorrow, 11 AM", type: "review" },
    { title: "Module 4 Release", time: "Friday", type: "course" }
  ],
  recent: [
    { title: "Completed Lesson: Market Cycles 101", time: "2h ago", type: "completed" },
    { title: "Uploaded Journal Entry", time: "1d ago", type: "journal" },
    { title: "Commented on forum discussion", time: "2d ago", type: "activity" }
  ]
};

// Quick Actions - per blueprint
const quickActions = [
  { label: "Add Journal Entry", icon: BookOpen, href: "journal/new" },
  { label: "Continue Course", icon: BookOpen, href: "courses" },
  { label: "Join Live Room", icon: Play, href: "live" },
  { label: "Upload Content", icon: Plus, href: "content/upload" }
];

// Analytics Preview
const analyticsData = {
  weeklyHours: [2.5, 3.2, 1.8, 4.1, 3.8, 2.9, 3.6], // hours per day
  engagement: [20, 45, 10, 60, 85, 75, 90] // percentage
};

// Recommended Content
const recommendedContent = [
  {
    title: "Order Blocks Deep Dive",
    type: "Next Lesson",
    difficulty: "Advanced",
    duration: "45 min"
  },
  {
    title: "Discipline Training",
    type: "Suggested Course",
    difficulty: "Intermediate",
    duration: "2 weeks"
  },
  {
    title: "Risk Management Q&A",
    type: "Live Event",
    difficulty: "All Levels",
    duration: "1 hour"
  }
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden"> {/* ← CONTAIN OVERFLOW */}
      <div className="min-h-[calc(100vh-8rem)] space-y-6 lg:space-y-8 w-full max-w-full px-4 sm:px-6"> {/* ← ADD HORIZONTAL PADDING */}

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full max-w-full"
        >
          <div className="min-w-0 flex-1"> {/* ← ALLOW SHRINKING */}
            <h1 className="text-3xl lg:text-4xl font-bold truncate text-gradient">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader'}!</h1>
            <p className="text-muted-foreground text-lg truncate">
              Ready to master your trading psychology? Let's build that winning mindset.
            </p>
          </div>
          <Badge variant="secondary" className="bg-secondary/50 backdrop-blur-sm text-secondary-foreground w-fit flex-shrink-0 border-secondary-foreground/10">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Active
          </Badge>
        </motion.div>

        {/* 2.1 Top Summary Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {summaryCards.map((card, index) => (
            <GlassCard key={index} delay={index * 0.1}>
              <GlassCardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between min-w-0">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">{card.title}</p>
                    <p className="text-xl lg:text-2xl font-bold mt-1">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{card.detail}</p>
                  </div>
                  <card.icon className={`h-6 w-6 lg:h-8 lg:w-8 ${card.color} flex-shrink-0`} />
                </div>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-full min-w-0"> {/* ← ADD min-w-0 */}

          {/* Left Column - Timeline */}
          <div className="lg:col-span-2 space-y-6 min-w-0"> {/* ← ALLOW SHRINKING */}
            {/* 2.2 Learning/Teaching Timeline */}
            <GlassCard delay={0.4} className="w-full max-w-full">
              <GlassCardHeader className="pb-4">
                <GlassCardTitle className="text-xl">Learning Timeline</GlassCardTitle>
                <GlassCardDescription>Your upcoming and recent activity</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="space-y-6 w-full max-w-full">
                {/* Upcoming Section */}
                <div className="w-full max-w-full">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Upcoming</h4>
                  <div className="space-y-3 w-full max-w-full">
                    {timelineData.upcoming.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 lg:p-4 rounded-lg hover:bg-accent/50 transition-colors w-full max-w-full min-w-0 border border-transparent hover:border-border/50">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm lg:text-base truncate">{item.title}</p>
                            <p className="text-xs lg:text-sm text-muted-foreground truncate">{item.time}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="w-full max-w-full">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Recent Activity</h4>
                  <div className="space-y-3 w-full max-w-full">
                    {timelineData.recent.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 lg:p-4 rounded-lg hover:bg-accent/50 transition-colors w-full max-w-full min-w-0 border border-transparent hover:border-border/50">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.type === 'completed' ? 'bg-secondary' :
                            item.type === 'journal' ? 'bg-primary' : 'bg-muted'
                            }`}></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm lg:text-base truncate">{item.title}</p>
                            <p className="text-xs lg:text-sm text-muted-foreground truncate">{item.time}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>

          {/* Right Column - Quick Actions & Analytics */}
          <div className="space-y-6 min-w-0"> {/* ← ALLOW SHRINKING */}
            {/* 2.3 Quick Actions Row */}
            <GlassCard delay={0.5} className="w-full max-w-full">
              <GlassCardHeader className="pb-4">
                <GlassCardTitle className="text-xl">Quick Actions</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="w-full max-w-full">
                <div className="grid grid-cols-1 gap-3 w-full max-w-full">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href} className="w-full max-w-full">
                      <Button variant="outline" className="w-full max-w-full justify-start h-auto p-4 min-w-0 bg-transparent hover:bg-accent/50 border-border/50">
                        <action.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="truncate">{action.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* 2.4 Analytics Preview */}
            <GlassCard delay={0.6} className="w-full max-w-full">
              <GlassCardHeader className="pb-4">
                <GlassCardTitle className="text-xl">Performance Overview</GlassCardTitle>
                <GlassCardDescription>This week at a glance</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="space-y-6 w-full max-w-full">
                {/* Progress Chart */}
                <div className="w-full max-w-full">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">Learning Hours</h4>
                  <div className="space-y-2 w-full max-w-full">
                    <div className="flex items-end justify-between h-20 w-full max-w-full min-w-0">
                      {analyticsData.weeklyHours.map((hours, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                          <div
                            className="w-full max-w-full bg-primary/20 rounded-t-sm transition-all duration-300 hover:bg-primary/30"
                            style={{ height: `${(hours / 5) * 100}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground w-full max-w-full min-w-0">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <span key={`${day}-${index}`} className="flex-1 text-center truncate">{day.substring(0, 1)}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Engagement Heat Map */}
                <div className="w-full max-w-full">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">Daily Engagement</h4>
                  <div className="grid grid-cols-7 gap-1 w-full max-w-full">
                    {analyticsData.engagement.map((value, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded ${value >= 80 ? 'bg-primary/80' :
                          value >= 60 ? 'bg-primary/60' :
                            value >= 40 ? 'bg-primary/40' :
                              value >= 20 ? 'bg-primary/20' : 'bg-muted'
                          }`}
                        title={`${value}% engagement`}
                      />
                    ))}
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>

        {/* 2.5 Recommended Content */}
        <GlassCard delay={0.7} className="w-full max-w-full">
          <GlassCardHeader className="pb-4">
            <GlassCardTitle className="text-xl">Recommended for You</GlassCardTitle>
            <GlassCardDescription>AI-powered suggestions based on your progress</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent className="w-full max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full">
              {recommendedContent.map((content, index) => (
                <div key={index} className="p-4 border border-border/50 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer min-h-[120px] lg:min-h-[140px] w-full max-w-full min-w-0">
                  <div className="flex items-start justify-between mb-3 min-w-0">
                    <Badge variant="secondary" className="text-xs flex-shrink-0 truncate bg-secondary/50">
                      {content.type}
                    </Badge>
                    <Zap className="w-4 h-4 text-accent-foreground flex-shrink-0" />
                  </div>
                  <h4 className="font-semibold mb-2 line-clamp-2 text-sm lg:text-base min-w-0">{content.title}</h4>
                  <div className="flex items-center justify-between text-xs lg:text-sm text-muted-foreground min-w-0">
                    <span className="truncate flex-1 mr-2">{content.difficulty}</span>
                    <span className="flex-shrink-0">{content.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}
