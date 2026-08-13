import React from 'react';

export const metadata = { title: 'Refund & Return Policy | KL STUDIOS' };

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Client Assurance</span>
        <h1 className="text-3xl font-black text-white uppercase">Returns & Refund Policy</h1>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. 14-Day Return Window</h2>
          <p>
            Client satisfaction is our primary metric. You may return any unused item in its original pristine packaging within 14 days of delivery for a full refund or exchange.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Refund Processing</h2>
          <p>
            Refunds are credited back directly to the original Paystack payment method (Card or Mobile Money account) within 3 to 5 business days following physical receipt and quality inspection at our Osu gallery.
          </p>
        </section>
      </div>
    </div>
  );
}
