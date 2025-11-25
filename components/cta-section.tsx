"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

export function CTASection(): React.JSX.Element {
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
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const iconVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, 0]
    }
  };

  return (
    <section
      ref={ref}
      className="relative container mx-auto px-4 py-24 text-center overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.15) 0%, transparent 70%)",
            "radial-gradient(circle at 30% 70%, rgba(255, 119, 198, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at 70% 30%, rgba(120, 119, 198, 0.15) 0%, transparent 70%)",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating orbs */}
      <div className="absolute inset-0 -z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 blur-xl"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div
          className="flex justify-center items-center gap-4 mb-6"
          variants={itemVariants}
        >
          <motion.div
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              rotate: 360,
              transition: { duration: 0.6 }
            }}
          >
            <Brain className="w-12 h-12 text-primary" />
          </motion.div>
          <motion.div
            variants={floatingVariants}
            animate="animate"
          >
            <Target className="w-12 h-12 text-primary" />
          </motion.div>
        </motion.div>

        <motion.h2
          id="cta-heading"
          className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent"
          variants={itemVariants}
          whileHover={{
            backgroundPosition: ["0% 50%", "100% 50%"],
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          Ready to Master Your Mental Game?
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground mb-4"
          variants={itemVariants}
        >
          Join thousands of traders who have developed discipline, emotional control, and consistent performance through structured psychology training.
        </motion.p>

        <motion.p
          className="text-base text-muted-foreground mb-8"
          variants={itemVariants}
        >
          No market analysis. No signals. Just focused trader development that delivers lasting results.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/auth/signup" aria-label="Start your trader development journey">
              <Button
                size="lg"
                className="text-lg px-12 py-6 focus-visible:ring-2 focus-visible:ring-ring bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Start Your Development Journey</span>
                <ArrowRight className="ml-2 w-5 h-5 relative z-10" aria-hidden="true" />

                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="text-sm text-muted-foreground backdrop-blur-sm bg-white/5 px-6 py-4 rounded-lg border border-white/10"
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255,255,255,0.1)"
            }}
          >
            <strong>Psychology-focused development platform</strong><br />
            Journaling • Discipline Training • Mentor Guidance
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
