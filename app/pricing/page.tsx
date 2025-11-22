// Premium Pricing Component for Trader Development Platform
// Built with shadcn/ui, focused on mentorship tiers

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Heart, Shield, Brain, Target, Users, TrendingUp } from "lucide-react";
import { PricingPlans } from "@/components/pricing-plans";
import { pricingTiers, tableFeatures, tableData, psychologyGuarantees } from "@/lib/pricing-data";

export default function PremiumPricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Dracarys</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-foreground/80 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-6">
            <Star className="w-4 h-4 mr-2" />
            Trader Development Memberships
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Master Your Trading Mindset
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional mentorship and psychology-driven tools to transform you from a gambler into a disciplined trader.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">

        {/* Premium Focus Banner */}
        <div className="bg-muted/30 border border-border rounded-lg p-8 mb-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Psychology-First Trading Education</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our premium memberships focus exclusively on mental game development, journaling mastery,
            and personalized mentorship. No market data, no signals, no shortcuts. Just real trader growth.
          </p>
        </div>

        {/* Pricing Component */}
        <PricingPlans
          tiers={pricingTiers}
          tableFeatures={tableFeatures}
          tableData={tableData}
          showTable={true}
        />

        {/* Psychology Guarantee */}
        <div className="bg-muted/30 border border-border rounded-lg p-8 mb-16">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Psychology-First Guarantee</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {psychologyGuarantees.map((guarantee, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-2">{guarantee.title}</div>
                <div>{guarantee.subtitle}</div>
                <div className="text-sm text-muted-foreground mt-2">{guarantee.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Psychology-First Development Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Other platforms sell shortcuts and signals. We build lasting discipline and mental strength.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Mental Game Focus</h3>
                <p className="text-sm text-muted-foreground">Develop the psychological strength that successful trading requires.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Structured Growth</h3>
                <p className="text-sm text-muted-foreground">Follow proven frameworks for consistent trader development.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Personal Mentorship</h3>
                <p className="text-sm text-muted-foreground">Learn from experienced traders who've walked the same path.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Measurable Progress</h3>
                <p className="text-sm text-muted-foreground">Track your psychological growth with detailed analytics.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Yourself as a Trader?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of traders who've stopped gambling and started developing real discipline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/auth/sign-up">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Your Development Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
