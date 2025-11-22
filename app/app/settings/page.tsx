"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const paymentMethods = [
  {
    name: "M-Pesa",
    icon: "📱",
    description: "Mobile money payments for East Africa",
    fees: "2.5% + KES 1",
    available: true
  },
  {
    name: "Bitcoin",
    icon: "₿",
    description: "Cryptocurrency payments",
    fees: "0.5% network fee",
    available: true
  },
  {
    name: "Visa/Mastercard",
    icon: "💳",
    description: "Credit and debit card payments",
    fees: "2.9% + USD 0.30",
    available: true
  },
  {
    name: "Stripe",
    icon: "⚡",
    description: "Secure card payments via Stripe",
    fees: "2.9% + USD 0.30",
    available: true
  }
];

const tabs = ["profile", "upgrade", "billing"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("billing");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and upgrade your experience
            </p>
          </div>
          <Badge variant="secondary">STUDENT</Badge>
        </div>

        {/* Lorde of Merchants Mentor Section */}
        <Card className="mb-8 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">👑</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Lorde of Merchants</h2>
            <h3 className="text-lg text-purple-600 mb-4">Master Trading Mentor</h3>
            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="font-bold text-xl">5.0 ⭐</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">1247+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">94%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">
              Master of Technical Analysis • Psychology • Risk Management
            </Badge>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "secondary" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Current Plan: Free</CardTitle>
              <CardDescription>
                Upgrade to access premium features and mentorship with Lorde of Merchants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Upgrade Account</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "upgrade" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle>Premium Plan</CardTitle>
                <CardDescription>$29/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li>✓ Unlimited journaling</li>
                  <li>✓ Trading signals</li>
                  <li>✓ Live streams</li>
                  <li>✓ Community access</li>
                </ul>
                <Button className="w-full bg-green-600">Start Premium Trial</Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle>Mentoring Pro</CardTitle>
                <CardDescription>$99/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li>✓ All Premium features</li>
                  <li>✓ 1-on-1 with Lorde of Merchants</li>
                  <li>✓ Personal strategy development</li>
                  <li>✓ Custom trading plans</li>
                  <li>✓ Priority support</li>
                </ul>
                <Button className="w-full bg-purple-600">Start Mentoring Pro</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Choose your preferred payment method to upgrade to premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods.map((method) => (
                    <Card key={method.name} className="hover:border-primary transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-2xl">{method.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                          {method.available && (
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Fees:</span>
                            <span className="text-green-600 font-semibold">{method.fees}</span>
                          </div>

                          {method.name === "M-Pesa" && (
                            <div className="text-sm">
                              <span className="font-medium">Currencies:</span>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline">KES</Badge>
                                <Badge variant="outline">TZS</Badge>
                                <Badge variant="outline">UGX</Badge>
                              </div>
                            </div>
                          )}

                          {method.name === "Bitcoin" && (
                            <div className="text-sm">
                              <span className="font-medium">Currencies:</span>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline">BTC</Badge>
                                <Badge variant="outline">USDT</Badge>
                                <Badge variant="outline">ETH</Badge>
                              </div>
                            </div>
                          )}

                          {(method.name === "Visa/Mastercard" || method.name === "Stripe") && (
                            <div className="text-sm">
                              <span className="font-medium">Currencies:</span>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline">USD</Badge>
                                <Badge variant="outline">EUR</Badge>
                                <Badge variant="outline">GBP</Badge>
                                <Badge variant="outline">KES</Badge>
                              </div>
                            </div>
                          )}
                        </div>

                        <Button className="w-full" variant="outline">
                          {method.available ? `Pay with ${method.name}` : 'Coming Soon'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    🔒 Secure Payment Processing
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All payments are processed securely using industry-standard encryption.
                    We never store sensitive payment information on our servers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Call to Action */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Master Trading with Lorde of Merchants?</h3>
                <p className="text-muted-foreground mb-6">
                  Choose your payment method above and start your transformation today
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="bg-purple-600">
                    Start Premium - $29/mo
                  </Button>
                  <Button size="lg" variant="outline" className="border-purple-300 text-purple-700">
                    Start Mentoring Pro - $99/mo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
