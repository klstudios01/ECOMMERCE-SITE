'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order, Product, Address } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Trash2,
  ArrowRight,
} from 'lucide-react';

interface Props {
  initialOrders: Order[];
  initialWishlist: any[];
  initialAddresses: Address[];
}

export function AccountClient({ initialOrders, initialWishlist, initialAddresses }: Props) {
  const router = useRouter();
  const { customer, logoutCustomer, changeCustomerPassword } = useAuth();
  const { wishlist, toggleWishlist } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'security'>('overview');

  // Security Gate: Automatically redirect to login page if user is not signed in
  useEffect(() => {
    if (!customer) {
      router.push('/login');
    }
  }, [customer, router]);

  // Real customer data filtering
  const userOrders = customer
    ? initialOrders.filter(o => o.customer_email?.toLowerCase() === customer.email.toLowerCase())
    : [];
  const userWishlist = wishlist;
  const userAddresses = initialAddresses;

  // Change Password Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    logoutCustomer();
    router.push('/login');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPass !== confirmPass) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation password do not match.' });
      return;
    }

    const res = changeCustomerPassword(currentPass, newPass);

    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const navItems = [
    { id: 'overview', label: 'Client Overview', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag, count: userOrders.length },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, count: userWishlist.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'security', label: 'Security & Password', icon: Lock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Bespoke Client Portal</span>
          <h1 className="text-3xl font-black text-white uppercase">{customer ? customer.name : 'Client Session'}</h1>
          <p className="text-xs text-slate-400">{customer ? customer.email : 'Not Signed In'} • Active Client Session</p>
        </div>

        <button
          onClick={handleSignOut}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-rose-400 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1 bg-slate-900 border border-slate-800 p-3 rounded-xl h-fit">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between text-xs font-semibold px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-gold-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-slate-950 text-gold-400' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Total Orders</span>
                  <div className="text-2xl font-black text-white">{userOrders.length}</div>
                </div>
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Wishlist Items</span>
                  <div className="text-2xl font-black text-white">{userWishlist.length}</div>
                </div>
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Saved Addresses</span>
                  <div className="text-2xl font-black text-white">{userAddresses.length}</div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders</h3>
                  {userOrders.length > 0 && (
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-gold-400 hover:underline">
                      View All
                    </button>
                  )}
                </div>

                {userOrders.length === 0 ? (
                  <div className="py-8 text-center space-y-2 text-xs text-slate-400">
                    <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold text-slate-300">No order history found</p>
                    <p className="text-[11px] text-slate-500">Your placed orders will appear here automatically.</p>
                    <Link href="/shop" className="inline-flex items-center gap-1.5 text-gold-400 font-bold hover:underline pt-2">
                      Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {userOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="py-3.5 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white">{order.order_number}</span>
                          <p className="text-[11px] text-slate-400">{formatDate(order.created_at)} • {order.items.length} Items</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gold-400">{formatCurrency(order.total_amount)}</span>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Order History Timeline</h3>
              {userOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3 text-xs text-slate-400">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="font-bold text-white text-sm">No orders placed yet</p>
                  <p className="text-slate-400 max-w-sm mx-auto">When you place orders, track live status and order item details here.</p>
                  <Link href="/shop" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition-colors">
                    Start Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {userOrders.map((order) => (
                    <div key={order.id} className="py-4 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                        <div>
                          <span className="font-mono font-bold text-gold-400 text-sm">{order.order_number}</span>
                          <p className="text-slate-400">Placed on {formatDate(order.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-sm">{formatCurrency(order.total_amount)}</span>
                          <span className="px-3 py-1 rounded text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {order.order_status}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-2 text-xs">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <span className="text-slate-300">{item.product_name} ({item.variant_title}) x {item.quantity}</span>
                            <span className="font-semibold text-white">{formatCurrency(item.total_price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Saved Wishlist Items</h3>
              {userWishlist.length === 0 ? (
                <div className="py-12 text-center space-y-3 text-xs text-slate-400">
                  <Heart className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="font-bold text-white text-sm">Your Wishlist is Empty</p>
                  <p className="text-slate-400 max-w-sm mx-auto">Explore our catalog and click the heart icon on any product to save it here.</p>
                  <Link href="/shop" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition-colors">
                    Explore Catalog <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userWishlist.map((product) => (
                    <div key={product.id} className="p-4 rounded bg-slate-950 border border-slate-800 flex gap-3 items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={product.images?.[0]?.url} alt={product.name} className="w-14 h-14 object-cover rounded bg-slate-900 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{product.name}</h4>
                          <span className="text-gold-400 font-bold text-xs">{formatCurrency(product.sale_price || product.base_price)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="p-2 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-900 transition-colors shrink-0"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Saved Delivery Destinations</h3>
              {userAddresses.length === 0 ? (
                <div className="py-12 text-center space-y-3 text-xs text-slate-400">
                  <MapPin className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="font-bold text-white text-sm">No Saved Addresses</p>
                  <p className="text-slate-400 max-w-sm mx-auto">Your shipping and delivery destinations will automatically be saved during checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {userAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-gold-400 uppercase text-[10px]">Default Address</span>
                      <h4 className="font-bold text-white">{addr.full_name}</h4>
                      <p className="text-slate-400">{addr.street_address}</p>
                      <p className="text-slate-400">{addr.city}, {addr.region}</p>
                      <p className="text-slate-500 font-mono">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECURITY & PASSWORD TAB */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-gold-500" /> Account Security & Password
                </h3>
                <p className="text-xs text-slate-400 mt-1">Update your client account password to secure your portal.</p>
              </div>

              {statusMessage && (
                <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  statusMessage.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-rose-950/80 border-rose-800 text-rose-300'
                }`}>
                  {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="font-semibold text-slate-300">Current Password *</label>
                  <div className="relative mt-1">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500"
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">New Password *</label>
                  <div className="relative mt-1">
                    <input
                      type="password"
                      required
                      placeholder="•••••••• (Min 6 characters)"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500"
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Confirm New Password *</label>
                  <div className="relative mt-1">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold-500"
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-lg transition-colors"
                >
                  Update Customer Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
