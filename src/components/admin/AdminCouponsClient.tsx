'use client';

import React, { useState } from 'react';
import { Coupon } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { dbService } from '@/lib/db/client';
import { Tag, Plus, Trash2, X, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Props {
  initialCoupons: Coupon[];
}

export function AdminCouponsClient({ initialCoupons }: Props) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [discountValue, setDiscountValue] = useState('15');
  const [minOrderAmount, setMinOrderAmount] = useState('500');
  const [isActive, setIsActive] = useState(true);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const payload: Partial<Coupon> = {
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: Number(minOrderAmount),
      is_active: isActive,
    };

    const newCoupon = await dbService.saveCoupon(payload);
    setCoupons(prev => [newCoupon, ...prev]);

    await dbService.logAdminAction('admin@klstudios.com', 'Promo Coupon Created', 'Coupon', {
      code: newCoupon.code,
      discount_value: newCoupon.discount_value,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsModalOpen(false);
      setCode('');
    }, 1200);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    const updated = await dbService.saveCoupon({
      ...coupon,
      is_active: !coupon.is_active,
    });

    setCoupons(prev => prev.map(c => (c.id === coupon.id ? updated : c)));
    await dbService.logAdminAction('admin@klstudios.com', 'Promo Coupon Toggled', 'Coupon', {
      code: coupon.code,
      is_active: updated.is_active,
    });
  };

  const handleDeleteCoupon = async (id: string, codeName: string) => {
    if (!confirm(`Are you sure you want to remove promo code "${codeName}"?`)) return;

    await dbService.deleteCoupon(id);
    setCoupons(prev => prev.filter(c => c.id !== id));
    await dbService.logAdminAction('admin@klstudios.com', 'Promo Coupon Deleted', 'Coupon', {
      code: codeName,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Tag className="w-4 h-4 text-gold-500" /> Active Promo Vouchers: <strong className="text-white">{coupons.filter(c => c.is_active).length}</strong>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Promo Code
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 relative group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 font-mono font-bold text-lg text-gold-400">
                <Tag className="w-4 h-4 text-gold-500" />
                <span>{coupon.code}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(coupon)}
                  className="text-xs flex items-center gap-1 font-semibold"
                >
                  {coupon.is_active ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ToggleRight className="w-5 h-5" /> Active
                    </span>
                  ) : (
                    <span className="text-slate-500 font-bold flex items-center gap-1">
                      <ToggleLeft className="w-5 h-5" /> Inactive
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-850"
                  title="Remove Promo Code"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 border-t border-slate-850 pt-3">
              <div className="flex justify-between">
                <span>Discount Offer:</span>
                <span className="font-bold text-white">
                  {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : formatCurrency(coupon.discount_value)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Min Order Requirement:</span>
                <span className="font-semibold text-white">{formatCurrency(coupon.min_order_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Redemptions Used:</span>
                <span className="font-semibold text-white">{coupon.used_count || 0} times</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Store Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded bg-emerald-950 text-emerald-300 text-xs flex items-center gap-2 border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Promo voucher created successfully!
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Promo Code Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER15 or VIP200"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white uppercase font-mono focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1 font-bold text-gold-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (GH₵)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Min Order Requirement (GH₵) *</label>
                <input
                  type="number"
                  required
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300">Activate Immediately</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-gold-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold px-6 py-2 rounded transition-colors"
                >
                  Save Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
