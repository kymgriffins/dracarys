"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, ArrowRight, CreditCard, Smartphone, Bitcoin, Home, Check } from "lucide-react";
import Link from "next/link";

interface PaymentDetails {
  plan: string;
  amount: number;
  method: string;
  timestamp: string;
  status: string;
  crypto?: string;
  cryptoAmount?: string;
  phone?: string;
}

export default function PaymentSuccessPage() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Get payment details from localStorage
    const paymentData = localStorage.getItem("lastPayment");
    if (paymentData) {
      setPaymentDetails(JSON.parse(paymentData));
    }
  }, []);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "stripe":
        return <CreditCard className="w-5 h-5" />;
      case "mpesa":
        return <Smartphone className="w-5 h-5" />;
      case "crypto":
        return <Bitcoin className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "stripe":
        return "Stripe";
      case "mpesa":
        return "M-Pesa";
      case "crypto":
        return "Cryptocurrency";
      default:
        return "Payment";
    }
  };

  const handleDownloadReceipt = () => {
    setIsDownloading(true);

    // Simulate receipt download
    setTimeout(() => {
      const receiptData = {
        transactionId: `TXN-${Date.now()}`,
        date: new Date().toLocaleString(),
        ...paymentDetails,
        customerEmail: "lordeofmerchants@gmail.com"
      };

      const dataStr = JSON.stringify(receiptData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `receipt-${receiptData.transactionId}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      setIsDownloading(false);
    }, 1000);
  };

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Retrieving your payment information</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to Dracarys! Your subscription has been activated.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPaymentIcon(paymentDetails.method)}
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Plan:</span>
                <Badge variant="secondary" className="capitalize">
                  {paymentDetails.plan} Plan
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Amount:</span>
                <span className="text-xl font-bold">${paymentDetails.amount}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Payment Method:</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getPaymentIcon(paymentDetails.method)}
                  {getPaymentLabel(paymentDetails.method)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Date:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(paymentDetails.timestamp).toLocaleString()}
                </span>
              </div>

              {paymentDetails.crypto && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Crypto Amount:</span>
                  <span className="text-sm font-mono">
                    {paymentDetails.cryptoAmount} {paymentDetails.crypto}
                  </span>
                </div>
              )}

              {paymentDetails.phone && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Phone:</span>
                  <span className="text-sm font-mono">{paymentDetails.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                What's Next
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Account Activated</div>
                    <div className="text-sm text-muted-foreground">
                      Your premium features are now available
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Welcome Email Sent</div>
                    <div className="text-sm text-muted-foreground">
                      Check your inbox for setup instructions
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Dashboard Access</div>
                    <div className="text-sm text-muted-foreground">
                      Log in to access your personalized dashboard
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Next Step</div>
                    <div className="text-sm text-muted-foreground">
                      Complete your trading profile setup
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/protected">
            <Button size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="gap-2"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? "Downloading..." : "Download Receipt"}
          </Button>
        </div>

        {/* Support Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about your subscription or need assistance getting started,
                our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm">
                  View Documentation
                </Button>
                <Button variant="outline" size="sm">
                  Join Community
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
