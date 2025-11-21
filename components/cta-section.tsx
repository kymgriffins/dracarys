import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target } from "lucide-react";

export function CTASection(): React.JSX.Element {
  return (
    <section className="container mx-auto px-4 py-24 text-center" aria-labelledby="cta-heading">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-6">
          <Brain className="w-12 h-12 text-primary" />
          <Target className="w-12 h-12 text-primary" />
        </div>
        <h2
          id="cta-heading"
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Ready to Master Your Mental Game?
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          Join thousands of traders who have developed discipline, emotional control, and consistent performance through structured psychology training.
        </p>
        <p className="text-base text-muted-foreground mb-8">
          No market analysis. No signals. Just focused trader development that delivers lasting results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth/signup" aria-label="Start your trader development journey">
            <Button size="lg" className="text-lg px-12 py-6 focus-visible:ring-2 focus-visible:ring-ring">
              Start Your Development Journey
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            <strong>Psychology-focused development platform</strong><br />
            Journaling • Discipline Training • Mentor Guidance
          </div>
        </div>
      </div>
    </section>
  );
}
