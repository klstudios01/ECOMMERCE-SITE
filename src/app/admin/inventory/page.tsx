import React from 'react';
import { dbService } from '@/lib/db/client';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const products = await dbService.getProducts();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Stock Control</span>
        <h1 className="text-3xl font-black text-white uppercase">Real-Time Inventory & Adjustments</h1>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Variant</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Threshold</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.flatMap(p => p.variants || []).map((variant) => {
                const isLow = variant.stock_quantity <= 5;
                return (
                  <tr key={variant.id} className="hover:bg-slate-850/50">
                    <td className="p-4 font-bold text-white">{variant.title}</td>
                    <td className="p-4 font-mono text-gold-400 font-bold">{variant.sku}</td>
                    <td className="p-4 text-slate-300">{variant.title}</td>
                    <td className="p-4 font-bold text-white">{variant.stock_quantity} units</td>
                    <td className="p-4 text-slate-400">5 units</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        isLow ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {isLow ? 'Low Stock Warning' : 'Optimal Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
