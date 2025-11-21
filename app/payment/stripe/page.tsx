import { Suspense } from "react";
import { StripePaymentForm } from "./stripe-payment-form";

export default function StripePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading payment page...</p>
        </div>
      </div>
    }>
      <StripePaymentForm />
    </Suspense>
  );
}
