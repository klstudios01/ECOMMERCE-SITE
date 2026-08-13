'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant, Review } from '@/types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from './ProductCard';
import { dbService } from '@/lib/db/client';
import { Star, ShoppingBag, Heart, Check, ShieldCheck, Truck, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

interface Props {
  product: Product;
  initialReviews: Review[];
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, initialReviews, relatedProducts }: Props) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const defaultVariant = product.variants?.[0] || {
    id: `v-${product.id}`,
    product_id: product.id,
    sku: product.sku,
    title: 'Standard',
    options: {},
    price: product.sale_price || product.base_price,
    stock_quantity: 10,
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [activeImage, setActiveImage] = useState<string>(selectedVariant.image_url || product.images?.[0]?.url || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);

  // Review Form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.sale_price ? calculateDiscountPercentage(product.base_price, product.sale_price) : 0;
  const isOutOfStock = selectedVariant.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const newReview = await dbService.createReview({
        product_id: product.id,
        author_name: reviewAuthor.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        is_verified_purchase: true,
      });

      setReviewsList(prev => [newReview, ...prev]);
      setReviewAuthor('');
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to post review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Top Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-6">
            <img
              src={activeImage || product.images?.[0]?.url}
              alt={product.name}
              className="max-h-[450px] w-full object-contain"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-extrabold text-xs px-3 py-1 rounded tracking-wider uppercase">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-20 h-20 rounded-xl bg-slate-900 border p-2 shrink-0 overflow-hidden transition-colors ${
                    activeImage === img.url ? 'border-gold-500 ring-1 ring-gold-500' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt_text || ''} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gold-500 uppercase tracking-widest">
              <span>{product.categories?.[0]?.name || 'Luxury Category'}</span>
              <span>•</span>
              <span>SKU: {selectedVariant.sku}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{product.name}</h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating_avg) ? 'fill-current' : 'text-slate-700'}`} />
                ))}
              </div>
              <span className="font-bold text-white">{product.rating_avg}</span>
              <span>({reviewsList.length} verified reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 border-y border-slate-800 py-4">
            <span className="text-3xl font-black text-gold-400">
              {formatCurrency(selectedVariant.price)}
            </span>
            {product.sale_price && (
              <span className="text-base text-slate-500 line-through">
                {formatCurrency(product.base_price)}
              </span>
            )}
            <span className={`ml-auto text-xs font-bold px-3 py-1 rounded ${
              isOutOfStock ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `${selectedVariant.stock_quantity} In Stock`}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selectors */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Select Option:
              </label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      if (variant.image_url) setActiveImage(variant.image_url);
                    }}
                    className={`text-xs px-4 py-2.5 rounded-lg border font-semibold transition-all ${
                      selectedVariant.id === variant.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400 ring-1 ring-gold-500'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {variant.title} - {formatCurrency(variant.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stock_quantity, quantity + 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg border transition-colors ${
                  isWishlisted
                    ? 'border-rose-500 text-rose-500 bg-rose-500/10'
                    : 'border-slate-800 text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full font-bold text-xs py-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
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
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs py-4 rounded-lg transition-colors"
              >
                Buy Now (Instant Checkout)
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Door Freight</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
              <span>2-Yr Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Easy Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-8 pt-10 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Verified Opinions</span>
            <h2 className="text-2xl font-black text-white uppercase">Client Reviews ({reviewsList.length})</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Write a Review */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-white">Write a Client Review</h3>
            {reviewSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 p-2.5 rounded border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Your review has been submitted successfully.
              </p>
            )}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="5">5 Stars - Exceptional</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Average</option>
                  <option value="2">2 Stars - Poor</option>
                  <option value="1">1 Star - Terrible</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Review Comments</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your acoustic or build experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs py-3 rounded transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviewsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-8">No reviews written yet. Be the first to share your thoughts!</p>
            ) : (
              reviewsList.map((rev) => (
                <div key={rev.id} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-serif">"{rev.comment}"</p>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                    <span className="font-bold text-white">{rev.author_name}</span>
                    {rev.is_verified_purchase && (
                      <span className="text-emerald-400 font-semibold">✓ Verified Client</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-10 border-t border-slate-800">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Recommendations</span>
            <h2 className="text-2xl font-black text-white uppercase">You May Also Appreciate</h2>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
