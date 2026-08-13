'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Heart, Check, Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { ProductVariant } from '@/types';

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useStore();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const initialVariant = product.variants?.[0] || {
    id: `v-${product.id}`,
    product_id: product.id,
    sku: product.sku,
    title: 'Standard',
    options: {},
    price: product.sale_price || product.base_price,
    stock_quantity: 15,
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVariant);
  const [selectedImage, setSelectedImage] = useState(selectedVariant.image_url || product.images?.[0]?.url);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = selectedVariant.stock_quantity <= 0;
  const discountPercent = product.sale_price ? calculateDiscountPercentage(product.base_price, product.sale_price) : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Image */}
          <div className="relative bg-slate-950 p-6 flex items-center justify-center min-h-[300px]">
            <img
              src={selectedImage || product.images?.[0]?.url}
              alt={product.name}
              className="max-h-80 w-full object-contain rounded"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 md:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-gold-500 font-semibold uppercase tracking-wider">
                <span>{product.categories?.[0]?.name || 'Luxury Catalog'}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 font-bold">{product.rating_avg}</span>
                </div>
                <span>({product.review_count} verified reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-black text-gold-400">
                  {formatCurrency(selectedVariant.price)}
                </span>
                {product.sale_price && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatCurrency(product.base_price)}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 1 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-medium text-slate-300">Select Option:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariant(v);
                          if (v.image_url) setSelectedImage(v.image_url);
                        }}
                        className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                          selectedVariant.id === v.id
                            ? 'border-gold-500 bg-gold-500/10 text-gold-400 font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 font-bold text-xs py-3.5 rounded flex items-center justify-center gap-2 transition-colors ${
                    isOutOfStock
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gold-500 hover:bg-gold-600 text-slate-950'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart
                    </>
                  ) : isOutOfStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded border transition-colors ${
                    isWishlisted
                      ? 'border-rose-500 text-rose-500 bg-rose-500/10'
                      : 'border-slate-800 text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="block text-center text-xs text-slate-400 hover:text-gold-400 underline"
              >
                View Full Product Specifications →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
