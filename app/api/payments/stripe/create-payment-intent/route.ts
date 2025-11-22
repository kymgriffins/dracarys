import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PAYMENT_PLANS } from '@/lib/types/payment';

const stripe = new Stripe(process.env.STRIPESECRETKEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

    // Validate the plan
    const plan = PAYMENT_PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.price * 100, // Stripe expects amount in cents
      currency: plan.currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        planId: plan.id,
        userId: userId || 'anonymous',
        planName: plan.name,
      },
      description: `${plan.name} - ${plan.interval} subscription`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
