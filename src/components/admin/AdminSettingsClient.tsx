'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Store, ShieldCheck, KeyRound, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminSettingsClient() {
  const { adminEmail, adminRole, changeAdminPassword } = useAuth();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPass !== confirmPass) {
      setStatusMessage({ type: 'error', text: 'New admin password and confirmation password do not match.' });
      return;
    }

    const res = changeAdminPassword(currentPass, newPass);

    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Profile Overview */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold-500" /> Active Operator Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Logged-in Admin Email</span>
            <p className="font-bold text-white text-sm">{adminEmail || 'admin@klstudios.com'}</p>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Assigned Role Privilege</span>
            <p className="font-bold text-gold-400 text-sm">{adminRole}</p>
          </div>
        </div>
      </div>

      {/* Admin Password Change Form */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-gold-500" /> Change Operator Admin Password
          </h3>
          <p className="text-xs text-slate-400 mt-1">Update the password for your administrative login account ({adminEmail}).</p>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-rose-950/80 border-rose-800 text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="font-semibold text-slate-300">Current Admin Password *</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300">New Admin Password *</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                placeholder="•••••••• (Min 6 characters)"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300">Confirm New Password *</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-lg transition-colors"
          >
            Update Admin Password
          </button>
        </form>
      </div>
    </div>
  );
}
