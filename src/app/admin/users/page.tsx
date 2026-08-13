import React from 'react';
import { dbService } from '@/lib/db/client';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';

export const revalidate = 0;

export default async function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Team Security</span>
        <h1 className="text-3xl font-black text-white uppercase">Admin Users & Role Assignments</h1>
      </div>

      <AdminUsersClient />
    </div>
  );
}
