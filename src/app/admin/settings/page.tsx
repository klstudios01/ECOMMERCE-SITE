import React from 'react';
import { AdminSettingsClient } from '@/components/admin/AdminSettingsClient';

export const revalidate = 0;

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">System Settings</span>
        <h1 className="text-3xl font-black text-white uppercase">Store Settings & Admin Security</h1>
      </div>

      <AdminSettingsClient />
    </div>
  );
}
