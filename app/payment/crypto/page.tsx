"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Bitcoin, ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PlanDetails {
  name: string;
  price: number;
  interval: string;
  features: string[];
}

interface CryptoWallet {
  name: string;
  symbol: string;
  address: string;
  icon: string;
  rate: number; // USD to crypto rate
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

const cryptoWallets: CryptoWallet[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    icon: "₿",
    rate: 95000 // $1 = 0.000010526 BTC (approx)
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    address: "0x742d35Cc6605308D6E2B6B2cAB04b4BD3B2B",
    icon: "Ξ",
    rate: 3800 // $1 = 0.000263 ETH (approx)
  },
  {
    name: "USDC",
    symbol: "USDC",
    address: "0x742d35Cc6605308D6E2B6B2cAB04b4BD3B2B",
    icon: "💰",
    rate: 1 // Stablecoin 1:1
  },
  {
    name: "Tether",
    symbol: "USDT",
    address: "0x742d35Cc6605308D6E2B6B2cAB04b4BD3B2B",
    icon: "₮",
    rate: 1 // Stablecoin 1:1
  }
];

function CryptoPaymentPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoWallet>(cryptoWallets[0]);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);

  const planDetail = plan ? planDetails[plan] : null;

  const cryptoAmount = planDetail ? (planDetail.price / selectedCrypto.rate).toFixed(8) : 0;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(selectedCrypto.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handlePaymentConfirmation = () => {
    setIsCompleted(true);

    // Simulate storing payment status
    localStorage.setItem("lastPayment", JSON.stringify({
      plan: plan,
      amount: planDetail!.price,
      method: "crypto",
      crypto: selectedCrypto.symbol,
      cryptoAmount: cryptoAmount,
      timestamp: new Date().toISOString(),
      status: "completed"
    }));

    // Redirect to success page after animation
    setTimeout(() => {
      window.location.href = "/payment/success";
    }, 2000);
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
            <CheckCircle className="w-16 h-16 text-secondary-foreground mx-auto mb-4" />
            <CardTitle className="text-secondary-foreground">Payment Successful!</CardTitle>
            <CardDescription>Redirecting you to confirmation page...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/pricing" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5" />
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
                      <CheckCircle className="w-4 h-4 text-secondary-foreground flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Crypto Selection & Payment */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Cryptocurrency</Badge>
                Decentralized Payment
              </CardTitle>
              <CardDescription>
                Pay with your preferred cryptocurrency for instant processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Crypto Selection */}
              <div className="space-y-4">
                <h4 className="font-medium">Select Cryptocurrency</h4>
                <div className="grid grid-cols-2 gap-3">
                  {cryptoWallets.map((crypto) => (
                    <button
                      key={crypto.symbol}
                      onClick={() => setSelectedCrypto(crypto)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedCrypto.symbol === crypto.symbol
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{crypto.icon}</span>
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Amount to pay:</span>
                  <span className="text-xl font-bold">{cryptoAmount} {selectedCrypto.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>≈ ${planDetail.price} USD</span>
                  <span>Rate: 1 USD = {(1 / selectedCrypto.rate).toFixed(8)} {selectedCrypto.symbol}</span>
                </div>

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Send to address:</span>
                    <Button
                      onClick={handleCopyAddress}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-4 h-4 text-secondary-foreground" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-background rounded p-3 font-mono text-sm break-all border">
                    {selectedCrypto.address}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-primary border border-primary rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Payment Instructions:</h4>
                <ol className="text-sm text-primary space-y-1 list-decimal list-inside">
                  <li>Select your cryptocurrency above</li>
                  <li>Send exactly <strong>{cryptoAmount} {selectedCrypto.symbol}</strong> to the address shown</li>
                  <li>Wait for 1-3 blockchain confirmations (usually 10-30 minutes)</li>
                  <li>Click "I've Made Payment" below to complete the process</li>
                </ol>
                <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                  <ExternalLink className="w-3 h-3" />
                  <a href={`https://etherscan.io/address/${selectedCrypto.address}`} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                    View address on blockchain explorer
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handlePaymentConfirmation}
                  className="w-full"
                  size="lg"
                >
                  I've Made the Payment
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={() => window.open(`https://www.binance.com/en/trade/${selectedCrypto.symbol}_USDT`, '_blank')}
                    variant="outline"
                    className="flex-1"
                  >
                    Buy {selectedCrypto.symbol} on Binance
                  </Button>
                  <Button
                    onClick={() => window.open(`https://www.coinbase.com/price/${selectedCrypto.symbol.toLowerCase()}`, '_blank')}
                    variant="outline"
                    className="flex-1"
                  >
                    Buy {selectedCrypto.symbol} on Coinbase
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Cryptocurrency payments are processed instantly. Contact support if you need help.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CryptoPaymentPageWrapper() {
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
      <CryptoPaymentPage />
    </Suspense>
  );
}

export default CryptoPaymentPageWrapper;
