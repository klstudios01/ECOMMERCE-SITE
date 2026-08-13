import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-gold-500 font-black text-2xl">
          404
        </div>

        <div className="space-y-2">
          <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Page Not Found</span>
          <h1 className="text-3xl font-black text-white uppercase">Catalog Page Missing</h1>
          <p className="text-xs text-slate-400">
            The destination you requested may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" /> Browse Shop Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
