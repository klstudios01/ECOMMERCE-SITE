import React from 'react';

export const metadata = { title: 'Privacy Policy | KL STUDIOS' };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Data Governance</span>
        <h1 className="text-3xl font-black text-white uppercase">Privacy Policy</h1>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Data Confidentiality</h2>
          <p>
            KL STUDIOS respects your privacy. Personal information collected during checkout (name, email, shipping address, phone number) is strictly used for order fulfillment, courier delivery, and essential customer service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Payment Security</h2>
          <p>
            We do NOT store or record raw credit card details or Mobile Money PINs. All financial transactions are processed securely through Paystack PCI-DSS compliant infrastructure.
          </p>
        </section>
      </div>
    </div>
  );
}
