"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, RefreshCw, HelpCircle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-3xl text-red-600 mb-2">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-lg">
              Unfortunately, your payment could not be processed at this time.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Possible Reasons */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">What might have happened?</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Insufficient funds in your account</li>
                <li>• Incorrect payment details provided</li>
                <li>• Payment method was declined</li>
                <li>• Network connection issues during processing</li>
                <li>• Temporary service unavailability</li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">What should you do?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check your payment method and try again</li>
                <li>• Ensure you have sufficient funds</li>
                <li>• Verify your payment details are correct</li>
                <li>• Try a different payment method</li>
                <li>• Contact our support team if the issue persists</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => window.history.back()}
                className="flex-1 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Payment Again
              </Button>

              <Link href="/pricing" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Pricing
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/protected" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Home className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>

              <Button variant="outline" className="flex-1 gap-2">
                <HelpCircle className="w-4 h-4" />
                Contact Support
              </Button>
            </div>

            {/* Support Information */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Need help? We're here to assist you.
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <a href="mailto:support@dracarys.com" className="text-primary hover:underline">
                  Email Support
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="tel:+1234567890" className="text-primary hover:underline">
                  Call Support
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="/help" className="text-primary hover:underline">
                  Help Center
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Payment Methods */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Alternative Payment Methods</CardTitle>
            <CardDescription>
              If one payment method doesn't work, try another option.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="font-medium">Credit/Debit Card</div>
                <div className="text-sm text-muted-foreground">Visa, Mastercard, Amex</div>
              </div>
              <div className="text-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="font-medium">Mobile Money</div>
                <div className="text-sm text-muted-foreground">M-Pesa, Airtel Money</div>
              </div>
              <div className="text-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="font-medium">Cryptocurrency</div>
                <div className="text-sm text-muted-foreground">BTC, ETH, USDC, USDT</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
