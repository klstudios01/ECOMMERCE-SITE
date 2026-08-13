'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, Search, RotateCcw, X, Grid, LayoutGrid } from 'lucide-react';

interface Props {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: string;
}

export function ShopCatalogClient({
  initialProducts,
  categories,
  initialCategory = '',
  initialSearch = '',
  initialSort = 'featured',
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [mobileCols, setMobileCols] = useState<'3' | '2'>('2');

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory) {
      result = result.filter(p => p.categories?.some(c => c.slug === selectedCategory));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    result = result.filter(p => {
      const price = p.sale_price || p.base_price;
      return price <= maxPrice;
    });

    if (inStockOnly) {
      result = result.filter(p => p.variants?.some(v => v.stock_quantity > 0));
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating_avg - a.rating_avg);
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy, maxPrice, inStockOnly]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('featured');
    setMaxPrice(3000);
    setInStockOnly(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Mobile Filter & Grid View Controls */}
      <div className="lg:hidden flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 bg-slate-900 border border-slate-800 text-xs font-semibold py-2.5 px-3 rounded-lg text-slate-200 flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4 text-gold-500" /> Filter Catalog
          </button>

          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setMobileCols('3')}
              className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
                mobileCols === '3' ? 'bg-gold-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="3 Columns Grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="text-[10px]">3 Grid</span>
            </button>
            <button
              onClick={() => setMobileCols('2')}
              className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
                mobileCols === '2' ? 'bg-gold-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="2 Columns Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[10px]">2 Grid</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> items
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg text-slate-200 focus:outline-none focus:border-gold-500"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Sidebar Filter Component */}
      <aside
        className={`fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 lg:relative lg:inset-auto lg:z-0 lg:bg-transparent lg:p-0 lg:block space-y-6 ${
          isMobileFilterOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="flex justify-between items-center lg:hidden pb-4 border-b border-slate-800">
          <h3 className="font-bold text-white text-base">Filters</h3>
          <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-500" /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-gold-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Query */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Search Products</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded py-2 pl-3 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-500" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Categories</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left text-xs py-1.5 px-3 rounded transition-colors ${
                  selectedCategory === ''
                    ? 'bg-gold-500/10 text-gold-400 font-bold border border-gold-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Categories ({initialProducts.length})
              </button>
              {categories.map((cat) => {
                const count = initialProducts.filter(p => p.categories?.some(c => c.slug === cat.slug)).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-xs py-1.5 px-3 rounded transition-colors flex justify-between items-center ${
                      selectedCategory === cat.slug
                        ? 'bg-gold-500/10 text-gold-400 font-bold border border-gold-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-500">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-semibold">Max Price</span>
              <span className="text-gold-400 font-bold">GH₵{maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold-500 bg-slate-950"
            />
          </div>

          {/* Availability Filter */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">In-Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-gold-500 rounded bg-slate-950 border-slate-800"
            />
          </div>
        </div>
      </aside>

      {/* Main Grid View */}
      <main className="lg:col-span-3 space-y-6">
        <div className="hidden lg:flex items-center justify-between bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl text-xs">
          <span className="text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredProducts.length}</strong> of {initialProducts.length} luxury products
          </span>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-semibold py-1.5 px-3 rounded text-white focus:outline-none focus:border-gold-500"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">No products matched your active filters</h3>
            <p className="text-xs text-slate-400">Try adjusting your price range or search terms.</p>
            <button
              onClick={handleResetFilters}
              className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={`grid ${mobileCols === '2' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
