import { NextResponse } from 'next/server';
import { verifyPaystackTransaction } from '@/lib/payments/paystack';
import { dbService } from '@/lib/db/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ success: false, error: 'Order reference required' }, { status: 400 });
    }

    const order = await dbService.getOrderById(reference);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order record not found' }, { status: 404 });
    }

    // If already confirmed by webhook or prior check
    if (order.payment_status === 'Paid') {
      return NextResponse.json({ success: true, order });
    }

    // Verify transaction with Paystack API
    const paystackResult = await verifyPaystackTransaction(reference);
    if (paystackResult.status && paystackResult.data?.status === 'success') {
      const updatedOrder = await dbService.updateOrderStatus(order.id, 'Payment Confirmed');
      return NextResponse.json({ success: true, order: updatedOrder });
    }

    return NextResponse.json({ success: false, order, message: 'Payment verification pending' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Verification error' }, { status: 500 });
  }
}
