import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PAYMENT_PLANS, kesToUsd } from '@/lib/types/payment';

interface MpesaMetadataItem {
  Name: string;
  Value: string | number;
}

export async function POST(request: NextRequest) {
  try {
    const callbackData = await request.json();

    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;

    if (!Body) {
      console.error('Invalid callback data structure');
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 });
    }

    const { stkCallback } = Body;

    if (!stkCallback) {
      console.error('Missing stkCallback data');
      return NextResponse.json({ error: 'Missing stkCallback data' }, { status: 400 });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback;

    // Check if payment was successful
    if (ResultCode === 0 && CallbackMetadata) {
      // Extract payment details
      const metadata = CallbackMetadata.Item as MpesaMetadataItem[];
      const transactionInfo = {
        transactionId: metadata.find((item) => item.Name === 'MpesaReceiptNumber')?.Value,
        transactionDate: metadata.find((item) => item.Name === 'TransactionDate')?.Value,
        phoneNumber: metadata.find((item) => item.Name === 'PhoneNumber')?.Value,
        amountInKes: metadata.find((item) => item.Name === 'Amount')?.Value,
      };

      // Extract plan information from the AccountReference if available
      // Format: Dracarys-{planId}-{userId}
      const planId = 'normal'; // default fallback
      const userId = 'anonymous'; // default fallback

      // This would ideally come from stored session data, but for now we'll use defaults
      // In production, you'd store this mapping when creating the STK push
      console.log('Payment successful:', transactionInfo);

      try {
        const supabase = await createClient();

        // Convert KES amount back to USD for internal storage
        const amountInUsd = kesToUsd(Number(transactionInfo.amountInKes) || 150); // Fallback to 150 KES = $1

        // Find the matching plan based on USD amount
        const matchingPlan = Object.values(PAYMENT_PLANS).find(plan => plan.price === amountInUsd);

        const finalPlanId = matchingPlan ? matchingPlan.id : planId;

        // Store payment record in USD
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            plan_id: finalPlanId,
            amount: amountInUsd,
            currency: 'USD', // Store in USD internally
            method: 'mpesa',
            status: 'completed',
            transaction_id: transactionInfo.transactionId,
            metadata: {
              mpesa_receipt_number: transactionInfo.transactionId,
              phone_number: transactionInfo.phoneNumber,
              transaction_date: transactionInfo.transactionDate,
              merchant_request_id: MerchantRequestID,
              checkout_request_id: CheckoutRequestID,
              original_kes_amount: transactionInfo.amountInKes,
              converted_usd_amount: amountInUsd,
              safaricom_data: true, // Flag indicating this came from Safaricom
            },
          });

        if (paymentError) {
          console.error('Error storing payment record:', paymentError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Update user subscription status
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            plan_id: finalPlanId,
            status: 'active',
            current_period_start: new Date(),
            current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          });

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError);
        }

        console.log(`M-Pesa payment completed: ${transactionInfo.transactionId} - ${amountInUsd} USD (${transactionInfo.amountInKes} KES)`);
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
      }
    } else {
      // Payment failed or cancelled
      console.log(`M-Pesa payment failed: ${ResultDesc} (Code: ${ResultCode})`);

      try {
        const supabase = await createClient();

        // Store failed payment record
        const { error } = await supabase
          .from('payments')
          .insert({
            user_id: 'anonymous', // Could be extracted from session in production
            plan_id: 'normal', // Could be extracted from session in production
            amount: 0, // Amount not available on failure
            currency: 'USD',
            method: 'mpesa',
            status: 'failed',
            transaction_id: CheckoutRequestID,
            metadata: {
              failure_reason: ResultDesc,
              result_code: ResultCode,
              merchant_request_id: MerchantRequestID,
              checkout_request_id: CheckoutRequestID,
              safaricom_response: true,
            },
          });

        if (error) {
          console.error('Error storing failed payment record:', error);
        }
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
      }
    }

    // Always respond with success to acknowledge callback
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback received successfully'
    });

  } catch (error) {
    console.error('M-Pesa callback processing error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}
