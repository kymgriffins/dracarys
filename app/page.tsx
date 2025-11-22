import { CTASection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navigation } from "@/components/navigation";
import { PricingPlans } from "@/components/pricing-plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pricingTiers } from "@/lib/pricing-data";
import { ArrowRight, Award, Brain, Check, CheckCircle, Heart, Shield, Target, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function Home(): React.ReactNode {
  const previewPricingTiers = pricingTiers.slice(0, 3); // Show first 3 tiers on home page

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      <HeroSection />

      {/* Mission & Psychology Focus */}
      {/* <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-6">
              <Heart className="w-4 h-4 mr-2" />
              Yean, Learn, Earn
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Dominate The Markets
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're not another trading platform. We're a psychology development system that transforms gamblers into disciplined professionals through proven mental training techniques.
            </p>
          </div>
        </div>
      </section> */}

      {/* <FeaturesSection /> */}

      {/* Why Psychology-First Works */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Psychology-First Development Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Other platforms sell shortcuts and signals. We build lasting discipline and mental strength through evidence-based methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <Brain className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Mental Game Focus</h3>
                <p className="text-sm text-muted-foreground">Develop the psychological strength that successful trading requires.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <Target className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Structured Growth</h3>
                <p className="text-sm text-muted-foreground">Follow proven frameworks for consistent trader development.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Personal Mentorship</h3>
                <p className="text-sm text-muted-foreground">Learn from experienced traders who've walked the same path.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Measurable Progress</h3>
                <p className="text-sm text-muted-foreground">Track your psychological growth with detailed analytics.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Get With Dracarys</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade trading psychology tools and mentorship designed for serious traders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Unlimited AI-Powered Journaling</h3>
                  <p className="text-muted-foreground">Log trades with advanced emotional tracking and AI insights that identify your psychological patterns.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Psychology Engine 2.0</h3>
                  <p className="text-muted-foreground">Automated detection of cognitive biases, confidence monitoring, and risk tolerance assessment.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personal Mentor Assignment</h3>
                  <p className="text-muted-foreground">Get paired with experienced traders for weekly coaching calls and personalized development plans.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Custom Routines & Frameworks</h3>
                  <p className="text-muted-foreground">Build pre-session checklists, goal ladders, and personalized trading rituals that work for you.</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Platform Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Traders</span>
                  <span className="font-medium">100K+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Journal Entries Processed</span>
                  <span className="font-medium">2M+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trading Biases Detected</span>
                  <span className="font-medium">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Uptime</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mentor Sessions Completed</span>
                  <span className="font-medium">50K+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Development Path</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Start your psychological trading transformation with flexible plans designed for different trader needs.
            </p>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Full Pricing Details
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <PricingPlans
            tiers={previewPricingTiers}
            showTable={false}
          />
        </div>
      </section>

      {/* Company Story & Values Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <Badge variant="secondary" className="mb-6">
                <Award className="w-4 h-4 mr-2" />
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built by Traders, for Traders</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Founded by experienced traders frustrated with platform limitations, Dracarys was built to solve the real problem: winning at trading starts with winning in your mind first.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Former hedge fund traders & trading psychologists</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Research-backed behavioral finance methods</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Enterprise-grade security & compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Continuous innovation & improvement</span>
                </div>
              </div>
              <Link href="/about">
                <Button variant="outline">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Innovation First</h3>
                    <p className="text-sm text-muted-foreground">Constantly pushing technological boundaries</p>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Trust & Security</h3>
                    <p className="text-sm text-muted-foreground">Enterprise-grade security for your data</p>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Community Focus</h3>
                    <p className="text-sm text-muted-foreground">Building for the trading community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />

      <div className="text-center pb-12">
        <p className="text-sm text-muted-foreground mb-6">Explore more details on our dedicated pages:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/features">
            <Button variant="outline" size="sm">🔧 View All Features</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="sm">💰 Complete Pricing</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="sm">🏢 Our Story & Team</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
