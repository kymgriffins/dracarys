"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, BookOpen, Target, MessageSquare, Award, Zap } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: readonly FeatureItem[] = [
  {
    icon: Brain,
    title: "Psychology Engine",
    description: "Advanced emotional tracking, bias detection, and confidence calibration for mental edge development.",
  },
  {
    icon: BookOpen,
    title: "Smart Journaling",
    description: "AI-powered journaling with emotional pattern recognition and personalized improvement recommendations.",
  },
  {
    icon: Target,
    title: "Discipline Systems",
    description: "Structured routines, habit tracking, and accountability tools to build consistency and mental resilience.",
  },
  {
    icon: MessageSquare,
    title: "Mentor Guidance",
    description: "Direct access to trading psychology experts with personalized coaching and growth roadmaps.",
  },
  {
    icon: Award,
    title: "Performance Analytics",
    description: "Psychology-focused metrics tracking discipline scores, emotional control improvement, and mental game progress.",
  },
  {
    icon: Zap,
    title: "Mental Training Programs",
    description: "Structured curriculum of mental exercises, bias correction drills, and psychological resilience building.",
  },
] as const;

export function FeaturesSection(): React.JSX.Element {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  return (
    <section
      ref={ref}
      className="relative container mx-auto px-6 py-32 overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 30% 70%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 30%, rgba(255, 119, 198, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="text-center mb-20"
        variants={headerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          id="features-heading"
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent"
          whileHover={{
            backgroundPosition: ["0% 50%", "100% 50%"],
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          Master Your Trading Mind
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Science-backed tools designed specifically for developing your trader psychology and mental performance.
        </motion.p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        role="list"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            whileHover={{
              y: -10,
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            role="listitem"
          >
            <Card className="group h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm bg-gradient-to-br from-card/80 to-card/60 border border-white/10 hover:border-primary/20 overflow-hidden relative">
              {/* Animated border gradient */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(120, 119, 198, 0.1), transparent)',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '200% 200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <CardHeader className="relative z-10 p-6">
                <motion.div
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                >
                  <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
