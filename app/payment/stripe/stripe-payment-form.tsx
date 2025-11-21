"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface PlanDetails {
  name: string;
  price: number;
  interval: string;
  features: string[];
}

const planDetails: { [key: string]: PlanDetails } = {
  normal: {
    name: "Normal Plan",
    price: 1000,
    interval: "year",
    features: [
      "All Free features",
      "Enhanced charting tools",
      "Extended historical data",
      "Advanced risk management",
      "Portfolio analytics",
      "Email support"
    ]
  },
  premium: {
    name: "Premium Plan",
    price: 3000,
    interval: "year",
    features: [
      "All Normal features",
      "Trading signals",
      "One-on-one coaching",
      "Personal strategy sessions",
      "Priority support",
      "Dedicated account manager"
    ]
  }
};

export function StripePaymentForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const planDetail = plan ? planDetails[plan] : null;

  const handleStripePayment = async () => {
    if (!planDetail) return;

    setIsProcessing(true);

    // Simulate Stripe checkout process
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      // Simulate storing payment status
      localStorage.setItem("lastPayment", JSON.stringify({
        plan: plan,
        amount: planDetail.price,
        method: "stripe",
        timestamp: new Date().toISOString(),
        status: "completed"
      }));

      // Redirect to success page after animation
      setTimeout(() => {
        window.location.href = "/payment/success";
      }, 2000);
    }, 3000);
  };

  if (!planDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Invalid Plan</CardTitle>
            <CardDescription>Please select a valid plan to proceed with payment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">Payment Successful!</CardTitle>
            <CardDescription>Redirecting you to confirmation page...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <Link href="/pricing" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{planDetail.name}</span>
                <span className="text-2xl font-bold">${planDetail.price}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Billed {planDetail.interval}ly
              </div>
              <hr />
              <div className="space-y-2">
                <h4 className="font-medium">What's included:</h4>
                <ul className="space-y-1 text-sm">
                  {planDetail.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Stripe Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Stripe</Badge>
                Secure Payment
              </CardTitle>
              <CardDescription>
                Complete your payment securely with Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dummy payment form - in real app, use Stripe Elements */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full p-3 border rounded-lg"
                    defaultValue="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 border rounded-lg"
                      defaultValue="12/25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 border rounded-lg"
                      defaultValue="123"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStripePayment}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay ${planDetail.price} with Stripe
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your payment is secured by Stripe. Test card: 4242 4242 4242 4242
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
