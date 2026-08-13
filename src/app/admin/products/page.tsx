import React from 'react';
import { dbService } from '@/lib/db/client';
import { AdminProductsClient } from '@/components/admin/AdminProductsClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    dbService.getProducts(),
    dbService.getCategories(),
  ]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Catalog Governance</span>
        <h1 className="text-3xl font-black text-white uppercase">Product & Variant Management</h1>
      </div>

      <AdminProductsClient initialProducts={products} categories={categories} />
    </div>
  );
}
