import React from 'react';
import { dbService } from '@/lib/db/client';
import { formatCurrency } from '@/lib/utils';
import { Truck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDeliveryPage() {
  const zones = await dbService.getDeliveryZones();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Logistics Matrix</span>
        <h1 className="text-3xl font-black text-white uppercase">Delivery Zones & Shipping Rates</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const rateInfo = zone.rates?.[0];
          return (
            <div key={zone.id} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <Truck className="w-4 h-4 text-gold-500" />
                  <span>{zone.name}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Active Zone
                </span>
              </div>

              <p className="text-xs text-slate-400">{zone.description}</p>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Standard Shipping Rate:</span>
                  <span className="font-bold text-gold-400">{formatCurrency(rateInfo?.rate || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Free Freight Threshold:</span>
                  <span className="font-semibold text-white">
                    {rateInfo?.free_shipping_threshold ? formatCurrency(rateInfo.free_shipping_threshold) : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Freight Window:</span>
                  <span className="font-semibold text-white">{zone.estimated_delivery_days}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
