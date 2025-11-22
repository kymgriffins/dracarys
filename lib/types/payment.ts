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
  normal: {
    id: 'normal',
    name: 'Normal Plan',
    price: 1000,
    currency: 'USD',
    interval: 'year',
    features: [
      'All Free features',
      'Enhanced charting tools',
      'Extended historical data',
      'Advanced risk management',
      'Portfolio analytics',
      'Email support'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 3000,
    currency: 'USD',
    interval: 'year',
    features: [
      'All Normal features',
      'Trading signals',
      'One-on-one coaching',
      'Personal strategy sessions',
      'Priority support',
      'Dedicated account manager'
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
