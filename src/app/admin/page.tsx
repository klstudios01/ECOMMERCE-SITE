import React from 'react';
import { dbService } from '@/lib/db/client';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [products, orders, auditLogs] = await Promise.all([
    dbService.getProducts(),
    dbService.getOrders(),
    dbService.getAuditLogs(),
  ]);

  return <AdminDashboardClient products={products} orders={orders} auditLogs={auditLogs} />;
}
