"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Smartphone, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
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

function MpesaPaymentPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStkSent, setIsStkSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const planDetail = plan ? planDetails[plan] : null;

  const handleMpesaPayment = async () => {
    if (!planDetail || !phoneNumber) return;

    setIsProcessing(true);

    // Simulate STK Push
    setTimeout(() => {
      setIsProcessing(false);
      setIsStkSent(true);
      setCountdown(120); // 2 minutes countdown
    }, 2000);
  };

  const handlePaymentConfirmation = () => {
    setIsCompleted(true);

    // Simulate storing payment status
    localStorage.setItem("lastPayment", JSON.stringify({
      plan: plan,
      amount: planDetail!.price,
      method: "mpesa",
      phone: phoneNumber,
      timestamp: new Date().toISOString(),
      status: "completed"
    }));

    // Redirect to success page after animation
    setTimeout(() => {
      window.location.href = "/payment/success";
    }, 2000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsStkSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

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
                <Smartphone className="w-5 h-5" />
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

          {/* M-Pesa Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">M-Pesa</Badge>
                Mobile Payment
              </CardTitle>
              <CardDescription>
                Pay securely using your M-Pesa mobile wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isStkSent ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        M-Pesa Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="254712345678"
                        className="w-full p-3 border rounded-lg"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter your M-Pesa registered phone number (254XXXXXXXXX)
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleMpesaPayment}
                    disabled={isProcessing || !phoneNumber}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending STK Push...
                      </>
                    ) : (
                      <>
                        Pay ${planDetail.price} with M-Pesa
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">STK Push Sent</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      A payment request has been sent to your phone: <strong>{phoneNumber}</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Time remaining: <strong>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</strong>
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Manual Payment Instructions:</h4>
                    <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                      <li>Check your phone for the M-Pesa STK push notification</li>
                      <li>Enter your M-Pesa PIN to authorize the payment</li>
                      <li>Wait for the confirmation message</li>
                      <li>Click "Confirm Payment" below once completed</li>
                    </ol>
                  </div>

                  <Button
                    onClick={handlePaymentConfirmation}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Confirm Payment Completed
                  </Button>

                  <Button
                    onClick={() => setIsStkSent(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Try Different Number
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Payments processed securely through Safaricom M-Pesa
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MpesaPaymentPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <MpesaPaymentPage />
    </Suspense>
  );
}

export default MpesaPaymentPageWrapper;
