import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Award, MapPin } from 'lucide-react';

export const metadata = {
  title: 'About Our Brand | KL STUDIOS',
  description: 'Learn about KL STUDIOS luxury acoustics, titanium smartwatches, and Italian leather carry.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">The Heritage</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase">Architectural Design & Acoustic Perfection</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Founded in Accra, Ghana, KL STUDIOS was built on a single commitment: to curate and craft luxury consumer goods that resist transient fashion trends and engineered obsolescence.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-500 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-lg font-bold text-white">Uncompromising Materials</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            40mm beryllium headphone drivers, Grade 5 titanium smartwatch casings, and vegetable-tanned Italian full-grain leather.
          </p>
        </div>

        <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-500 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-lg font-bold text-white">2-Year Protection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every product purchased directly from KL STUDIOS includes comprehensive 2-year warranty coverage and client support.
          </p>
        </div>

        <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-500 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-lg font-bold text-white">Bespoke Concierge</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dedicated client concierges in Osu, Accra, ensuring same-day dispatch and white-glove assistance.
          </p>
        </div>
      </div>

      {/* Location Card */}
      <div className="p-10 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3">
          <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">Flagship Store</span>
          <h2 className="text-2xl font-bold text-white">Visit Our Osu Gallery</h2>
          <p className="text-xs text-slate-300 max-w-md">
            Experience our acoustic soundstage listening lounge and inspect our full-grain leather weekender carry in person.
          </p>
          <div className="flex items-center gap-2 text-xs text-gold-400 font-semibold pt-2">
            <MapPin className="w-4 h-4" /> Oxford Street, Osu, Accra, Ghana
          </div>
        </div>

        <Link
          href="/contact"
          className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3.5 rounded-lg transition-colors flex items-center gap-2 shrink-0"
        >
          Book Listening Session <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
