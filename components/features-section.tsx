import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, BookOpen, Target, MessageSquare, Award, Zap } from "lucide-react";

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
  return (
    <section className="container mx-auto px-6 py-32" aria-labelledby="features-heading">
      <div className="text-center mb-20">
        <h2
          id="features-heading"
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Master Your Trading Mind
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Science-backed tools designed specifically for developing your trader psychology and mental performance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            role="listitem"
          >
            <CardHeader>
              <feature.icon className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
