import { NextResponse } from 'next/server';
import { verifyPaystackWebhookSignature } from '@/lib/payments/paystack';
import { dbService } from '@/lib/db/client';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature') || '';

    // 1. Verify HMAC SHA-512 Webhook Signature when running with real secrets
    if (process.env.PAYSTACK_SECRET_KEY && !process.env.PAYSTACK_SECRET_KEY.includes('demo')) {
      const isValidSignature = verifyPaystackWebhookSignature(rawBody, signature);
      if (!isValidSignature) {
        console.error('Paystack webhook signature mismatch detected');
        return NextResponse.json({ success: false, message: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Invalid JSON payload' }, { status: 400 });
    }

    const event = payload?.event;

    // 2. Handle 'charge.success' event idempotently
    if (event === 'charge.success' && payload?.data) {
      const reference = payload.data.reference;
      const amountPaidPesewas = payload.data.amount || 0;
      const amountPaidGHS = amountPaidPesewas / 100;

      const order = await dbService.getOrderById(reference);
      if (order) {
        // Prevent duplicate processing if already marked Paid
        if (order.payment_status === 'Paid') {
          return NextResponse.json({ success: true, message: 'Event already processed' });
        }

        // Amount manipulation check
        if (Math.abs(order.total_amount - amountPaidGHS) > 0.05) {
          console.error(`Paystack webhook amount mismatch for order ${reference}: expected ${order.total_amount}, got ${amountPaidGHS}`);
          await dbService.updateOrderStatus(order.id, 'Cancelled');
          return NextResponse.json({ success: false, message: 'Amount mismatch' }, { status: 400 });
        }

        // Mark order as paid & update status to Payment Confirmed
        await dbService.updateOrderStatus(order.id, 'Payment Confirmed');
        await dbService.logAdminAction('system@paystack.webhook', 'Payment Verified', 'Order', {
          order_number: reference,
          amount_paid: amountPaidGHS,
          channel: payload.data.channel,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook event processed' });
  } catch (error: any) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server webhook error' }, { status: 500 });
  }
}
