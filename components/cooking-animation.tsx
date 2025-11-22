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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {/* Animated background grid */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="grid grid-cols-8 gap-4 w-full h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="h-8 bg-foreground/10 rounded-sm" />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          <Card className="relative w-full bg-card/95 border border-border rounded-xl shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center relative overflow-hidden pb-12 pt-8">
              {/* Animated neural network lines */}
              <motion.div
                className="absolute inset-0 opacity-5"
                animate={{
                  opacity: [0.03, 0.08, 0.03],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-foreground/10 to-foreground/5" />
              </motion.div>

              {/* Abstract data nodes */}
              <motion.div
                className="absolute top-6 right-8 w-3 h-3 bg-foreground rounded-full opacity-20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-8 left-6 w-2 h-2 bg-foreground rounded-full opacity-15"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />

              {/* Central processor animation */}
              <div className="relative mx-auto w-32 h-32 mb-6 flex items-center justify-center">
                {/* Hexagon processor */}
                <motion.div
                  className="absolute w-24 h-24 border border-border rounded-lg"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />

                {/* Pulsing core */}
                <motion.div
                  className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Data particles */}
                <motion.div
                  className="absolute -top-2 left-1/2 w-1 h-1 bg-primary rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -bottom-2 right-4 w-1 h-1 bg-primary rounded-full"
                  animate={{
                    y: [0, 20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                />
              </div>

              <motion.div variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
              }}>
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground border-0 mb-6 px-4 py-2 rounded-full"
                >
                  <Heart className="w-3 h-3 mr-2" />
                  {estimatedTime}
                </Badge>
              </motion.div>

              <motion.div variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.1 } }
              }}>
                <CardTitle className="text-3xl font-bold text-foreground mb-4">
                  {title}
                </CardTitle>
              </motion.div>

              <motion.div
                className="flex items-center justify-center space-x-3 mb-6"
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, delay: 0.2 } }
                }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium text-foreground">Processing Intelligence</span>
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>

              <motion.div variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.3 } }
              }}>
                <CardDescription className="text-muted-foreground text-center max-w-md mx-auto text-lg leading-relaxed">
                  {description}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="text-center space-y-6 pb-8">
              {/* Progress indicator */}
              <motion.div
                className="space-y-4"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.4 } }
                }}
              >
                <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>System Initialization</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{
                      duration: 2,
                      ease: "easeOut",
                      delay: 0.5
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="text-sm font-medium text-muted-foreground mb-2"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { delay: 0.6 } }
                }}
              >
                <span>Building cognitive architecture...</span>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-col gap-4 mt-8"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.7 } }
                }}
              >
                {showHomeButton && (
                  <Link href={backLink}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full rounded-full py-6 text-lg">
                        <Home className="w-5 h-5 mr-3" />
                        Return to Dashboard
                      </Button>
                    </motion.div>
                  </Link>
                )}

                {backLink !== "/app/dashboard" && (
                  <Link href="/app/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full rounded-full py-6 text-lg">
                        <ArrowLeft className="w-5 h-5 mr-3" />
                        Main Interface
                      </Button>
                    </motion.div>
                  </Link>
                )}
              </motion.div>

              {/* Feature preview */}
              <motion.div
                className="mt-8 p-6 bg-muted/50 rounded-xl border border-border/50"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.8 } }
                }}
              >
                <div className="flex items-start space-x-4">
                  <Zap className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground mb-3">
                      Neural Components in Development:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-primary rounded-full mr-3" />
                        Advanced cognitive pattern recognition
                      </li>
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-primary rounded-full mr-3" />
                        Real-time mental state analysis
                      </li>
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-primary rounded-full mr-3" />
                        Predictive psychology modeling
                      </li>
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-primary rounded-full mr-3" />
                        Neural performance optimization
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Pre-configured cooking pages for common features
export function TradingAPIComingSoon() {
  return (
    <CookingAnimation
      title="Trading Neural Interface"
      description="Secure API architecture for real-time cognitive trading integration"
      estimatedTime="Q1 2026"
    />
  );
}

export function SocialFeaturesComingSoon() {
  return (
    <CookingAnimation
      title="Cognitive Network"
      description="Neural connectivity platform for trader intelligence sharing"
      estimatedTime="Q2 2026"
    />
  );
}

export function AdvancedAnalyticsComingSoon() {
  return (
    <CookingAnimation
      title="Predictive Analytics Engine"
      description="Deep learning models for psychological pattern recognition"
      estimatedTime="Q4 2025"
    />
  );
}

export function MobileAppComingSoon() {
  return (
    <CookingAnimation
      title="Mobile Neural Processor"
      description="Portable cognitive development platform for on-the-go mental training"
      estimatedTime="Q2 2026"
    />
  );
}
