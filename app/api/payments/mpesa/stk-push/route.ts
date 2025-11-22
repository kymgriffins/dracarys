import { NextRequest, NextResponse } from 'next/server';
import { MPESA_CONFIG, formatPhoneNumber, generatePassword, generateTimestamp, PAYMENT_PLANS, usdToKes } from '@/lib/types/payment';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, planId, userId } = await request.json();

    // Validate inputs
    if (!phoneNumber || !planId) {
      return NextResponse.json(
        { error: 'Phone number and plan ID are required' },
        { status: 400 }
      );
    }

    // Validate plan
    const plan = PAYMENT_PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Convert USD plan price to KES for M-Pesa
    const amountInKes = usdToKes(plan.price);

    // Generate timestamp and password for M-Pesa
    const timestamp = generateTimestamp();
    const password = generatePassword(
      MPESA_CONFIG.BUSINESS_SHORT_CODE,
      MPESA_CONFIG.PASSKEY,
      timestamp
    );

    // Prepare STK Push request with KES amount
    const stkPushData = {
      BusinessShortCode: MPESA_CONFIG.BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amountInKes, // Send KES amount to M-Pesa
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.BUSINESS_SHORT_CODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CONFIG.CALLBACK_URL,
      AccountReference: `Dracarys-${planId}-${userId || 'anonymous'}`,
      TransactionDesc: `${plan.name} Subscription Payment - USD ${plan.price}`,
    };

    // Make request to M-Pesa API
    const auth = Buffer.from(
      `${MPESA_CONFIG.CONSUMER_KEY}:${MPESA_CONFIG.CONSUMER_SECRET}`
    ).toString('base64');

    const response = await fetch(
      `${MPESA_CONFIG.BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify(stkPushData),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('M-Pesa STK Push failed:', responseData);
      return NextResponse.json(
        { error: 'Failed to initiate M-Pesa payment' },
        { status: 500 }
      );
    }

    // Store pending payment record
    const checkoutRequestId = responseData.CheckoutRequestID;

    // In a real app, you'd store this in your database
    console.log('M-Pesa STK Push initiated:', {
      checkoutRequestId,
      merchantRequestId: responseData.MerchantRequestID,
      planId,
      userId,
      usdAmount: plan.price, // USD amount displayed to user
      kesAmount: amountInKes, // KES amount sent to M-Pesa
      phoneNumber: formattedPhone,
      exchangeRate: `${plan.price} USD = ${amountInKes} KES`,
    });

    return NextResponse.json({
      success: true,
      message: responseData.CustomerMessage,
      checkoutRequestId,
      merchantRequestId: responseData.MerchantRequestID,
      phoneNumber: formattedPhone,
      usdAmount: plan.price,
      kesAmount: amountInKes,
    });

  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    return NextResponse.json(
      { error: 'Failed to process M-Pesa payment' },
      { status: 500 }
    );
  }
}

async function getAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(
      `${MPESA_CONFIG.CONSUMER_KEY}:${MPESA_CONFIG.CONSUMER_SECRET}`
    ).toString('base64');

    const response = await fetch(
      `${MPESA_CONFIG.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to get M-Pesa access token');
    }

    return data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    throw error;
  }
}
