import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Shield, Award, TrendingUp, ArrowRight, CheckCircle, Star, Globe } from "lucide-react";

export default function AboutPage() {
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
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-foreground hover:text-foreground/80 transition-colors font-medium">
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
            <Award className="w-4 h-4 mr-2" />
            Leading Trading Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Empowering Traders Worldwide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dracarys is revolutionizing the trading industry with cutting-edge technology and innovative solutions that help traders achieve consistent profits.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100K+</div>
            <div className="text-muted-foreground">Active Traders</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">$2.1T+</div>
            <div className="text-muted-foreground">Daily Volume Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Platform Uptime</div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To democratize professional-grade trading tools and empower traders of all levels with the same technology used by Wall Street institutions. We believe that success in trading should be determined by skill, strategy, and discipline—not by access to expensive tools or insider information.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a small team of passionate traders to a global trading platform trusted by professionals worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">2019</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">The Beginning</h3>
                    <p className="text-muted-foreground">Founded by a team of experienced traders frustrated with existing platform limitations and high costs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">2020</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">First Product Launch</h3>
                    <p className="text-muted-foreground">Released our first trading platform with innovative features that set new industry standards.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">2022</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Growth & Expansion</h3>
                    <p className="text-muted-foreground">Reached 10,000 active users and expanded our team with world-class engineers and trading experts.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">2025</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Industry Leadership</h3>
                    <p className="text-muted-foreground">Now serving over 100,000 traders worldwide with industry-leading performance and reliability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Why We're Different</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Built by traders, for traders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Cutting-edge technology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Enterprise-grade security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Continuous innovation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Transparent pricing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A diverse team of experts united by their passion for trading innovation and commitment to trader success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">John Chen</CardTitle>
              <CardDescription>CEO & Co-Founder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Former hedge fund trader with 15+ years of experience. Passionate about democratizing trading technology.</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Sarah Martinez</CardTitle>
              <CardDescription>CTO & Co-Founder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Former Google engineer and fintech pioneer. Leads our technology innovation and platform development.</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Marcus Johnson</CardTitle>
              <CardDescription>Head of Trading Strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Former quantitative analyst at Goldman Sachs. Develops our advanced trading algorithms and risk models.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Innovation First</h3>
              <p className="text-muted-foreground">We constantly push technological boundaries to provide cutting-edge trading solutions.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Trust & Security</h3>
              <p className="text-muted-foreground">Your data and funds are our top priority, protected by enterprise-grade security.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Community Focus</h3>
              <p className="text-muted-foreground">We build for the trading community, fostering education and collaboration.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Excellence</h3>
              <p className="text-muted-foreground">We maintain the highest standards in everything we build and every interaction we have.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Awards & Recognition</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Industry recognition for our commitment to innovation and excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">Best Trading Platform 2025</CardTitle>
              <CardDescription>Fintech Awards</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Star className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">Top 10 Fintech Startup</CardTitle>
              <CardDescription>TechCrunch Awards</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">Innovation Leader</CardTitle>
              <CardDescription>Forbes Asia</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Start your trading journey with the platform trusted by thousands of successful traders worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Explore Features
                </Button>
              </Link>
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
