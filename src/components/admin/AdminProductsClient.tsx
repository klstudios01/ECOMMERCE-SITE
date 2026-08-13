'use client';

import React, { useState } from 'react';
import { Product, Category } from '@/types';
import { formatCurrency, slugify } from '@/lib/utils';
import { dbService } from '@/lib/db/client';
import { exportToCSV } from '@/lib/utils/export';
import { ImageUploader } from './ImageUploader';
import { Plus, Edit2, Search, X, CheckCircle2, Download } from 'lucide-react';

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

export function AdminProductsClient({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('1000');
  const [salePrice, setSalePrice] = useState('');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80');
  const [stock, setStock] = useState('15');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setDescription('');
    setBasePrice('1000');
    setSalePrice('');
    setSku(`SKU-${Date.now()}`);
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setDescription(prod.description);
    setBasePrice(prod.base_price.toString());
    setSalePrice(prod.sale_price ? prod.sale_price.toString() : '');
    setSku(prod.sku);
    setStatus(prod.status);
    setImageUrl(prod.images?.[0]?.url || '');
    setStock(prod.variants?.[0]?.stock_quantity.toString() || '10');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(slugify(val));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Product> = {
      id: editingProduct?.id,
      name,
      slug,
      description,
      base_price: Number(basePrice),
      sale_price: salePrice ? Number(salePrice) : null,
      sku,
      status,
      images: [{ id: 'i1', product_id: editingProduct?.id || 'p1', url: imageUrl, display_order: 0, is_primary: true }],
      variants: [
        {
          id: editingProduct?.variants?.[0]?.id || `v-${Date.now()}`,
          product_id: editingProduct?.id || 'p1',
          sku: `${sku}-STD`,
          title: 'Standard',
          options: {},
          price: salePrice ? Number(salePrice) : Number(basePrice),
          stock_quantity: Number(stock),
        },
      ],
    };

    const saved = await dbService.saveProduct(payload);

    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });

    await dbService.logAdminAction('admin@klstudios.com', editingProduct ? 'Product Updated' : 'Product Created', 'Product', {
      product_id: saved.id,
      name: saved.name,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsModalOpen(false);
    }, 1200);
  };

  const handleExportCSV = () => {
    const exportData = products.map(p => ({
      ID: p.id,
      Name: p.name,
      SKU: p.sku,
      BasePrice: p.base_price,
      SalePrice: p.sale_price || '',
      Status: p.status,
      Stock: p.variants?.[0]?.stock_quantity || 0,
    }));
    exportToCSV(exportData, 'kl_studios_products');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-3 text-slate-500" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Sale Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((product) => {
                const totalStock = product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
                return (
                  <tr key={product.id} className="hover:bg-slate-850/50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded bg-slate-950 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-white line-clamp-1">{product.name}</h4>
                        <p className="text-[10px] text-slate-400">{product.categories?.[0]?.name || 'Luxury'}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-gold-400 font-bold">{product.sku}</td>
                    <td className="p-4 font-bold text-white">{formatCurrency(product.base_price)}</td>
                    <td className="p-4 text-slate-400">
                      {product.sale_price ? formatCurrency(product.sale_price) : '—'}
                    </td>
                    <td className="p-4">
                      <span className={`font-bold ${totalStock <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {totalStock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 text-slate-400 hover:text-gold-400 rounded hover:bg-slate-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Product Parameters' : 'Create New Luxury Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded bg-emerald-950 text-emerald-300 text-xs flex items-center gap-2 border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Product details saved successfully!
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Base Price (GH₵) *</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Sale Price (GH₵ Optional)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Drag-and-Drop Image Uploader */}
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Primary Product Image *</label>
                <ImageUploader value={imageUrl} onChange={(url) => setImageUrl(url)} />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Detailed Specification & Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold px-6 py-2 rounded transition-colors"
                >
                  Save Product Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
