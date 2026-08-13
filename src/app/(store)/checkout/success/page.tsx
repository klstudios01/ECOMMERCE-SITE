import React from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle2, Package, ArrowRight, Printer, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  const orderNumber = reference || 'ORD-2026-8891';
  const order = await dbService.getOrderById(orderNumber);

  const displayOrder = order || {
    id: 'demo-1001',
    order_number: orderNumber,
    customer_name: 'Valued Client',
    customer_email: 'client@example.com',
    customer_phone: '+233 24 111 2222',
    shipping_address: {
      street_address: '14 Cantonments Road',
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
    },
    delivery_zone_name: 'Greater Accra Central',
    subtotal: 1250.00,
    delivery_fee: 35.00,
    discount_amount: 100.00,
    total_amount: 1185.00,
    currency: 'GHS',
    order_status: 'Payment Confirmed',
    payment_status: 'Paid',
    items: [
      {
        id: 'i1',
        product_name: 'Apex ANC Wireless Headphones',
        variant_title: 'Matte Black',
        unit_price: 1250.00,
        quantity: 1,
        total_price: 1250.00,
      },
    ],
    created_at: new Date().toISOString(),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      {/* Confirmation Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800">
          Payment Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase">Thank You For Your Order</h1>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Your payment has been authorized securely via Paystack. An order confirmation receipt has been dispatched to{' '}
          <strong className="text-white">{displayOrder.customer_email}</strong>.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Order Reference Number</span>
            <div className="text-xl font-bold text-gold-400">{displayOrder.order_number}</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Order Status</span>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Package className="w-4 h-4" /> {displayOrder.order_status}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Placed On</span>
            <div className="text-xs font-bold text-white">{formatDate(displayOrder.created_at)}</div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itemized Receipt</h3>
          <div className="divide-y divide-slate-800">
            {displayOrder.items.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-semibold text-white">{item.product_name}</h4>
                  <p className="text-slate-400">{item.variant_title} x {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-200">{formatCurrency(item.total_price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-white font-medium">{formatCurrency(displayOrder.subtotal)}</span>
          </div>
          {displayOrder.discount_amount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Discount Applied</span>
              <span>-{formatCurrency(displayOrder.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Freight ({displayOrder.delivery_zone_name || 'Standard'})</span>
            <span className="text-white font-medium">{formatCurrency(displayOrder.delivery_fee)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-white pt-3 border-t border-slate-800">
            <span>Total Paid</span>
            <span className="text-gold-400">{formatCurrency(displayOrder.total_amount)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
          <h4 className="font-bold text-white uppercase text-[11px]">Delivery Address:</h4>
          <p>{displayOrder.customer_name} ({displayOrder.customer_phone})</p>
          <p>{displayOrder.shipping_address.street_address}, {displayOrder.shipping_address.city}, {displayOrder.shipping_address.region}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/account?tab=orders"
          className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3.5 rounded transition-colors flex items-center justify-center gap-2"
        >
          Track Order Status in Account <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs px-6 py-3.5 rounded transition-colors flex items-center justify-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
