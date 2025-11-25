"use client";

import { CTASection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navigation } from "@/components/navigation";
import { PricingPlans } from "@/components/pricing-plans";
import { AnimatedStats } from "@/components/animated-stats";
import { ParticleField, GeometricParticles } from "@/components/particle-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pricingTiers } from "@/lib/pricing-data";
import { ArrowRight, Award, Brain, Check, CheckCircle, Heart, Shield, Target, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";

export default function Home(): React.ReactNode {
  const previewPricingTiers = pricingTiers.slice(0, 3); // Show first 3 tiers on home page

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 relative overflow-hidden">
      {/* Background particle effects */}
      <ParticleField count={40} className="opacity-60" />
      <GeometricParticles count={20} className="opacity-40" />

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
      <motion.section
        className="bg-muted/50 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
              Why Psychology-First Development Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Other platforms sell shortcuts and signals. We build lasting discipline and mental strength through evidence-based methods.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Brain, title: "Mental Game Focus", desc: "Develop the psychological strength that successful trading requires." },
              { icon: Target, title: "Structured Growth", desc: "Follow proven frameworks for consistent trader development." },
              { icon: Users, title: "Personal Mentorship", desc: "Learn from experienced traders who've walked the same path." },
              { icon: TrendingUp, title: "Measurable Progress", desc: "Track your psychological growth with detailed analytics." }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="text-center border-0 shadow-sm backdrop-blur-sm bg-gradient-to-br from-card/80 to-card/60 border border-white/10 hover:border-primary/20 transition-all duration-300">
                  <CardContent className="pt-6">
                    <motion.div
                      className="flex justify-center mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <item.icon className="w-12 h-12 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Core Features Preview */}
      <motion.section
        className="py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
              What You Get With Dracarys
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade trading psychology tools and mentorship designed for serious traders.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Unlimited AI-Powered Journaling",
                  desc: "Log trades with advanced emotional tracking and AI insights that identify your psychological patterns."
                },
                {
                  title: "Psychology Engine 2.0",
                  desc: "Automated detection of cognitive biases, confidence monitoring, and risk tolerance assessment."
                },
                {
                  title: "Personal Mentor Assignment",
                  desc: "Get paired with experienced traders for weekly coaching calls and personalized development plans."
                },
                {
                  title: "Custom Routines & Frameworks",
                  desc: "Build pre-session checklists, goal ladders, and personalized trading rituals that work for you."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start space-x-4 group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-6 h-6 mt-1 flex-shrink-0 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <AnimatedStats />
            </motion.div>
          </div>
        </div>
      </motion.section>

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
