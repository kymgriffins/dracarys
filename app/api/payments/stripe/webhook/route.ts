import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPESECRETKEY!, {
  apiVersion: '2025-02-24.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Add this to your env later

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret!);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`Webhook signature verification failed.`, error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPaymentIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const supabase = await createClient();

    const { planId, userId, planName } = paymentIntent.metadata;

    // Store payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId || 'anonymous',
        plan_id: planId || 'normal',
        amount: paymentIntent.amount / 100, // Convert cents to dollars
        currency: paymentIntent.currency.toUpperCase(),
        method: 'stripe',
        status: 'completed',
        transaction_id: paymentIntent.id,
        metadata: {
          planName,
          stripePaymentIntentId: paymentIntent.id,
        },
      });

    if (paymentError) {
      console.error('Error storing payment record:', paymentError);
      return;
    }

    // Update user subscription status
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId || 'anonymous',
        plan_id: planId || 'normal',
        status: 'active',
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      });

    if (subscriptionError) {
      console.error('Error updating subscription:', subscriptionError);
      return;
    }

    console.log(`Payment successful for user ${userId}, plan ${planId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const supabase = await createClient();

    const { planId, userId } = paymentIntent.metadata;

    // Store failed payment record
    const { error } = await supabase
      .from('payments')
      .insert({
        user_id: userId || 'anonymous',
        plan_id: planId || 'normal',
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        method: 'stripe',
        status: 'failed',
        transaction_id: paymentIntent.id,
        metadata: {
          failure_reason: paymentIntent.last_payment_error?.message,
        },
      });

    if (error) {
      console.error('Error storing failed payment record:', error);
    }

    console.log(`Payment failed for user ${userId}, plan ${planId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
