import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowRight, TrendingUp } from "lucide-react";

export default function PricingPage() {
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
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Master Your Trading Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From trade journaling to personalized coaching. Level up your trading psychology and strategy.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription className="text-base">Perfect for getting started</CardDescription>
              <div className="text-4xl font-bold mt-4">
                $0
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Always discounted</div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Basic charts & indicators (10)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Limited chart timeframes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Historical data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Portfolio tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Basic risk management</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Normal Plan */}
          <Card className="border-2 border-primary shadow-2xl scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
            </div>

            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-2xl">Normal</CardTitle>
              <CardDescription className="text-base">Essential tools for traders</CardDescription>
              <div className="text-4xl font-bold mt-4">
                $1,000
                <span className="text-lg font-normal text-muted-foreground">/year</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Billed annually</div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>All Free features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Enhanced charting tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Extended historical data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Advanced risk management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Portfolio analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Email support</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg" variant="default" asChild>
                  <Link href="/payment/stripe?plan=normal">
                    Pay with Card
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/payment/mpesa?plan=normal">
                      M-Pesa
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/payment/crypto?plan=normal">
                      Crypto
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 hover:border-primary/50 transition-colors bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription className="text-base">Ultimate trading experience</CardDescription>
              <div className="text-4xl font-bold mt-4">
                $3,000
                <span className="text-lg font-normal text-muted-foreground">/year</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Billed annually</div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>All Normal features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Trading signals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>One-on-one coaching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Personal strategy sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Dedicated account manager</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href="/payment/stripe?plan=premium">
                    Pay with Card
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/payment/mpesa?plan=premium">
                      M-Pesa
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/payment/crypto?plan=premium">
                      Crypto
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare All Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to elevate your trading performance.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="font-semibold p-4">Features</div>
              <div className="text-center font-semibold p-4">Free</div>
              <div className="text-center font-semibold p-4 text-primary">Normal</div>
              <div className="text-center font-semibold p-4">Premium</div>
            </div>

            <div className="bg-background rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
                <div>Market data</div>
                <div className="text-center text-sm text-muted-foreground">Historical only</div>
                <div className="text-center text-sm text-muted-foreground">Historical only</div>
                <div className="text-center text-sm text-muted-foreground">Historical only</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
                <div>Technical indicators</div>
                <div className="text-center text-sm text-muted-foreground">Basic (10)</div>
                <div className="text-center text-sm font-medium">Basic (10)</div>
                <div className="text-center text-sm font-medium">Basic (10)</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
                <div>Chart timeframes</div>
                <div className="text-center text-sm text-muted-foreground">Limited</div>
                <div className="text-center text-sm font-medium">Limited</div>
                <div className="text-center text-sm font-medium">Limited</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
                <div>Portfolio analytics</div>
                <Check className="w-5 h-5 text-primary mx-auto" />
                <Check className="w-5 h-5 text-primary mx-auto" />
                <Check className="w-5 h-5 text-primary mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
                <div>Risk management tools</div>
                <div className="text-center text-sm text-muted-foreground">Basic</div>
                <div className="text-center text-sm font-medium">Advanced</div>
                <div className="text-center text-sm font-medium">Advanced</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
                <div>Trading signals</div>
                <div className="text-center">❌</div>
                <div className="text-center">❌</div>
                <Check className="w-5 h-5 text-primary mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
                <div>One-on-one coaching</div>
                <div className="text-center">❌</div>
                <div className="text-center">❌</div>
                <Check className="w-5 h-5 text-primary mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                <div>Priority support</div>
                <div className="text-center">❌</div>
                <div className="text-center">❌</div>
                <Check className="w-5 h-5 text-primary mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about getting started.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="border-b pb-8">
            <h3 className="text-lg font-semibold mb-4">Can I cancel my subscription anytime?</h3>
            <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
          </div>

          <div className="border-b pb-8">
            <h3 className="text-lg font-semibold mb-4">Do you offer a free trial?</h3>
            <p className="text-muted-foreground">Yes! We offer a 14-day free trial for all paid plans. No credit card required to get started.</p>
          </div>

          <div className="border-b pb-8">
            <h3 className="text-lg font-semibold mb-4">What's included in the free plan?</h3>
            <p className="text-muted-foreground">The free plan includes basic charts with 10 technical indicators, limited chart timeframes, historical market data, portfolio tracking, and basic risk management features.</p>
          </div>

          <div className="border-b pb-8">
            <h3 className="text-lg font-semibold mb-4">Do you offer refunds?</h3>
            <p className="text-muted-foreground">We offer a 30-day money-back guarantee for all paid subscriptions. If you're not satisfied, we'll refund your payment.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Trading Like a Pro?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Join thousands of traders who've already upgraded their performance with Dracarys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Dracarys</span>
            </Link>
          </div>
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Dracarys. All rights reserved. Professional trading platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
