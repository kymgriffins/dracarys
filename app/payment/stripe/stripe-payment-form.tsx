"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, ArrowLeft, Loader2, AlertCircle, Shield } from "lucide-react";
import Link from "next/link";
import { loadStripe, StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { PAYMENT_PLANS, PaymentPlan } from "@/lib/types/payment";

// Initialize Stripe with enhanced options
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', {
  // Enable betas for latest features if needed
  betas: ['elements_enable_deferred_intent_beta_1'], // For deferred payment intents
});

interface CheckoutFormProps {
  clientSecret: string;
  plan: PaymentPlan;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ clientSecret, plan, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);

  // Monitor payment element completion
  const handlePaymentElementChange = (event: any) => {
    setIsFormComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      const errorMsg = 'Stripe has not loaded yet. Please wait and try again.';
      setError(errorMsg);
      onError(errorMsg);
      return;
    }

    if (!isFormComplete) {
      const errorMsg = 'Please complete all required payment information.';
      setError(errorMsg);
      onError(errorMsg);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Submit the payment element
      const { error: submitError } = await elements.submit();

      if (submitError) {
        const errorMsg = submitError.message || 'An error occurred during submission.';
        setError(errorMsg);
        onError(errorMsg);
        setIsProcessing(false);
        return;
      }

      // Confirm the payment intent
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      const { error: confirmError, paymentIntent } = result;

      if (confirmError) {
        let errorMsg = 'Payment could not be processed.';

        if (confirmError.type === 'card_error' || confirmError.type === 'validation_error') {
          errorMsg = confirmError.message || errorMsg;
        } else if (confirmError.type === 'api_connection_error') {
          errorMsg = 'Network error. Please check your connection and try again.';
        } else {
          errorMsg = `Payment failed: ${confirmError.message || 'Unknown error occurred.'}`;
        }

        setError(errorMsg);
        onError(errorMsg);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        // Handle other payment states (e.g., requires_action)
        console.warn(`Payment status: ${paymentIntent?.status}`);
        setIsProcessing(false);
      }

    } catch (err: any) {
      const errorMsg = 'An unexpected error occurred. Please try again.';
      console.error('Payment submission error:', err);
      setError(errorMsg);
      onError(errorMsg);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-primary border border-primary rounded-lg">
          <Shield className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-primary">Secure Payment</p>
            <p className="text-primary">Powered by Stripe - SSL encrypted</p>
          </div>
        </div>

        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'paypal'],
            defaultValues: {
              billingDetails: {
                name: '', // Can be populated if user is logged in
              },
            },
          }}
          onChange={handlePaymentElementChange}
          className="min-h-[400px]"
        />
      </div>

      {error && (
        <div className="bg-muted border border-muted rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-muted-foreground">Payment Error</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            If this error persists, try refreshing the page or contact support.
          </p>
        </div>
      )}

      {!isFormComplete && !error && (
        <div className="bg-accent border border-accent rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent-foreground flex-shrink-0" />
            <span className="font-medium text-accent-foreground">Complete Payment Information</span>
          </div>
          <p className="text-sm text-accent-foreground mt-1">
            Please fill in all required payment information to proceed.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !isFormComplete}
        className="w-full h-12 text-base font-semibold"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            Pay ${plan.price} USD
            <CreditCard className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      <div className="text-xs text-muted-foreground space-y-1">
        <p className="text-center">Your payment information is encrypted and secure.</p>
        <p className="text-center flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          SSL Protected • PCI Compliant • Stripe Verified
        </p>
      </div>
    </form>
  );
}

interface StripePaymentFormProps {
  className?: string;
}

export function StripePaymentForm({ className }: StripePaymentFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan");

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const plan = planId ? PAYMENT_PLANS[planId] : null;

  useEffect(() => {
    if (!plan) {
      setError('Invalid plan selected');
      setIsLoading(false);
      return;
    }

    // Get current user ID (replace with actual user ID from auth context)
    const userId = 'anonymous'; // TODO: Get from auth context

    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId,
            userId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        setClientSecret(data.clientSecret);
        setError(null);
      } catch (err: any) {
        console.error('Payment intent creation error:', err);

        // Retry logic for network issues
        if (retryCount < 2) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000 * (retryCount + 1));
        } else {
          setError(err.message || 'Failed to initialize payment. Please refresh and try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (retryCount === 0 || retryCount < 3) {
      createPaymentIntent();
    }
  }, [plan, planId, retryCount]);

  const handleSuccess = (paymentIntentId: string) => {
    setIsCompleted(true);

    // Store payment info in localStorage for success page
    localStorage.setItem("lastPayment", JSON.stringify({
      plan: planId,
      amount: plan?.price,
      method: "stripe",
      paymentIntentId,
      timestamp: new Date().toISOString(),
      status: "completed"
    }));

    // Redirect to success page
    setTimeout(() => {
      router.push('/payment/success');
    }, 1500);
  };

  const handleError = (errorMsg: string) => {
    console.error('Payment error:', errorMsg);
    // Error is already displayed in the form
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
    setClientSecret(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <CardTitle>Setting up secure payment...</CardTitle>
            <CardDescription>This may take a few seconds...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-muted-foreground">Payment Setup Failed</CardTitle>
            <CardDescription className="text-muted-foreground mb-4">
              {error || 'Please select a valid plan to proceed with payment.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
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
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-secondary-foreground mx-auto mb-4" />
            <CardTitle className="text-secondary-foreground">Payment Successful!</CardTitle>
            <CardDescription>Redirecting you to confirmation page...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret: clientSecret!,
    appearance: {
      theme: 'stripe' as const,
      labels: 'floating' as const,
      variables: {
        colorPrimary: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--background))',
        colorText: 'hsl(var(--foreground))',
        colorDanger: 'hsl(0 84.2% 60.2%)',
        fontFamily: 'var(--font-family)',
        spacingUnit: '4px',
        borderRadius: '6px',
      },
      rules: {
        '.Input': {
          backgroundColor: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
          boxShadow: 'none',
        },
        '.Input:focus': {
          borderColor: 'hsl(var(--ring))',
          boxShadow: '0 0 0 2px hsl(var(--ring) / 0.2)',
        },
        '.Input--invalid': {
          color: 'hsl(0 84.2% 60.2%)',
          borderColor: 'hsl(0 84.2% 60.2%)',
        },
        '.Tab': {
          backgroundColor: 'hsl(var(--muted))',
          borderColor: 'hsl(var(--border))',
        },
        '.Tab:hover': {
          backgroundColor: 'hsl(var(--muted) / 0.8)',
        },
        '.Tab--selected': {
          backgroundColor: 'hsl(var(--background))',
          borderColor: 'hsl(var(--ring))',
        },
      },
    },
    loader: 'always',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 ${className || ''}`}>
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
                <span className="font-medium">{plan.name}</span>
                <span className="text-2xl font-bold">${plan.price}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Billed {plan.interval}ly • One-time payment
              </div>
              <hr />
              <div className="space-y-2">
                <h4 className="font-medium">What's included:</h4>
                <ul className="space-y-1 text-sm">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary-foreground flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-secondary border border-secondary rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary-foreground" />
                  <div>
                    <p className="font-medium text-secondary-foreground">Secure Payment</p>
                    <p className="text-sm text-secondary-foreground">Processed by Stripe with bank-level security</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stripe Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary text-primary border-primary">
                  <Shield className="w-4 h-4 mr-1" />
                  Stripe
                </Badge>
                Secure Payment
              </CardTitle>
              <CardDescription>
                Complete your payment securely with Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    plan={plan}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </Elements>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
