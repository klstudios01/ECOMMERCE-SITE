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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-3 gap-3 sm:gap-8 lg:gap-12">
        {/* Column 1: Brand & Contact */}
        <div className="space-y-3 sm:space-y-4">
          <Link href="/" className="flex items-center gap-1.5 font-bold tracking-widest text-lg sm:text-2xl text-white">
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-gold-500 text-slate-950 flex items-center justify-center text-xs sm:text-base font-black">KL</span>
            <span className="truncate">STUDIOS</span>
          </Link>
          <p className="text-slate-400 text-[10px] sm:text-xs leading-tight sm:leading-relaxed hidden sm:block">
            Crafting luxury acoustics, titanium timepieces, and full-grain Italian leather carry.
          </p>
          <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs pt-1 sm:pt-2">
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-slate-300">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 shrink-0" />
              <span className="truncate">Accra, Ghana</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-slate-300">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 shrink-0" />
              <span className="truncate">+233 24 000 9999</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-slate-300">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 shrink-0" />
              <span className="truncate">concierge@klstudios.com</span>
            </div>
          </div>
        </div>

        {/* Column 2: Collections */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase">Collections</h4>
          <ul className="space-y-1.5 sm:space-y-2.5 text-[10px] sm:text-xs">
            <li><Link href="/shop" className="hover:text-gold-400 transition-colors block py-0.5">All Products</Link></li>
            <li><Link href="/shop?category=audio-acoustics" className="hover:text-gold-400 transition-colors block py-0.5">Audio & Acoustics</Link></li>
            <li><Link href="/shop?category=wearable-tech" className="hover:text-gold-400 transition-colors block py-0.5">Wearable Tech</Link></li>
            <li><Link href="/shop?category=leather-goods" className="hover:text-gold-400 transition-colors block py-0.5">Leather Carry</Link></li>
            <li><Link href="/shop?category=apparel-outerwear" className="hover:text-gold-400 transition-colors block py-0.5">Urban Outerwear</Link></li>
          </ul>
        </div>

        {/* Column 3: Client Care */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase">Client Care</h4>
          <ul className="space-y-1.5 sm:space-y-2.5 text-[10px] sm:text-xs">
            <li><Link href="/account" className="hover:text-gold-400 transition-colors block py-0.5">Account Portal</Link></li>
            <li><Link href="/account?tab=orders" className="hover:text-gold-400 transition-colors block py-0.5">Track Orders</Link></li>
            <li><Link href="/delivery-policy" className="hover:text-gold-400 transition-colors block py-0.5">Delivery & Freight</Link></li>
            <li><Link href="/refund-policy" className="hover:text-gold-400 transition-colors block py-0.5">Returns & Refunds</Link></li>
            <li><Link href="/privacy" className="hover:text-gold-400 transition-colors block py-0.5">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold-400 transition-colors block py-0.5">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Private Journal Newsletter (Full Width Row across Grid on Mobile/Desktop) */}
        <div className="col-span-3 border-t border-slate-900/90 pt-4 mt-2 space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase">Private Journal</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Subscribe for exclusive access to bespoke launches and seasonal releases.</p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex gap-2 shrink-0">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 sm:w-64 bg-slate-900 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-4 py-2 rounded transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
          {subscribed && (
            <p className="text-emerald-400 text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Welcome to the private journal.
            </p>
          )}
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
