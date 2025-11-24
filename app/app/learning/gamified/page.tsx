"use client";

import { useState } from "react";
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
  CheckCircle
} from "lucide-react";

export default function GamifiedLearningPage() {
  const [currentLevel] = useState(5);
  const [experiencePoints] = useState(2450);
  const [completedModules] = useState(12);

  const learningPaths = [
    {
      id: 1,
      title: "Trading Fundamentals",
      description: "Master the basics of trading psychology and technical analysis",
      modules: 8,
      completedModules: 8,
      xpReward: 500,
      difficulty: "Beginner",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Risk Management Mastery",
      description: "Learn to protect your capital and manage position sizing",
      modules: 6,
      completedModules: 4,
      xpReward: 750,
      difficulty: "Intermediate",
      icon: <Target className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Advanced Market Analysis",
      description: "Deep dive into market structure and institutional trading patterns",
      modules: 10,
      completedModules: 0,
      xpReward: 1000,
      difficulty: "Advanced",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-purple-500"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "First Trade Journal",
      description: "Complete your first trading journal entry",
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      earned: true,
      xpReward: 100
    },
    {
      id: 2,
      title: "Streak Master",
      description: "Maintain consistent daily journaling for 7 days",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      earned: true,
      xpReward: 200
    },
    {
      id: 3,
      title: "Knowledge Seeker",
      description: "Complete 5 learning modules",
      icon: <Trophy className="w-8 h-8 text-orange-500" />,
      earned: false,
      xpReward: 300
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">🎮 Gamified Learning Hub</h1>
        <p className="text-muted-foreground text-lg">Learn trading through interactive experiences and visual storytelling</p>
      </div>

      {/* Player Stats Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
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
              <div className="text-3xl font-bold text-green-600 mb-1">{experiencePoints.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">XP Points</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{completedModules}</div>
              <p className="text-sm text-muted-foreground">Modules Complete</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-6 h-6 text-yellow-500" />
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
          {learningPaths.map((path) => (
            <Card key={path.id} className="hover:shadow-lg transition-all duration-200 border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${path.color} text-white`}>
                    {path.icon}
                  </div>
                  <Badge variant={path.difficulty === 'Beginner' ? 'secondary' : path.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                    {path.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{path.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">{path.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{path.completedModules}/{path.modules} modules</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(path.completedModules / path.modules) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    {path.xpReward} XP
                  </div>
                  <Button size="sm" variant={path.completedModules === path.modules ? "secondary" : "default"}>
                    {path.completedModules === path.modules ? (
                      <>
                        <Star className="w-4 h-4 mr-1" />
                        Review
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Continue
                      </>
                    )}
                  </Button>
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
              <Card key={achievement.id} className={`transition-all ${achievement.earned ? 'border-green-200 bg-green-50' : 'border-muted bg-muted/20'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${achievement.earned ? 'bg-white' : 'bg-muted'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${achievement.earned ? 'text-green-800' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
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
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
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
                <div className="text-4xl font-bold text-orange-600">7</div>
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
