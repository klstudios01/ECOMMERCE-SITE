import React from 'react';

export const metadata = { title: 'Delivery & Freight Policy | KL STUDIOS' };

export default function DeliveryPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Client Logistics</span>
        <h1 className="text-3xl font-black text-white uppercase">Delivery & Freight Policy</h1>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Shipping Zones & Timelines</h2>
          <p>
            KL STUDIOS operates dedicated express courier dispatch across Ghana. Shipping costs are calculated transparently based on your selected delivery zone:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Greater Accra Central:</strong> GH₵35.00 (24 - 48 Hours). Complimentary on orders over GH₵2,000.</li>
            <li><strong>Tema & Environs:</strong> GH₵45.00 (2 - 3 Days). Complimentary on orders over GH₵2,500.</li>
            <li><strong>Kumasi & Ashanti Region:</strong> GH₵60.00 (3 - 4 Days).</li>
            <li><strong>Other Regional Capitals:</strong> GH₵85.00 (4 - 6 Days).</li>
            <li><strong>Flagship Store Pickup (Osu, Accra):</strong> Free (Same Day).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Order Tracking</h2>
          <p>
            Once your payment is verified via Paystack, your order status transitions to <strong>Processing</strong>. You will receive an SMS and email notification containing your courier tracking reference code.
          </p>
        </section>
      </div>
    </div>
  );
}
