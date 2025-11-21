import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, BarChart3, TrendingUp, Users, Target, Shield, Zap, CheckCircle, Sparkles } from "lucide-react";

export default function FeaturesPage() {
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
            <Link href="/features" className="text-foreground hover:text-foreground/80 transition-colors font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
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
            <Sparkles className="w-4 h-4 mr-2" />
            Advanced Trading Features
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Everything You Need to Dominate the Markets
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade tools and analytics designed for serious traders who demand excellence and precision.
          </p>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Advanced Charts</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Interactive charts with 50+ technical indicators, multiple timeframes, and advanced drawing tools for precise analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">50+ Indicators</Badge>
                <Badge variant="outline">Multi-Timeframe</Badge>
                <Badge variant="outline">Drawing Tools</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Market Analysis</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Real-time market data, sentiment analysis, and predictive insights powered by AI to stay ahead of market movements.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Real-time Data</Badge>
                <Badge variant="outline">AI Insights</Badge>
                <Badge variant="outline">Sentiment Analysis</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <Target className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Risk Management</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Advanced stop-loss, take-profit, and position sizing tools with automated risk calculation for capital protection.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Auto Stop-Loss</Badge>
                <Badge variant="outline">Position Sizing</Badge>
                <Badge variant="outline">Risk Calculator</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Portfolio Tracking</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Comprehensive portfolio analytics, performance tracking, and detailed reporting with customizable dashboards.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Performance Analytics</Badge>
                <Badge variant="outline">Custom Reports</Badge>
                <Badge variant="outline">Live Tracking</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Secure & Compliant</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Enterprise-grade security with 256-bit encryption, regulatory compliance, and secure API connections.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">256-bit Encryption</Badge>
                <Badge variant="outline">SOC 2 Compliant</Badge>
                <Badge variant="outline">Secure APIs</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Lightning Fast</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Sub-millisecond execution with low latency connections to major exchanges and real-time data streaming.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">1ms Latency</Badge>
                <Badge variant="outline">Real-time Streaming</Badge>
                <Badge variant="outline">99.9% Uptime</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Trading Capabilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tools that give you a competitive edge in the markets.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Algorithmic Trading</h3>
                  <p className="text-muted-foreground">Create and backtest custom algorithms with our powerful scripting engine.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Options Analysis</h3>
                  <p className="text-muted-foreground">Advanced options strategies with Greeks calculation and risk analysis.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Multi-Asset Support</h3>
                  <p className="text-muted-foreground">Trade stocks, forex, crypto, futures, and commodities from one platform.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Social Trading</h3>
                  <p className="text-muted-foreground">Follow successful traders and copy their strategies automatically.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">Premium customer support with dedicated trading specialists.</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Charts per second</span>
                  <span className="font-medium">120 FPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data latency</span>
                  <span className="font-medium">10ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API uptime</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Security rating</span>
                  <span className="font-medium">A+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concurrent users</span>
                  <span className="font-medium">50,000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Professional Trading?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your free trial today and unlock the full power of Dracarys trading platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">No credit card required • 14-day free trial • Cancel anytime</p>
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
