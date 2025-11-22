"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Heart, Home, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

interface CookingAnimationProps {
  title: string;
  description: string;
  estimatedTime?: string;
  showHomeButton?: boolean;
  backLink?: string;
}

export function CookingAnimation({
  title = "Feature Coming Soon",
  description = "We're working hard to bring you this amazing feature",
  estimatedTime = "Coming Soon",
  showHomeButton = true,
  backLink = "/app/dashboard"
}: CookingAnimationProps) {
  return (
    <div className="min-h-screen bg-white from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="relative">
        {/* Subtle premium overlay for coming soon feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-xl opacity-30" />
        <Card className="relative w-[100%] max-w-6xl mx-auto bg-white/95 backdrop-blur-sm border-primary/30 shadow-xl ring-1 ring-primary/10">
          <CardHeader className="text-center relative overflow-hidden pb-8">
            {/* Floating ingredients */}
            <motion.div
              className="absolute top-4 right-4 text-orange-300 opacity-60"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🔥
            </motion.div>
            <motion.div
              className="absolute top-8 left-4 text-yellow-300 opacity-50"
              animate={{
                y: [0, -8, 0],
                rotate: [0, -3, 3, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              🔥           </motion.div>
            <motion.div
              className="absolute bottom-4 left-6 text-green-300 opacity-60"
              animate={{
                y: [0, -6, 0],
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              🌿
            </motion.div>

            {/* Sparkles */}
            <motion.div
              className="absolute top-2 left-2 text-yellow-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🔥
            </motion.div>
            <motion.div
              className="absolute bottom-2 right-2 text-yellow-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              🔥
            </motion.div>

            {/* Animated dragon throwing fire */}
            <div className="relative mx-auto w-32 h-24 mb-4 flex items-center justify-center">
              {/* Dragon body */}
              <motion.div
                className="text-6xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🐉
              </motion.div>

              {/* Fire being thrown - animated flames */}
              <motion.div
                className="absolute -right-8 top-2 flex space-x-1"
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, 20, 40],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                🔥
              </motion.div>

              <motion.div
                className="absolute -right-4 top-1 flex space-x-1"
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, 15, 30],
                  scale: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8
                }}
              >
                🔥
              </motion.div>

              <motion.div
                className="absolute -right-12 top-3 flex space-x-1"
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, 25, 50],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2
                }}
              >
                🔥
              </motion.div>
            </div>

            <Badge variant="secondary" className="bg-gray-200 text-gray-500 mb-4 px-4 py-1 opacity-75">
              <Heart className="w-3 h-3 mr-1" />
              {estimatedTime}
            </Badge>

            <CardTitle className="text-2xl font-bold text-gray-500 mb-2 opacity-75">
              {title}
            </CardTitle>

            <div className="flex items-center justify-center space-x-1 mb-4 opacity-75">
              <Sparkles className="w-4 h-4 text-gray-300" />
              <span className="text-lg font-medium text-gray-500">Fire's Still Blazing!</span>
              <Sparkles className="w-4 h-4 text-gray-300" />
            </div>

            <CardDescription className="text-gray-500 text-center max-w-sm mx-auto opacity-75">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 opacity-75">
                <Clock className="w-4 h-4" />
                <span>Estimated completion</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-foreground rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center text-sm font-medium opacity-75 mb-8">
              <span>We're forging something legendary just for you! 🔥</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-8">
              {showHomeButton && (
                <Link href={backLink}>
                  <Button className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              )}

              {backLink !== "/app/dashboard" && (
                <Link href="/app/dashboard">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return Home
                  </Button>
                </Link>
              )}
            </div>

            {/* Fun facts or updates - gray but readable */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 opacity-75">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-grag04 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-grag06 mb-1">
                    What we're cooking up:
                  </p>
                  <ul className="text-xs text-grag05 space-y-0.5">
                    <li>• Advanced AI-powered insights</li>
                    <li>• Real-time mentor connections</li>
                    <li>• Interactive psychology exercises</li>
                    <li>• Performance tracking tools</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Pre-configured cooking pages for common features
export function TradingAPIComingSoon() {
  return (
    <CookingAnimation
      title="Live Trading API"
      description="We're building a secure API to integrate your favorite trading platforms and brokers"
      estimatedTime="Q1 2026"
    />
  );
}

export function SocialFeaturesComingSoon() {
  return (
    <CookingAnimation
      title="Trader Community"
      description="Connect with fellow traders, share strategies, and learn from the community"
      estimatedTime="Q2 2026"
    />
  );
}

export function AdvancedAnalyticsComingSoon() {
  return (
    <CookingAnimation
      title="Advanced Analytics"
      description="Deep performance analytics with predictive insights and risk modeling"
      estimatedTime="Q4 2025"
    />
  );
}

export function MobileAppComingSoon() {
  return (
    <CookingAnimation
      title="Mobile App"
      description="Full-featured mobile app for on-the-go trading psychology development"
      estimatedTime="Q2 2026"
    />
  );
}
