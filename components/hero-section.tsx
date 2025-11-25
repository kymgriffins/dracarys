"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Target, BookOpen } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

export function HeroSection(): React.JSX.Element {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0]
    }
  };

  return (
    <section
      ref={ref}
      className="relative container mx-auto px-6 py-32 text-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div variants={itemVariants}>
          <Badge
            variant="secondary"
            className="mb-8 backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg"
            aria-label="Behavioral trading platform"
          >
            🧠 Yean. Learn. Earn.
          </Badge>
        </motion.div>

        <motion.h1
          id="hero-heading"
          className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary/80 to-foreground bg-clip-text text-transparent"
          variants={itemVariants}
          whileHover={{
            backgroundPosition: ["0% 50%", "100% 50%"],
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          Dominate The Mental Game of Trading
        </motion.h1>

        <motion.div
          className="flex justify-center items-center gap-8 mb-8"
          variants={itemVariants}
        >
          {[
            { icon: Brain, label: "Psychology" },
            { icon: Target, label: "Discipline" },
            { icon: BookOpen, label: "Journaling" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center gap-2 group"
              variants={floatingVariants}
              animate="animate"
              style={{
                animationDelay: `${index * 0.5}s`
              }}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            >
              <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          The only platform focused exclusively on developing your trader psychology, discipline, and mental game.
          Just proven frameworks that build lasting trading mastery.
        </motion.p>

        <motion.p
          className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Join traders who have improved their consistency, emotional control, and performance through structured mental training.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/auth/signup" aria-label="Start your trader development journey">
              <Button
                size="lg"
                className="text-lg px-10 py-8 shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Start Your Mental Game Training
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-8 hover:bg-muted/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10"
            >
              View Demo Dashboard
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 p-6 bg-gradient-to-r from-muted/20 to-muted/10 backdrop-blur-sm rounded-lg max-w-2xl mx-auto border border-white/10 shadow-lg"
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <p className="text-sm text-muted-foreground font-medium">
            ⚠️ Important: This is a <strong>Trader Development Platform</strong>, not a trading platform.
            We focus exclusively on psychology, discipline, journaling, and mental game mastery.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
