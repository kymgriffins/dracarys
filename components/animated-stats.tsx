"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  description: string;
}

const stats: StatItem[] = [
  {
    label: "Active Traders",
    value: 100000,
    suffix: "+",
    description: "Building mental strength daily"
  },
  {
    label: "Journal Entries Processed",
    value: 2000000,
    suffix: "+",
    description: "AI-powered insights generated"
  },
  {
    label: "Trading Biases Detected",
    value: 15,
    suffix: "+",
    description: "Common psychological patterns identified"
  },
  {
    label: "Platform Uptime",
    value: 99.9,
    suffix: "%",
    description: "Reliability you can count on"
  },
  {
    label: "Mentor Sessions Completed",
    value: 50000,
    suffix: "+",
    description: "Personalized guidance delivered"
  }
];

function AnimatedCounter({
  value,
  suffix,
  duration = 2000
}: {
  value: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
      const startTime = Date.now();
      const endTime = startTime + duration;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * value);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, isVisible, value, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <span ref={ref} className="font-mono text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
      {formatNumber(count)}{suffix}
    </span>
  );
}

export function AnimatedStats(): React.JSX.Element {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  return (
    <motion.div
      ref={ref}
      className="bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-white/10"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.h3
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Platform Statistics
      </motion.h3>

      <motion.div
        className="space-y-6"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="group flex justify-between items-center p-4 rounded-lg hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex-1">
              <div className="font-medium text-muted-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground/80">
                {stat.description}
              </div>
            </div>
            <div className="text-right">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                duration={2000 + index * 200}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Animated progress bars */}
      <motion.div
        className="mt-8 pt-6 border-t border-white/10"
        variants={itemVariants}
      >
        <div className="text-sm text-muted-foreground mb-3 font-medium">
          Mental Game Mastery Progress
        </div>
        <div className="space-y-3">
          {[
            { label: "Emotional Control", percentage: 87 },
            { label: "Discipline Score", percentage: 92 },
            { label: "Bias Recognition", percentage: 78 }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="space-y-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{
                    delay: 1.5 + index * 0.2,
                    duration: 1.5,
                    ease: "easeOut"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
