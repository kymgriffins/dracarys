// Premium Pricing Component for Trader Development Platform
// Built with shadcn/ui, focused on mentorship tiers

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowRight, BookOpen, Users, Target, TrendingUp, Shield, Zap, Heart, Brain, Trophy } from "lucide-react";

export default function PremiumPricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6">
            <Star className="w-4 h-4 mr-2" />
            Trader Development Memberships
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Master Your Trading Mindset
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional mentorship and psychology-driven tools to transform you from a gambler into a disciplined trader.
          </p>
        </div>

        {/* Premium Focus Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold">Psychology-First Trading Education</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our premium memberships focus exclusively on mental game development, journaling mastery,
            and personalized mentorship. No market data, no signals, no shortcuts. Just real trader growth.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Core Membership */}
          <Card className="border-2">
            <CardHeader className="text-center pb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Core Membership</CardTitle>
              <CardDescription className="text-base">Self-directed trader development</CardDescription>
              <div className="text-4xl font-bold mt-4">
                $97
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Cancel anytime</div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Unlimited journaling with AI insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Psychology Engine 2.0 (bias tracking)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Deep performance analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Custom routines builder</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Goal ladder framework</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Educational psychology library</span>
                </div>
              </div>

              <Link href="/auth/sign-up">
                <Button className="w-full" size="lg">
                  Start Core Journey
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Accelerated Program - Most Popular */}
          <Card className="border-2 border-primary shadow-2xl scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
            </div>

            <CardHeader className="text-center pb-8 pt-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Accelerated Program</CardTitle>
              <CardDescription className="text-base">Mentor-guided development</CardDescription>
              <div className="text-4xl font-bold mt-4">
                $297
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">3-month commitment</div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-primary font-semibold">
                  <Check className="w-5 h-5" />
                  <span>Everything in Core +</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Dedicated mentor assignment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Weekly mentor coaching calls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Mentor-reviewed journal entries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Live trade walkthroughs (educational)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Personal playbook development</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Monthly progress deep-dives</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Educational alerts feed</span>
                </div>
              </div>

              <Link href="/auth/sign-up">
                <Button className="w-full" size="lg" variant="default">
                  Start Accelerated Growth
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Elite Mastery Program */}
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
            <CardHeader className="text-center pb-8">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">Elite Mastery</CardTitle>
              <CardDescription className="text-base">Intensive elite trader development</CardDescription>
              <div className="text-4xl font-bold mt-4">
                $997
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">6-month transformation</div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-700 font-semibold">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>Everything in Accelerated +</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>1-on-1 elite mentor (40+ years experience)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>Bi-weekly coaching sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>Real-time psychology consultations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>Custom 90-day playbook creation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>Dedicated discord channel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>Priority educational alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>Unlimited mentor messaging</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="lg" style={{borderColor: '#d97706', color: '#d97706'}}>
                Apply for Elite Program
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Psychology Guarantee */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 mb-16">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-green-800">Psychology-First Guarantee</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">30-Day</div>
              <div className="text-green-800">Money Back Guarantee</div>
              <div className="text-sm text-green-600 mt-2">No market risk required</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">90-Day</div>
              <div className="text-blue-800">Transformation Commitment</div>
              <div className="text-sm text-blue-600 mt-2">Focus on your mental game</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Lifetime</div>
              <div className="text-purple-800">Access to Psychology Tools</div>
              <div className="text-sm text-purple-600 mt-2">Built for long-term growth</div>
            </div>
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

        {/* Membership Comparison Table */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Membership Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-semibold">Features</th>
                  <th className="p-4 text-center font-semibold">Core</th>
                  <th className="p-4 text-center font-semibold">Accelerated</th>
                  <th className="p-4 text-center font-semibold text-amber-700">Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Journaling & Analytics</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-amber-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Psychology Engine</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-amber-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Custom Routines</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-amber-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Educational Content</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-amber-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Mentor Assignment</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-amber-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Weekly Coaching Calls</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-amber-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Live Trade Walkthroughs</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center">Priority</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">1-on-1 Elite Mentors</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-amber-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
