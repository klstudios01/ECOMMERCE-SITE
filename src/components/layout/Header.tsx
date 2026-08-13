'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useThemeConfig } from '@/context/ThemeConfigContext';
import { formatCurrency } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const { cart, wishlist, setIsCartOpen, totals } = useStore();
  const { config } = useThemeConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Top Announcement Bar */}
      {config.enableFreeShippingBanner && (
        <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-2 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="font-medium tracking-wide">
              {config.topAnnouncementText}
            </p>
            <div className="flex items-center gap-6 text-slate-400">
              <span>Concierge: {config.supportPhone}</span>
              <Link href="/contact" className="hover:text-gold-400 transition-colors">
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4 sm:gap-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-xl sm:text-2xl text-white">
          {config.logoType === 'image' && config.logoImageUrl ? (
            <img src={config.logoImageUrl} alt={config.storeName} className="h-9 object-contain" />
          ) : (
            <>
              <span className="w-8 h-8 rounded bg-gold-500 text-slate-950 flex items-center justify-center font-black">
                {config.logoText.slice(0, 2)}
              </span>
              <span>{config.logoText}</span>
            </>
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-gold-400 transition-colors">Shop Catalog</Link>
          <Link href="/shop?category=audio-acoustics" className="hover:text-gold-400 transition-colors">Acoustics</Link>
          <Link href="/shop?category=leather-goods" className="hover:text-gold-400 transition-colors">Leather</Link>
          <Link href="/about" className="hover:text-gold-400 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gold-400 transition-colors">Contact</Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center flex-1 max-w-xs relative">
          <input
            type="text"
            placeholder="Search luxury catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-4 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
          />
          <button type="submit" className="absolute right-3 text-slate-400 hover:text-gold-400">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/account" className="p-2 text-slate-300 hover:text-gold-400 rounded-lg hover:bg-slate-900 transition-colors" aria-label="Customer Account">
            <User className="w-5 h-5" />
          </Link>

          {config.enableWishlist && (
            <Link href="/account?tab=wishlist" className="p-2 text-slate-300 hover:text-gold-400 rounded-lg hover:bg-slate-900 transition-colors relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-slate-300 hover:text-gold-400 rounded-lg hover:bg-slate-900 transition-colors relative flex items-center gap-2"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="hidden md:inline-block text-xs font-semibold text-gold-400">
              {formatCurrency(totals.subtotal)}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-6 py-6 space-y-6">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-4 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
            <button type="submit" className="absolute right-3 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="flex flex-col gap-4 text-base font-medium text-slate-200">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold-400">Home</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold-400">Shop Catalog</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold-400">About Brand</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold-400">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
