'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Logged runtime exception:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-rose-400 font-bold text-xs tracking-widest uppercase">System Recovery</span>
          <h1 className="text-3xl font-black text-white uppercase">Something Went Wrong</h1>
          <p className="text-xs text-slate-400">
            We encountered an unexpected operational exception. Please try refreshing the page or returning home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
