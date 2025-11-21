import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Target, BookOpen } from "lucide-react";

export function HeroSection(): React.JSX.Element {
  return (
    <section className="container mx-auto px-6 py-32 text-center" aria-labelledby="hero-heading">
      <div className="max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-8" aria-label="Behavioral trading platform">
          🧠 Psychology-First Trading Development
        </Badge>
        <h1
          id="hero-heading"
          className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Master Your Trading Mind
        </h1>
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="flex flex-col items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium">Psychology</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium">Discipline</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium">Journaling</span>
          </div>
        </div>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          The only platform focused exclusively on developing your trader psychology, discipline, and mental game.
          No market data. No signals. Just proven frameworks that build lasting trading mastery.
        </p>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join traders who have improved their consistency, emotional control, and performance through structured mental training.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/auth/signup" aria-label="Start your trader development journey">
            <Button size="lg" className="text-lg px-10 py-8 shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring">
              Start Your Mental Game Training
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-10 py-8 hover:bg-muted/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring">
            View Demo Dashboard
          </Button>
        </div>
        <div className="mt-12 p-6 bg-muted/20 rounded-lg max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground font-medium">
            ⚠️ Important: This is a <strong>Trader Development Platform</strong>, not a trading platform.
            We focus exclusively on psychology, discipline, journaling, and mental game mastery.
          </p>
        </div>
      </div>
    </section>
  );
}
