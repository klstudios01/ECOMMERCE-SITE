import React from 'react';

export const metadata = { title: 'Terms & Conditions | KL STUDIOS' };

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Legal Framework</span>
        <h1 className="text-3xl font-black text-white uppercase">Terms of Service</h1>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Commercial Terms</h2>
          <p>
            By accessing or placing an order on KL STUDIOS, you agree to comply with our commercial terms. All product prices are displayed in Ghana Cedi (GH₵) inclusive of applicable taxes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Product Warranty</h2>
          <p>
            Products are backed by a 2-year warranty covering manufacturing defects under normal operating conditions.
          </p>
        </section>
      </div>
    </div>
  );
}
