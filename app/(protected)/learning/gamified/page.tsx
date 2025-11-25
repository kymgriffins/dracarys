"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PlayCircle,
  Trophy,
  Target,
  BookOpen,
  Zap,
  Users,
  Clock,
  Award,
  TrendingUp,
  Star,
  CheckCircle,
  BarChart3,
  Shield
} from "lucide-react";

export default function GamifiedLearningPage() {
  const [currentLevel] = useState(5);
  const [experiencePoints] = useState(2450);
  const [completedModules] = useState(12);

  const gauntletLevels = [
    {
      id: 1,
      title: "Level 1: The Foundation",
      subtitle: "Market Mechanics Primer",
      description: "Master the core market structures that professional traders use",
      gates: 3,
      completedGates: 3,
      xpReward: 200,
      status: "completed",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-slate-600",
      concepts: ["Market Maker Series Primer", "Order Blocks (OB)", "Fair Value Gaps (FVG)"],
      gateChallenge: "Identify Bullish/Bearish Order Blocks and Fair Value Gaps on chart snippets"
    },
    {
      id: 2,
      title: "Level 2: The Scout",
      subtitle: "Market Timing & Liquidity",
      description: "Learn to hunt liquidity and understand market manipulation patterns",
      gates: 4,
      completedGates: 4,
      xpReward: 250,
      status: "completed",
      icon: <Users className="w-6 h-6" />,
      color: "bg-muted",
      concepts: ["Buy/Sell-Side Liquidity", "Mitigation Blocks", "NY/London Killzones"],
      gateChallenge: "Describe liquidity sweeps and mitigation patterns during killzones"
    },
    {
      id: 3,
      title: "Level 3: The Sniper",
      subtitle: "Entry & Execution Models",
      description: "Precision trade entry using ICT's proprietary models",
      gates: 5,
      completedGates: 2,
      xpReward: 300,
      status: "inProgress",
      icon: <Target className="w-6 h-6" />,
      color: "bg-primary",
      concepts: ["ICT Power of 3 (P3)", "Judas Swing", "Displacement & Retracement"],
      gateChallenge: "Outline complete P3 buy setup from entry trigger to displacement"
    },
    {
      id: 4,
      title: "Level 4: The Strategist",
      subtitle: "Higher Timeframe Confluence",
      description: "Synthesize multi-timeframe analysis for high-probability setups",
      gates: 6,
      completedGates: 0,
      xpReward: 350,
      status: "locked",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-secondary",
      concepts: ["HTF Order Blocks", "HTF FVGs", "Market Structure Shifts (MSS)", "Breaker Blocks"],
      gateChallenge: "Synthesize HTF confluence with MSS for optimal trade alignment"
    },
    {
      id: 5,
      title: "Level 5: The Risk Commander",
      subtitle: "Trade & Risk Management",
      description: "Master position management and psychological discipline",
      gates: 4,
      completedGates: 0,
      xpReward: 400,
      status: "locked",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-secondary",
      concepts: ["Optimal Trade Entry (OTE)", "RR-based Position Sizing", "Psychological Discipline"],
      gateChallenge: "Calculate OTE zones, define liquidation levels, and identify liquidity targets"
    },
    {
      id: 6,
      title: "Finale: The Proving Grounds",
      subtitle: "Live Trading Simulation",
      description: "Demonstrate mastery in unstructured real-market scenarios",
      gates: 1,
      completedGates: 0,
      xpReward: 500,
      status: "locked",
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-accent",
      concepts: ["Real-time Synthesis", "Adaptability", "Execution Fluency"],
      gateChallenge: "Navigate live scenarios articulating complete trade thesis from setup to management"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Foundation Conqueror",
      description: "Passed all gates in Level 1: The Foundation",
      icon: <Trophy className="w-8 h-8 text-slate-500" />,
      earned: true,
      xpReward: 200
    },
    {
      id: 2,
      title: "Liquidity Scout",
      description: "Mastered market timing and liquidity hunting",
      icon: <Award className="w-8 h-8 text-muted-foreground" />,
      earned: true,
      xpReward: 250
    },
    {
      id: 3,
      title: "P3 Precision",
      description: "Successfully articulated complete Power of 3 setups",
      icon: <Target className="w-8 h-8 text-primary" />,
      earned: false,
      xpReward: 300
    },
    {
      id: 4,
      title: "S.M.A.R.T. Initiate",
      description: "Commenced Socratic training under the AI mentor",
      icon: <Star className="w-8 h-8 text-secondary-foreground" />,
      earned: true,
      xpReward: 100
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-6 py-3 rounded-full mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">S.M.A.R.T. Dealer</h3>
            <p className="text-sm text-muted-foreground">Your ICT Mentor</p>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">⚔️ The Gauntlet</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          5-level ICT mastery through <span className="font-semibold text-primary">S</span>ocratic questioning,
          <span className="font-semibold text-secondary-foreground"> A</span>chievement milestones,
          <span className="font-semibold text-primary"> R</span>isk-conscious learning,
          <span className="font-semibold text-secondary-foreground"> T</span>imed-learning experiences
        </p>
      </div>

      {/* Player Stats Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-accent-foreground" />
            Your Trading Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{currentLevel}</div>
              <p className="text-sm text-muted-foreground">Current Level</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-foreground mb-1">{experiencePoints.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">XP Points</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{completedModules}</div>
              <p className="text-sm text-muted-foreground">Modules Complete</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-6 h-6 text-accent-foreground" />
                <span className="text-2xl font-bold">12</span>
              </div>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Level {currentLevel} Progress</span>
              <span className="text-sm text-muted-foreground">2,450 / 3,000 XP</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full"
                style={{ width: `${(2450 / 3000) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6" />
          Interactive Learning Paths
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gauntletLevels.map((level) => (
            <Card key={level.id} className={`hover:shadow-lg transition-all duration-200 border-2 ${
              level.status === 'completed' ? 'bg-secondary/50 border-secondary' :
              level.status === 'inProgress' ? 'bg-primary/50 border-primary' :
              'bg-muted/20 border-muted'
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${level.color} text-white relative`}>
                    {level.icon}
                    {level.status === 'completed' && (
                      <div className="absolute -top-1 -right-1 bg-secondary rounded-full p-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={level.status === 'completed' ? 'default' :
                                   level.status === 'inProgress' ? 'secondary' : 'destructive'}>
                      {level.status === 'completed' ? 'Completed' :
                       level.status === 'inProgress' ? 'In Progress' : 'Locked'}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">
                  <div className="font-bold">{level.title}</div>
                  <div className="text-sm font-normal text-muted-foreground mt-1">{level.subtitle}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">{level.description}</p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gate Progress</span>
                    <span>{level.completedGates}/{level.gates} gates</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(level.completedGates / level.gates) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Key Concepts */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Key Concepts:</p>
                  <div className="flex flex-wrap gap-1">
                    {level.concepts.slice(0, 3).map((concept, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {concept}
                      </span>
                    ))}
                    {level.concepts.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{level.concepts.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Gate Challenge */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Gate Challenge:</p>
                  <p className="text-xs text-muted-foreground italic">{level.gateChallenge}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    {level.xpReward} XP
                  </div>
                  <Link href={level.status !== 'locked' ? `/learning/lessons/level-${level.id}` : '#'}>
                    <Button
                      size="sm"
                      variant={level.status === 'completed' ? "secondary" :
                               level.status === 'inProgress' ? "default" :
                               "outline"}
                      disabled={level.status === 'locked'}
                    >
                      {level.status === 'completed' ? (
                        <>
                          <Star className="w-4 h-4 mr-1" />
                          Review
                        </>
                      ) : level.status === 'inProgress' ? (
                        <>
                          <PlayCircle className="w-4 h-4 mr-1" />
                          Continue
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mr-1" />
                          Locked
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements & Leaderboard Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Achievement Gallery
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`transition-all ${achievement.earned ? 'border-secondary bg-secondary' : 'border-muted bg-muted/20'}`} style={{transition: 'all 0.2s ease'}}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${achievement.earned ? 'bg-white' : 'bg-muted'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${achievement.earned ? 'text-secondary-foreground' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <div className="flex items-center gap-1 text-sm text-secondary-foreground">
                        <Star className="w-4 h-4" />
                        +{achievement.xpReward} XP
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats & Community */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Learning Community
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <Clock className="w-8 h-8 mx-auto mb-2 text-secondary-foreground" />
                <div className="text-2xl font-bold">24/7</div>
                <p className="text-sm text-muted-foreground">Always Available</p>
              </CardContent>
            </Card>
          </div>

          {/* Study Streak */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="text-lg">🔥 Current Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-muted-foreground">7</div>
                <div>
                  <p className="font-medium">Days in a row!</p>
                  <p className="text-sm text-muted-foreground">Keep it up for bonus XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
        <CardContent className="p-8">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">Start Your Trading Mastery Journey</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Transform your trading education through interactive visuals, gamified challenges,
            and engaging storytelling that makes complex concepts stick.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <PlayCircle className="w-5 h-5" />
              Start Learning Path
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Users className="w-5 h-5" />
              Browse Community
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
