import React from 'react';
import { dbService } from '@/lib/db/client';
import { FileText } from 'lucide-react';

export const revalidate = 0;

export default async function AdminContentPage() {
  const banners = await dbService.getBanners();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">CMS Management</span>
        <h1 className="text-3xl font-black text-white uppercase">Homepage Banners & Hero Section</h1>
      </div>

      <div className="space-y-6">
        {banners.map((b) => (
          <div key={b.id} className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
            <img src={b.image_url} alt={b.title} className="w-full md:w-48 h-32 object-cover rounded-lg bg-slate-950 shrink-0" />
            <div className="space-y-2 flex-1 text-xs">
              <span className="text-[10px] font-bold uppercase bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded border border-gold-500/30">
                Display Order #{b.display_order}
              </span>
              <h3 className="text-base font-bold text-white">{b.title}</h3>
              <p className="text-slate-400">{b.subtitle}</p>
              <p className="text-gold-400 font-semibold">CTA: "{b.cta_text}" → {b.cta_link}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
