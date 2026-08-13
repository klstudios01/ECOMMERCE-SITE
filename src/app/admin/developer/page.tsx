import React from 'react';
import { DeveloperPortalClient } from '@/components/admin/DeveloperPortalClient';

export const metadata = {
  title: 'Developer Portal | Site Configuration & Brand Controls',
};

export default function DeveloperPortalPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Technical Manager Portal</span>
          <h1 className="text-3xl font-black text-white uppercase">Developer Portal & Theme Engine</h1>
        </div>
      </div>

      <DeveloperPortalClient />
    </div>
  );
}
