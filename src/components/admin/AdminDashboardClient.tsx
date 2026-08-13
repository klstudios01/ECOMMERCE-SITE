'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { Product, Order, AuditLog } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp, ArrowUpRight, Calendar } from 'lucide-react';

interface Props {
  products: Product[];
  orders: Order[];
  auditLogs: AuditLog[];
}

export function AdminDashboardClient({ products, orders, auditLogs }: Props) {
  const [dateRange, setDateRange] = useState<'7D' | '30D' | '90D' | 'YEAR'>('30D');

  const totalSales = orders
    .filter(o => o.payment_status === 'Paid')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.order_status === 'Pending').length;
  const lowStockCount = products.filter(p => p.variants?.some(v => v.stock_quantity <= 5)).length;

  // Chart Mock Time Series Data
  const chartData = [
    { date: 'Aug 01', revenue: 1450, orders: 2 },
    { date: 'Aug 04', revenue: 2900, orders: 4 },
    { date: 'Aug 07', revenue: 1850, orders: 3 },
    { date: 'Aug 10', revenue: 4200, orders: 6 },
    { date: 'Aug 13', revenue: 3680, orders: 5 },
  ];

  const categorySalesData = [
    { category: 'Acoustics', sales: 4800 },
    { category: 'Wearables', sales: 2400 },
    { category: 'Leather', sales: 3300 },
    { category: 'Apparel', sales: 1360 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Executive Dashboard</span>
          <h1 className="text-3xl font-black text-white uppercase">Store Operations & Revenue</h1>
        </div>

        {/* Date Range Selector & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-gold-500 ml-2 mr-1" />
            {(['7D', '30D', '90D', 'YEAR'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  dateRange === range ? 'bg-gold-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
          >
            + Create Product
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-2xl font-black text-white">{formatCurrency(totalSales)}</div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs previous 30 days
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-2xl font-black text-white">{totalOrdersCount}</div>
          <p className="text-[11px] text-amber-400 font-semibold">{pendingOrdersCount} Pending Fulfillment</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Published Products</span>
            <Package className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-2xl font-black text-white">{products.length}</div>
          <p className="text-[11px] text-slate-400">Across 4 Luxury Categories</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-400">{lowStockCount}</div>
          <p className="text-[11px] text-slate-400">Variants below threshold (5)</p>
        </div>
      </div>

      {/* Interactive Recharts Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Over Time Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Trend (GH₵)</h3>
            <span className="text-xs text-gold-400 font-bold">Active Range: {dateRange}</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: any) => [`GH₵${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales By Category Bar Chart */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sales By Category</h3>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: any) => [`GH₵${value}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Queue & Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders Queue</h3>
            <Link href="/admin/orders" className="text-xs text-gold-400 hover:underline flex items-center gap-1">
              View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {orders.map((ord) => (
              <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{ord.order_number}</span>
                    <span className="text-slate-400">• {ord.customer_name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{formatDate(ord.created_at)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-gold-400">{formatCurrency(ord.total_amount)}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {ord.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Admin Security Audit</h3>
            <Link href="/admin/audit-logs" className="text-xs text-gold-400 hover:underline">
              View Logs
            </Link>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-gold-400">{log.action}</span>
                  <span className="text-slate-500">{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-[11px] text-slate-400">Resource: {log.resource} ({log.admin_email || 'System'})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
