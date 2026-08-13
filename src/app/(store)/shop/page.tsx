import React from 'react';
import { dbService } from '@/lib/db/client';
import { ShopCatalogClient } from '@/components/store/ShopCatalogClient';

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const resolvedParams = await searchParams;
  const [products, categories] = await Promise.all([
    dbService.getProducts({ status: 'published' }),
    dbService.getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Catalog</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase">Shop All Collections</h1>
        <p className="text-xs text-slate-400">
          Discover luxury acoustics, titanium smartwatches, and full-grain Italian leather carry.
        </p>
      </div>

      <ShopCatalogClient
        initialProducts={products}
        categories={categories}
        initialCategory={resolvedParams.category}
        initialSearch={resolvedParams.search}
        initialSort={resolvedParams.sort}
      />
    </div>
  );
}
