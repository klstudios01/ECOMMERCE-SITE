'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Code2, KeyRound, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';

export default function DeveloperLoginPage() {
  const router = useRouter();
  const { loginDeveloper } = useAuth();

  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const success = loginDeveloper(passcode.trim());
      setLoading(false);

      if (success) {
        router.push('/admin/developer');
      } else {
        setErrorMessage('Invalid developer passcode key. Hint: dev12345');
      }
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
            <Code2 className="w-6 h-6" />
          </div>
          <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Technical Access Gate</span>
          <h1 className="text-2xl font-black text-white uppercase">Developer Portal Access</h1>
          <p className="text-xs text-slate-400">Enter developer security key to configure brand tokens & texts.</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300">Developer Passcode Key *</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="dev12345"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white font-mono focus:outline-none focus:border-gold-500"
              />
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-gold-500 shrink-0" />
            <span>Default Developer Passcode: <strong className="text-white font-mono">dev12345</strong></span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? 'Verifying Passcode...' : <>Unlock Developer Portal <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
