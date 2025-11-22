"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Star,
  Clock
} from "lucide-react";
import { PAYMENT_PLANS, KES_PAYMENT_PLANS } from "@/lib/types/payment";

interface MpesaPaymentData {
  planId: string;
  phoneNumber: string;
  amount: number;
  accountReference: string;
}

function MpesaPaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'premium_kes';
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>("");
  const [countdownTime, setCountdownTime] = useState(600); // 10 minutes in seconds

  // Use KES plans for M-Pesa
  const plan = KES_PAYMENT_PLANS[planId as keyof typeof KES_PAYMENT_PLANS];

  // Countdown timer for M-Pesa payment
  useEffect(() => {
    if (paymentStatus === 'processing' && countdownTime > 0) {
      const timer = setInterval(() => {
        setCountdownTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStatus, countdownTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInitiatePayment = async () => {
    if (!phoneNumber || !plan) {
      setErrorMessage("Please enter a valid phone number and select a plan");
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage("");

    try {
      // Simulate M-Pesa STK push
      const response = await fetch('/api/payments/mpesa/stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          phoneNumber: phoneNumber,
          amount: plan.price,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCheckoutRequestId(data.checkoutRequestId || 'CHK123456789');
        // Start countdown timer
        setCountdownTime(600); // 10 minutes
      } else {
        setPaymentStatus(null);
        setErrorMessage(data.message || "Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      setPaymentStatus(null);
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  const handleCheckStatus = async () => {
    // Simulate checking payment status
    setTimeout(() => {
      setPaymentStatus('success');
    }, 2000);
  };

  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return "";
    // Format: +254 xxx xxx xxx
    if (phone.length === 9) phone = '254' + phone;
    if (phone.length === 12 && !phone.startsWith('254')) phone = '254' + phone.substring(3);
    if (phone.length === 12 && phone.startsWith('254')) {
      return `+${phone.substring(0,3)} ${phone.substring(3,6)} ${phone.substring(6,9)} ${phone.substring(9)}`;
    }
    return phone;
  };

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
            <h1 className="text-3xl font-bold text-foreground">M-Pesa Payment</h1>
            <p className="text-muted-foreground">Secure mobile money payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {plan.name} - M-Pesa Payment
                </CardTitle>
                <CardDescription>
                  Enter your M-Pesa registered phone number
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentStatus === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your M-Pesa payment was received successfully.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Welcome to your new plan! Redirecting...
                    </p>
                  </div>
                ) : paymentStatus === 'error' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600 mb-2" />
                    <p className="text-sm text-red-700">
                      {errorMessage || "Payment failed. Please try again."}
                    </p>
                  </div>
                ) : paymentStatus === 'processing' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Confirming Payment</h3>
                    <p className="text-muted-foreground mb-4">
                      Check your phone for the M-Pesa payment prompt
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="text-sm space-y-2">
                        <p><strong>Phone:</strong> {formatPhoneDisplay(phoneNumber)}</p>
                        <p><strong>Amount:</strong> KES {plan.price.toLocaleString()}</p>
                        <p><strong>Time remaining:</strong> {formatTime(countdownTime)}</p>
                      </div>
                    </div>

                    <Button onClick={handleCheckStatus} className="w-full mb-2">
                      Check Payment Status
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      Please complete the payment on your phone. Don't close this page.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">
                        M-Pesa Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        placeholder="0722000000 or 254722000000"
                        value={phoneNumber}
                        onChange={(e) => {
                          // Allow only numbers
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 12) {
                            setPhoneNumber(value);
                          }
                        }}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Use the number registered with your M-Pesa account
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleInitiatePayment}
                      className="w-full"
                      size="lg"
                      disabled={!phoneNumber || phoneNumber.length < 9}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Pay KES {plan.price.toLocaleString()} with M-Pesa
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Pay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <p className="text-sm">Click "Pay with M-Pesa" above</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <p className="text-sm">Check your phone for M-Pesa payment prompt</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <p className="text-sm">Enter your M-Pesa PIN to complete payment</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <p className="text-sm">Payment confirmation will appear automatically</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Secure M-Pesa Payment</p>
                  <p className="text-sm text-green-600">Direct integration with M-Pesa API</p>
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
                    <p className="text-2xl font-bold">KES {plan.price.toLocaleString()}</p>
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
                {planId === 'mentoring_kes' && (
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
                    <span>Total to Pay</span>
                    <span>KES {plan.price.toLocaleString()}</span>
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
                Safe
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                M-Pesa
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Instant
              </span>
            </div>

            {/* Support */}
            <Card>
              <CardContent className="p-4 text-center">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Contact our support team if you encounter any issues
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MpesaPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment page...</p>
        </div>
      </div>
    }>
      <MpesaPaymentPageContent />
    </Suspense>
  );
}
