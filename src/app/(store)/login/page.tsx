'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginCustomer, customer } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const ok = await loginCustomer(email.trim(), password);
      setLoading(false);

      if (ok) {
        setSuccess(true);
        setTimeout(() => router.push('/account'), 1000);
      } else {
        setErrorMessage('Invalid customer credentials. Please check your email and password, or create a new account.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Client Portal</span>
        <h1 className="text-3xl font-black text-white uppercase">Client Sign In</h1>
        <p className="text-xs text-slate-400">Sign in with your email and password to track orders and wishlists.</p>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        {success && (
          <div className="p-3 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authenticated successfully! Redirecting to Client Portal...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300">Email Address *</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500 font-medium"
              />
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-300">Your Password *</label>
              <a href="#" className="text-[11px] text-gold-400 hover:underline">Forgot password?</a>
            </div>
            <div className="relative mt-1">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500 font-medium"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {loading ? 'Authenticating...' : <>Sign In to Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          New client?{' '}
          <Link href="/register" className="text-gold-400 font-bold hover:underline">
            Create Custom Client Account
          </Link>
        </div>
      </div>
    </div>
  );
}
