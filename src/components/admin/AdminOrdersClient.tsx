'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { dbService } from '@/lib/db/client';
import { exportToCSV } from '@/lib/utils/export';
import { Search, Eye, Printer, Download, Send, CheckCircle2 } from 'lucide-react';

interface Props {
  initialOrders: Order[];
}

export function AdminOrdersClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notificationAlert, setNotificationAlert] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await dbService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }

      await dbService.logAdminAction('admin@klstudios.com', 'Order Status Changed', 'Order', {
        order_id: orderId,
        new_status: newStatus,
      });

      // Automated Notification Trigger Alert
      if (newStatus === 'Shipped' || newStatus === 'Out for Delivery') {
        setNotificationAlert(`Automated dispatch notification sent to ${updated.customer_email} (${updated.customer_phone})`);
        setTimeout(() => setNotificationAlert(null), 4000);
      }
    }
  };

  const handleExportCSV = () => {
    const exportData = orders.map(o => ({
      OrderNumber: o.order_number,
      ClientName: o.customer_name,
      ClientEmail: o.customer_email,
      ClientPhone: o.customer_phone,
      DeliveryZone: o.delivery_zone_name || '',
      OrderStatus: o.order_status,
      PaymentStatus: o.payment_status,
      TotalAmount: o.total_amount,
      CreatedAt: o.created_at,
    }));
    exportToCSV(exportData, 'kl_studios_orders');
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || o.order_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Export Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by order #, client name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-3 text-slate-500" />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-3 rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Orders CSV
          </button>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500"
          >
            <option value="All">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Payment Confirmed">Payment Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {notificationAlert && (
        <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationAlert}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Client Contact</th>
                <th className="p-4">Date</th>
                <th className="p-4">Delivery Zone</th>
                <th className="p-4">Total Paid</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-850/50">
                  <td className="p-4 font-mono font-bold text-gold-400">{ord.order_number}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{ord.customer_name}</div>
                    <div className="text-[10px] text-slate-400">{ord.customer_phone} • {ord.customer_email}</div>
                  </td>
                  <td className="p-4 text-slate-400">{formatDate(ord.created_at)}</td>
                  <td className="p-4 text-slate-300">{ord.delivery_zone_name || 'Accra Central'}</td>
                  <td className="p-4 font-bold text-white">{formatCurrency(ord.total_amount)}</td>
                  <td className="p-4">
                    <select
                      value={ord.order_status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className="bg-slate-950 border border-slate-800 text-[11px] font-bold rounded py-1 px-2 text-gold-400 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Payment Confirmed">Payment Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 text-slate-400 hover:text-gold-400 rounded hover:bg-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Thermal Invoice */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Commercial Invoice & Dispatch Slip</h3>
                <p className="text-xs text-gold-400 font-mono font-bold">{selectedOrder.order_number}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white px-3 py-1.5 rounded flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400">
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="font-bold text-white uppercase text-[10px]">Client Details</h4>
                  <p>{selectedOrder.customer_name}</p>
                  <p>{selectedOrder.customer_phone}</p>
                  <p>{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-[10px]">Shipping Destination</h4>
                  <p>{selectedOrder.shipping_address.street_address}</p>
                  <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.region}</p>
                  <p className="text-gold-400 font-semibold">Zone: {selectedOrder.delivery_zone_name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[10px]">Purchased Items</h4>
                <div className="divide-y divide-slate-800">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between items-center">
                      <div>
                        <h5 className="font-semibold text-white">{item.product_name}</h5>
                        <p className="text-[10px] text-slate-400">SKU: {item.sku} • {item.variant_title} x {item.quantity}</p>
                      </div>
                      <span className="font-bold text-white">{formatCurrency(item.total_price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-800 text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Freight Fee</span>
                  <span>{formatCurrency(selectedOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Grand Total</span>
                  <span className="text-gold-400">{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
