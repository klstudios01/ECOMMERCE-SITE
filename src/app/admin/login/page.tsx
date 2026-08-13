'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const success = await loginAdmin(email.trim(), password);
      setLoading(false);

      if (success) {
        router.push('/admin');
      } else {
        setErrorMessage('Invalid administrative credentials. Please check your email and password.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Admin authentication failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Operator Gate</span>
          <h1 className="text-2xl font-black text-white uppercase">Store Admin Login</h1>
          <p className="text-xs text-slate-400">Authenticate to access store management & order fulfillment.</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300">Admin Email Address *</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@klstudios.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500 font-medium"
              />
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300">Admin Password *</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            {loading ? 'Authenticating Admin...' : <>Enter Admin Dashboard <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
