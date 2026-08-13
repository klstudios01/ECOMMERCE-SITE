'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const { customer } = useAuth();
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  const defaultVariant = product.variants?.[0] || {
    id: `v-${product.id}`,
    product_id: product.id,
    sku: product.sku,
    title: 'Standard',
    options: {},
    price: product.sale_price || product.base_price,
    stock_quantity: 10,
  };

  const discount = product.sale_price ? calculateDiscountPercentage(product.base_price, product.sale_price) : 0;
  const isOutOfStock = defaultVariant.stock_quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, defaultVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!customer) {
      router.push('/login');
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-slate-900 border border-slate-800/80 rounded-lg sm:rounded-xl overflow-hidden flex flex-col justify-between hover:border-gold-500/40 transition-all duration-300 shadow-lg hover:shadow-gold-500/5">
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col gap-0.5 sm:gap-1 z-10">
          {discount > 0 && (
            <span className="bg-rose-500 text-white text-[8px] sm:text-[10px] font-extrabold px-1 sm:px-2 py-0.5 rounded tracking-wider uppercase">
              -{discount}%
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-gold-500 text-slate-950 text-[8px] sm:text-[10px] font-extrabold px-1 sm:px-2 py-0.5 rounded tracking-wider uppercase">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10 p-1 sm:p-2 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-0 bottom-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <button
            onClick={(e) => {
              e.preventDefault();
              setQuickViewProduct(product);
            }}
            className="w-full bg-slate-950/90 hover:bg-slate-950 text-slate-200 font-semibold text-xs py-2.5 rounded backdrop-blur-md border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4 md:p-5 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-400 font-medium">
            <span className="hidden min-[480px]:inline truncate max-w-[90px] sm:max-w-none">{product.categories?.[0]?.name || 'Luxury'}</span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-400">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span className="font-bold text-slate-200">{product.rating_avg}</span>
            </div>
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-gold-400 transition-colors">
            <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 sm:line-clamp-2 leading-tight">{product.name}</h3>
          </Link>

          <p className="hidden sm:block text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Cart CTA */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-800/80 flex flex-col min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between gap-1.5 sm:gap-2">
          <div>
            <div className="text-xs sm:text-sm md:text-base font-black text-gold-400">
              {formatCurrency(defaultVariant.price)}
            </div>
            {product.sale_price && (
              <div className="text-[9px] sm:text-[11px] text-slate-500 line-through">
                {formatCurrency(product.base_price)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full min-[380px]:w-auto px-1.5 py-1 sm:px-3 sm:py-2 rounded font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-500 text-white'
                : 'bg-gold-500 hover:bg-gold-600 text-slate-950'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="inline">Added</span>
              </>
            ) : isOutOfStock ? (
              'Out'
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
