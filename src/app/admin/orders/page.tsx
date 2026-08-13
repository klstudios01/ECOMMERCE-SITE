import React from 'react';
import { dbService } from '@/lib/db/client';
import { AdminOrdersClient } from '@/components/admin/AdminOrdersClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await dbService.getOrders();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Fulfillment Logistics</span>
        <h1 className="text-3xl font-black text-white uppercase">Order Management & Invoicing</h1>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
