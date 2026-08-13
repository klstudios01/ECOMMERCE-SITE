'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerCustomer } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const ok = await registerCustomer(fullName.trim(), email.trim(), phone.trim(), password);
      setLoading(false);

      if (ok) {
        setSuccess(true);
        setTimeout(() => router.push('/account'), 1200);
      } else {
        setErrorMessage('Could not create account with this email. Please sign in or try a different email.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Client Onboarding</span>
        <h1 className="text-3xl font-black text-white uppercase">Create Client Account</h1>
        <p className="text-xs text-slate-400">Set your personal email and password to access bespoke tracking.</p>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        {success && (
          <div className="p-3 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Account created successfully! Redirecting to Client Portal...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300">Full Name *</label>
            <div className="relative mt-1">
              <input
                type="text"
                required
                placeholder="Kwame Mensah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500 font-medium"
              />
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

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
            <label className="font-semibold text-slate-300">Phone Number *</label>
            <div className="relative mt-1">
              <input
                type="tel"
                required
                placeholder="+233 24 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500 font-medium"
              />
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300">Create Account Password *</label>
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
            {loading ? 'Registering Account...' : <>Register Client Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="text-gold-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
