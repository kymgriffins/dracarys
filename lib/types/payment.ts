export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  last_payment_error?: {
    message?: string;
    code?: string;
  };
}

export interface StripePaymentData {
  planId: string;
  userId: string;
  amount: number;
  currency: string;
}

export interface MpesaSTKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface MpesaSTKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  method: 'stripe' | 'mpesa' | 'crypto';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 'stripe' | 'mpesa' | 'crypto';

export const PAYMENT_PLANS: Record<string, PaymentPlan> = {
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited journaling',
      'Trading signals',
      'Live streams',
      'AI-powered insights',
      'Lorde of Merchants mentorship access',
      'Community forum premium',
      'Mobile app access',
      'Priority email support'
    ]
  },
  mentoring: {
    id: 'mentoring',
    name: 'Mentoring Pro Plan',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'All Premium features',
      '1-on-1 mentoring sessions with Lorde of Merchants',
      'Personal strategy development',
      'Custom trading plans',
      'Direct Lorde of Merchants availability',
      'Private mentor chat',
      'Emergency trading support',
      'Live webinar priority access'
    ]
  }
};

export const KES_PAYMENT_PLANS: Record<string, PaymentPlan> = {
  premium_kes: {
    id: 'premium_kes',
    name: 'Premium Plan (KES)',
    price: usdToKes(29),
    currency: 'KES',
    interval: 'month',
    features: [
      'Unlimited journaling',
      'Trading signals',
      'Live streams',
      'AI-powered insights',
      'Lorde of Merchants mentorship access',
      'Community forum premium',
      'Mobile app access',
      'Priority email support'
    ]
  },
  mentoring_kes: {
    id: 'mentoring_kes',
    name: 'Mentoring Pro Plan (KES)',
    price: usdToKes(99),
    currency: 'KES',
    interval: 'month',
    features: [
      'All Premium features',
      '1-on-1 mentoring sessions with Lorde of Merchants',
      'Personal strategy development',
      'Custom trading plans',
      'Direct Lorde of Merchants availability',
      'Private mentor chat',
      'Emergency trading support',
      'Live webinar priority access'
    ]
  }
};

// M-Pesa constants
export const MPESA_CONFIG = {
  BUSINESS_SHORT_CODE: '174379', // Sandbox shortcode
  PASSKEY: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919', // Sandbox passkey
  CONSUMER_KEY: process.env.MPESACONSUMERKEY!,
  CONSUMER_SECRET: process.env.MPESACONSUMERSECRETKEY!,
  BASE_URL: 'https://sandbox.safaricom.co.ke', // Change to live URL for production
  CALLBACK_URL: process.env.MPESA_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mpesa/callback`,
};

// Utility functions
export function formatPhoneNumber(phone: string): string {
  // Ensure phone starts with 254 and remove any leading +
  let formatted = phone.replace(/^\+?/, '');
  if (formatted.startsWith('0')) {
    formatted = '254' + formatted.substring(1);
  } else if (!formatted.startsWith('254')) {
    formatted = '254' + formatted;
  }
  return formatted;
}

export function generateTimestamp(): string {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
}

export function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

// Currency conversion utilities
export function usdToKes(amountInUsd: number): number {
  // Using approximate exchange rate of 1 USD = 150 KES
  // You should use a live exchange rate API in production
  const EXCHANGE_RATE = 150;
  return Math.round(amountInUsd * EXCHANGE_RATE);
}

export function kesToUsd(amountInKes: number): number {
  // Convert KES back to USD for internal calculations
  const EXCHANGE_RATE = 150;
  return Number((amountInKes / EXCHANGE_RATE).toFixed(2));
}
