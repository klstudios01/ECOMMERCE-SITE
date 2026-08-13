import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Star, Quote } from 'lucide-react';
import { dbService } from '@/lib/db/client';
import { ProductCard } from '@/components/store/ProductCard';

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, banners, reviews] = await Promise.all([
    dbService.getProducts({ status: 'published' }),
    dbService.getCategories(),
    dbService.getBanners(),
    dbService.getReviews(),
  ]);

  const featuredProducts = products.filter(p => p.is_featured);
  const newArrivals = products.filter(p => p.is_new_arrival);
  const bestSellers = products.filter(p => p.is_best_seller);

  const heroBanner = banners[0] || {
    title: 'THE LUXURY COLLECTION',
    subtitle: 'Experience uncompromising acoustic brilliance and Italian leather carry.',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    cta_text: 'Explore Catalog',
    cta_link: '/shop',
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner.image_url}
            alt="Hero Background"
            className="w-full h-full object-cover brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 py-20">
          <span className="inline-block bg-gold-500/10 border border-gold-500/30 text-gold-400 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
            Bespoke Commercial Commerce
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none uppercase">
            Uncompromising <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600">
              Craftsmanship
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {heroBanner.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={heroBanner.cta_link || '/shop'}
              className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm px-8 py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 transition-colors"
            >
              {heroBanner.cta_text || 'Shop Catalog'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop?category=audio-acoustics"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white font-semibold text-sm px-8 py-4 rounded-lg backdrop-blur-md transition-colors"
            >
              Acoustic Collection
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION BAR */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Door Delivery</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Accra & nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Paystack SSL</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Card & MoMo payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Same-Day Pickup</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Osu flagship store</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Warranty</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">2-year client guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-row justify-between items-end gap-2 border-b border-slate-800 pb-3 sm:pb-4">
          <div>
            <span className="text-gold-500 font-bold text-[10px] sm:text-xs tracking-widest uppercase">Curated Selection</span>
            <h2 className="text-lg sm:text-3xl font-black text-white uppercase">Featured Releases</h2>
          </div>
          <Link href="/shop" className="text-[11px] sm:text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1 shrink-0">
            View All <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-8 space-y-6 sm:space-y-8">
        <div className="border-b border-slate-800 pb-3 sm:pb-4">
          <span className="text-gold-500 font-bold text-[10px] sm:text-xs tracking-widest uppercase">Explore by Category</span>
          <h2 className="text-lg sm:text-3xl font-black text-white uppercase">Store Collections</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-48 sm:h-72 rounded-xl overflow-hidden border border-slate-800/80 flex items-end p-4 sm:p-6 hover:border-gold-500/50 transition-colors"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-50"
              />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] sm:text-[11px] text-gold-400 font-semibold uppercase">{cat.product_count || 4} Products</span>
                <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-gold-300 transition-colors">{cat.name}</h3>
                <p className="hidden sm:block text-xs text-slate-300 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-8 space-y-6 sm:space-y-8">
        <div className="flex justify-between items-end border-b border-slate-800 pb-3 sm:pb-4">
          <div>
            <span className="text-gold-500 font-bold text-[10px] sm:text-xs tracking-widest uppercase">Freshly Minted</span>
            <h2 className="text-lg sm:text-3xl font-black text-white uppercase">New Arrivals</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. PROMOTIONAL BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-6 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
            <span className="bg-gold-500 text-slate-950 font-extrabold text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded tracking-wider uppercase">
              Exclusive Offer
            </span>
            <h2 className="text-xl sm:text-4xl font-black text-white leading-tight">
              Take GH₵200 Off Your First Orders Over GH₵1,500
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use promo code <span className="text-gold-400 font-bold tracking-widest">SAVE200</span> at checkout to claim your introductory voucher.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-5 py-3 rounded transition-colors"
              >
                Claim Offer Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative w-full md:w-1/2 h-48 sm:h-80 rounded-xl overflow-hidden border border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80"
              alt="Promo Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-8 space-y-6 sm:space-y-8">
        <div className="border-b border-slate-800 pb-3 sm:pb-4">
          <span className="text-gold-500 font-bold text-[10px] sm:text-xs tracking-widest uppercase">Client Favorites</span>
          <h2 className="text-lg sm:text-3xl font-black text-white uppercase">Best Sellers</h2>
        </div>

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Client Testimonials</span>
          <h2 className="text-3xl font-black text-white uppercase">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-8 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-700" />
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed font-serif">
                "{rev.comment}"
              </p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="font-bold text-white">{rev.author_name}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  ✓ Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. BRAND STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-14 rounded-2xl bg-slate-900/40 border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">The Heritage</span>
            <h2 className="text-3xl font-black text-white">Designed for Longevity & Precision</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              At KL STUDIOS, we reject throwaway consumerism. Every product in our catalog—from custom 40mm beryllium driver headphones to Italian vegetable-tanned weekender bags—is selected for structural integrity, aesthetic restraint, and tactile satisfaction.
            </p>
            <div className="pt-2">
              <Link href="/about" className="text-xs text-gold-400 font-bold hover:underline">
                Read Full Heritage Story →
              </Link>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
              alt="Brand Story"
              className="w-full h-72 object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
