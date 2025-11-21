import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, TrendingUp, Users, Target, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Dracarys</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
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
      <section className="container mx-auto px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-8">
            🚀 Now in Beta
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Trade Like a Dragon
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Professional-grade trading platform with advanced analytics, real-time market data, and portfolio management tools for serious traders.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-10 py-8 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Trading Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-10 py-8 hover:bg-muted/50 transition-all duration-300">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and insights designed for traders who demand excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Advanced Charts</CardTitle>
              <CardDescription>
                Interactive charts with technical indicators, multiple timeframes, and drawing tools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Market Analysis</CardTitle>
              <CardDescription>
                Real-time market data, sentiment analysis, and predictive insights for informed decisions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Target className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Risk Management</CardTitle>
              <CardDescription>
                Advanced stop-loss, take-profit, and position sizing tools to protect your capital.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Portfolio Tracking</CardTitle>
              <CardDescription>
                Comprehensive portfolio analytics, performance tracking, and detailed reporting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Secure & Compliant</CardTitle>
              <CardDescription>
                Enterprise-grade security with regulatory compliance and data encryption.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Zap className="w-12 h-12 text-primary mb-4" />
              <CardTitle>High Performance</CardTitle>
              <CardDescription>
                Lightning-fast execution with low latency connections to major exchanges.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{"<10ms"}</div>
              <div className="text-muted-foreground">Average Latency</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2.1T+</div>
              <div className="text-muted-foreground">Daily Volume Tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Trading?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of traders who have already upgraded their performance with Dracarys.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-12 py-6">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Dracarys</span>
            </div>
          </div>
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Dracarys. All rights reserved. Professional trading platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
