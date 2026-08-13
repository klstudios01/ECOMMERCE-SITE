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
    <div className="group relative bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-between hover:border-gold-500/40 transition-all duration-300 shadow-lg hover:shadow-gold-500/5">
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
              -{discount}%
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-gold-500 text-slate-950 text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
          }`}
          aria-label="Toggle Wishlist"
          title="Toggle Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-medium">
            <span className="truncate max-w-[110px] sm:max-w-none">{product.categories?.[0]?.name || 'Luxury Catalog'}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-current" />
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

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-baseline justify-between gap-1">
            <div className="text-sm sm:text-base font-black text-gold-400">
              {formatCurrency(defaultVariant.price)}
            </div>
            {product.sale_price && (
              <div className="text-[10px] sm:text-xs text-slate-500 line-through">
                {formatCurrency(product.base_price)}
              </div>
            )}
          </div>

          {/* Fully Responsive 2-Column Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="w-full bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-[11px] sm:text-xs py-2 px-1.5 rounded-lg border border-slate-800 flex items-center justify-center gap-1 transition-colors"
              title="Preview Product"
            >
              <Eye className="w-3.5 h-3.5 text-gold-500 shrink-0" />
              <span className="truncate">Preview</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2 px-1.5 rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gold-500 hover:bg-gold-600 text-slate-950'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Added!</span>
                </>
              ) : isOutOfStock ? (
                <span className="truncate">Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
