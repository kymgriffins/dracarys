"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

export function ParticleField({ count = 50, className = "" }: ParticleFieldProps): React.JSX.Element {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      });
    }
    setParticles(newParticles);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-primary/30 to-primary/10"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Larger floating orbs */}
      {particles.slice(0, 8).map((particle) => (
        <motion.div
          key={`orb-${particle.id}`}
          className="absolute rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-xl"
          style={{
            width: `${particle.size * 8}px`,
            height: `${particle.size * 8}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Geometric shapes particle variant
export function GeometricParticles({ count = 30, className = "" }: ParticleFieldProps): React.JSX.Element {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 15 + 8,
        delay: Math.random() * 3,
      });
    }
    setParticles(newParticles);
  }, [count]);

  const shapes = ['square', 'circle', 'triangle'];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 80 - 40, 0],
              rotate: [0, 360],
              opacity: [0, 0.4, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          >
            {shape === 'square' && (
              <div
                className="bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/20"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                }}
              />
            )}
            {shape === 'circle' && (
              <div
                className="bg-gradient-to-br from-primary/30 to-primary/5 rounded-full border border-primary/15"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                }}
              />
            )}
            {shape === 'triangle' && (
              <div
                className="border-l-transparent border-r-transparent border-b-primary/20"
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: `${particle.size / 2}px`,
                  borderRightWidth: `${particle.size / 2}px`,
                  borderBottomWidth: `${particle.size}px`,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
