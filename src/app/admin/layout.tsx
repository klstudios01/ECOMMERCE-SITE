'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isRouteAllowed } from '@/lib/auth/rbac';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Truck,
  Tag,
  FileText,
  Settings,
  Shield,
  Users,
  Code2,
  Store,
  LogOut,
  Menu,
  X,
  Lock,
  AlertTriangle,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated, isDevAuthenticated, adminEmail, adminRole, logoutAdmin, logoutDeveloper } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Authentication Gates Redirects
  useEffect(() => {
    // If accessing Developer Portal without passcode -> Redirect to Developer Login Gate
    if (pathname === '/admin/developer' && !isDevAuthenticated) {
      router.push('/developer/login');
      return;
    }

    // If accessing Admin portal pages without admin login -> Redirect to Admin Login Gate
    if (pathname !== '/admin/login' && pathname !== '/admin/developer' && !isAdminAuthenticated) {
      router.push('/admin/login');
      return;
    }
  }, [pathname, isAdminAuthenticated, isDevAuthenticated, router]);

  // If on login route or unauthenticated, pass children directly
  if (pathname === '/admin/login' || (pathname === '/admin/developer' && !isDevAuthenticated) || (pathname !== '/admin/developer' && !isAdminAuthenticated)) {
    return <>{children}</>;
  }

  // All Admin Navigation Items
  const allNavItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Developer Portal', href: '/admin/developer', icon: Code2, isDev: true },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Delivery Freight', href: '/admin/delivery', icon: Truck },
    { label: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
    { label: 'CMS Content', href: '/admin/content', icon: FileText },
    { label: 'Team Security', href: '/admin/users', icon: Users },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Security', href: '/admin/audit-logs', icon: Shield },
  ];

  // Filter navigation items strictly based on role permissions!
  const permittedNavItems = allNavItems.filter((item) => {
    if (item.isDev) return isDevAuthenticated;
    return isRouteAllowed(adminRole, item.href);
  });

  // Check if current route is authorized for logged in role
  const isCurrentRouteAuthorized = pathname === '/admin/developer' ? isDevAuthenticated : isRouteAllowed(adminRole, pathname);

  const handleLogout = () => {
    if (pathname === '/admin/developer') {
      logoutDeveloper();
      router.push('/developer/login');
    } else {
      logoutAdmin();
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-lg text-white">
            <span className="w-7 h-7 rounded bg-gold-500 text-slate-950 flex items-center justify-center font-black text-xs">KL</span>
            <span>ADMIN SYSTEM</span>
          </Link>
        </div>

        {/* User Role Badge */}
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center font-bold text-xs">
              {pathname === '/admin/developer' ? 'DEV' : adminRole.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                {pathname === '/admin/developer' ? 'Technical Manager' : adminEmail || 'Store Operator'}
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded border border-gold-500/20 block truncate mt-0.5">
                {pathname === '/admin/developer' ? 'Developer Mode' : adminRole}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items (Scoped to Role) */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {permittedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 text-xs font-semibold px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30 font-bold'
                    : item.isDev
                    ? 'bg-gold-500/10 text-gold-400 font-bold border border-gold-500/20 hover:bg-gold-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive || item.isDev ? 'text-gold-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 text-xs font-semibold px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Store className="w-4 h-4 text-gold-500" /> View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-xs font-semibold px-4 py-2.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" /> Sign Out ({adminRole})
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-white">
          <span className="w-6 h-6 rounded bg-gold-500 text-slate-950 flex items-center justify-center font-black text-xs">KL</span>
          <span className="text-sm">ADMIN SYSTEM</span>
        </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-slate-300">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
          {permittedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 text-xs font-semibold px-4 py-3 rounded-lg ${
                  isActive ? 'bg-gold-500/10 text-gold-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 text-xs font-semibold px-4 py-3 rounded-lg text-rose-400"
          >
            <LogOut className="w-4 h-4" /> Sign Out ({adminRole})
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
        {!isCurrentRouteAuthorized ? (
          <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
            <div className="max-w-md mx-auto space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-rose-400 font-bold text-xs tracking-widest uppercase">RBAC Security Restriction</span>
                <h2 className="text-2xl font-black text-white uppercase">Access Restricted</h2>
                <p className="text-xs text-slate-400">
                  Your current account role (<strong className="text-gold-400">{adminRole}</strong>) does not have permission to view or manage this module.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-lg inline-block transition-colors"
                >
                  Return to Authorized Overview
                </Link>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
