'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
        {/* Column 1: Brand & Contact */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-2xl text-white">
            <span className="w-8 h-8 rounded bg-gold-500 text-slate-950 flex items-center justify-center font-black">KL</span>
            <span>STUDIOS</span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Crafting luxury acoustics, titanium timepieces, and full-grain Italian leather carry. Built for discerning clients across Ghana and worldwide.
          </p>
          <div className="space-y-2 text-xs pt-2">
            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Oxford Street, Osu, Accra, Ghana</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-gold-500 shrink-0" />
              <span>+233 24 000 9999</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-gold-500 shrink-0" />
              <span>concierge@klstudios.com</span>
            </div>
          </div>
        </div>

        {/* Column 2: Collections */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Collections</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/shop" className="hover:text-gold-400 transition-colors">All Products</Link></li>
            <li><Link href="/shop?category=audio-acoustics" className="hover:text-gold-400 transition-colors">Audio & Acoustics</Link></li>
            <li><Link href="/shop?category=wearable-tech" className="hover:text-gold-400 transition-colors">Wearable Tech</Link></li>
            <li><Link href="/shop?category=leather-goods" className="hover:text-gold-400 transition-colors">Leather Carry</Link></li>
            <li><Link href="/shop?category=apparel-outerwear" className="hover:text-gold-400 transition-colors">Urban Outerwear</Link></li>
          </ul>
        </div>

        {/* Column 3: Client Care & Newsletter */}
        <div className="space-y-5">
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Client Care</h4>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              <li><Link href="/account" className="hover:text-gold-400 transition-colors">Account Portal</Link></li>
              <li><Link href="/account?tab=orders" className="hover:text-gold-400 transition-colors">Track Orders</Link></li>
              <li><Link href="/delivery-policy" className="hover:text-gold-400 transition-colors">Delivery & Freight</Link></li>
              <li><Link href="/refund-policy" className="hover:text-gold-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="pt-2 space-y-2 border-t border-slate-900">
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase">Private Journal</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-4 py-2 rounded transition-colors shrink-0"
              >
                Join
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Welcome to the private journal.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 KL STUDIOS. All Rights Reserved. Production-Grade Commercial Platform.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-gold-500" /> Paystack 256-Bit SSL Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
