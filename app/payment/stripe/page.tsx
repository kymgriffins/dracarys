"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Star
} from "lucide-react";
import { PAYMENT_PLANS } from "@/lib/types/payment";

function PaymentForm() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Handle success
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip">ZIP Code</Label>
          <Input
            id="zip"
            placeholder="12345"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Pay Securely with Stripe
          </>
        )}
      </Button>
    </form>
  );
}

function StripePaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'premium';
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const plan = PAYMENT_PLANS[planId];

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      router.push('/app/dashboard?payment=success');
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    setErrorMessage(error);
  };

  useEffect(() => {
    const initializePayment = () => {
      // Simulate loading payment intent
      setTimeout(() => {
        // Success initialization
      }, 1000);
    };

    initializePayment();
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-destructive mb-2">Invalid Plan</h2>
            <p className="text-muted-foreground">The selected plan is not available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push('/app/settings')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Secure Payment</h1>
            <p className="text-muted-foreground">Stripe-powered secure checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {plan.name} - Stripe Payment
                </CardTitle>
                <CardDescription>
                  Enter your payment details below
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentStatus === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h3>
                    <p className="text-muted-foreground">
                      Welcome to your new plan! Redirecting...
                    </p>
                  </div>
                ) : paymentStatus === 'error' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-800">Payment Failed</span>
                    </div>
                    <p className="text-sm text-red-700">
                      {errorMessage || "Payment failed. Please try again."}
                    </p>
                  </div>
                ) : (
                  <PaymentForm />
                )}
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">SSL Encrypted</p>
                  <p className="text-sm text-green-600">256-bit SSL encryption protects your data</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${plan.price}</p>
                    <p className="text-sm text-muted-foreground">/{plan.interval}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-green-700">✓ You'll Get:</h4>
                  <ul className="space-y-1 text-sm">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-muted-foreground text-xs">
                        + {plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Lorde of Merchants Mention */}
                {planId === 'mentoring' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-800">Personal Lorde of Merchants Access</p>
                        <p className="text-sm text-purple-600">Get direct mentorship from trading's master teacher</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Today</span>
                    <span>${plan.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cancel anytime. No setup fees.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Secure
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Encrypted
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                PCI Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StripePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment page...</p>
        </div>
      </div>
    }>
      <StripePaymentPageContent />
    </Suspense>
  );
}
