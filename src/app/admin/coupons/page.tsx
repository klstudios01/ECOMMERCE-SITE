import React from 'react';
import { dbService } from '@/lib/db/client';
import { AdminCouponsClient } from '@/components/admin/AdminCouponsClient';

export const revalidate = 0;

export default async function AdminCouponsPage() {
  const coupons = await dbService.getCoupons();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Promotions & Discounts</span>
        <h1 className="text-3xl font-black text-white uppercase">Promo Code & Voucher Management</h1>
      </div>

      <AdminCouponsClient initialCoupons={coupons} />
    </div>
  );
}
