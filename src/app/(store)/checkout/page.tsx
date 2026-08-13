'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { DeliveryZone } from '@/types';
import { dbService } from '@/lib/db/client';
import { ShoppingBag, Lock, ShieldCheck, ArrowRight, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totals, appliedCoupon, selectedDeliveryZone, setDeliveryZone, clearCart } = useStore();
  const { customer } = useAuth();

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields - Prefilled from logged-in customer account
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [notes, setNotes] = useState('');

  // Security Gate: Only registered users can access checkout and place orders
  useEffect(() => {
    if (!customer) {
      router.push('/login?redirect=/checkout');
    } else {
      setCustomerName(customer.name || '');
      setCustomerEmail(customer.email || '');
      setCustomerPhone(customer.phone || '');
    }
  }, [customer, router]);

  useEffect(() => {
    async function loadZones() {
      const zones = await dbService.getDeliveryZones();
      setDeliveryZones(zones);
      if (zones.length > 0) {
        setSelectedZoneId(zones[0].id);
        setDeliveryZone(zones[0]);
      }
    }
    loadZones();
  }, []);

  const handleZoneChange = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    const z = deliveryZones.find(item => item.id === zoneId) || null;
    setDeliveryZone(z);
  };

  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        formData: {
          customerName,
          customerEmail,
          customerPhone,
          streetAddress,
          city,
          region,
          country: 'Ghana',
          deliveryZoneId: selectedZoneId,
          couponCode: appliedCoupon?.code,
          notes,
        },
        items: cart.map(item => ({
          variantId: item.variant.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch('/api/checkout/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.error || 'Checkout initialization failed');
        setLoading(false);
        return;
      }

      // Clear local cart
      clearCart();

      // Redirect customer to Paystack payment URL
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to connect to checkout service');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Your Shopping Cart is Empty</h1>
        <p className="text-xs text-slate-400">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3 rounded transition-colors"
        >
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Secure Gateway</span>
          <h1 className="text-3xl font-black text-white uppercase">Checkout & Order Placement</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-full">
          <Lock className="w-3.5 h-3.5 text-gold-500" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePaystackCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Information & Delivery */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Customer Contact */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-gold-500 text-slate-950 text-xs flex items-center justify-center font-black">1</span>
              Client Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Email Address (Order Confirmation) *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Phone Number (Delivery Contact & MoMo) *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-gold-500 text-slate-950 text-xs flex items-center justify-center font-black">2</span>
              Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Street Address *</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">City / Town *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Region *</label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Delivery Zone Selector */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-gold-500 text-slate-950 text-xs flex items-center justify-center font-black">3</span>
              Delivery Option & Regional Freight
            </h3>

            <div className="space-y-3">
              {deliveryZones.map((zone) => {
                const rateInfo = zone.rates?.[0];
                const fee = rateInfo?.rate || 0;
                const isFree = totals.subtotal >= (rateInfo?.free_shipping_threshold || 999999);
                return (
                  <label
                    key={zone.id}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedZoneId === zone.id
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={selectedZoneId === zone.id}
                        onChange={() => handleZoneChange(zone.id)}
                        className="accent-gold-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-gold-500" /> {zone.name}
                        </div>
                        <p className="text-[11px] text-slate-400">{zone.description} • ({zone.estimated_delivery_days})</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gold-400">
                      {isFree ? 'FREE Shipping' : formatCurrency(fee)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Order Summary & Payment Button */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6 sticky top-28">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {/* Cart Items Summary */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.variant.image_url || item.product.images?.[0]?.url}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded bg-slate-950"
                    />
                    <div>
                      <h4 className="font-semibold text-white truncate max-w-[140px]">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-400">{item.variant.title} x {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-200">
                    {formatCurrency(item.variant.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal Calculation Breakdown */}
            <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatCurrency(totals.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Freight</span>
                <span className="text-white font-medium">
                  {totals.deliveryFee === 0 ? 'FREE' : formatCurrency(totals.deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-gold-400">{formatCurrency(totals.totalAmount)}</span>
              </div>
            </div>

            {/* Paystack Payment Trigger */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 transition-colors"
              >
                {loading ? (
                  'Processing Authorization...'
                ) : (
                  <>
                    Pay Securely with Paystack <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                <span>Card, Mobile Money (MTN, Telecel, AT)</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
