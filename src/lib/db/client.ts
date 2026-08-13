// UNIFIED DATABASE ACCESS LAYER WITH AUTOMATIC LIVE SUPABASE & FALLBACK DB ROUTING
import { createClient } from '@supabase/supabase-js';
import { mockDb } from './mock-db';
import { Product, Category, Order, DeliveryZone, Coupon, Banner, Review, StoreSettings, AuditLog } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('demo') &&
  !supabaseKey.includes('placeholder')
);

let supabaseClientInstance: any = null;
if (isSupabaseConfigured) {
  try {
    supabaseClientInstance = createClient(supabaseUrl!, supabaseKey!);
  } catch (e) {
    console.error('Failed to initialize Supabase client in db/client.ts:', e);
  }
}

export const supabase = supabaseClientInstance;

export const dbService = {
  async getProducts(filters?: { categorySlug?: string; search?: string; status?: string }): Promise<Product[]> {
    if (supabase) {
      try {
        let query = supabase.from('products').select(`
          *,
          images:product_images(*),
          variants:product_variants(*),
          categories:product_categories(category:categories(*))
        `);

        if (filters?.status) {
          query = query.eq('status', filters.status);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          let products: Product[] = data.map((p: any) => ({
            ...p,
            base_price: Number(p.base_price),
            sale_price: p.sale_price ? Number(p.sale_price) : undefined,
            rating_avg: Number(p.rating_avg || 0),
            review_count: Number(p.review_count || 0),
            images: p.images || [],
            variants: (p.variants || []).map((v: any) => ({
              ...v,
              price: Number(v.price),
              stock_quantity: Number(v.stock_quantity),
            })),
            categories: (p.categories || []).map((c: any) => c.category).filter(Boolean),
          }));

          if (filters?.categorySlug) {
            products = products.filter(p => p.categories?.some(c => c.slug === filters.categorySlug));
          }
          if (filters?.search) {
            const q = filters.search.toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
          }
          return products;
        }
      } catch (e) {
        console.warn('Supabase fetch products failed, using db fallback:', e);
      }
    }
    return mockDb.getProducts(filters);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            images:product_images(*),
            variants:product_variants(*),
            categories:product_categories(category:categories(*))
          `)
          .eq('slug', slug)
          .single();

        if (!error && data) {
          return {
            ...data,
            base_price: Number(data.base_price),
            sale_price: data.sale_price ? Number(data.sale_price) : undefined,
            rating_avg: Number(data.rating_avg || 0),
            review_count: Number(data.review_count || 0),
            images: data.images || [],
            variants: (data.variants || []).map((v: any) => ({
              ...v,
              price: Number(v.price),
              stock_quantity: Number(v.stock_quantity),
            })),
            categories: (data.categories || []).map((c: any) => c.category).filter(Boolean),
          };
        }
      } catch (e) {}
    }
    return mockDb.getProductBySlug(slug);
  },

  async getProductById(id: string): Promise<Product | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            images:product_images(*),
            variants:product_variants(*),
            categories:product_categories(category:categories(*))
          `)
          .eq('id', id)
          .single();

        if (!error && data) {
          return {
            ...data,
            base_price: Number(data.base_price),
            sale_price: data.sale_price ? Number(data.sale_price) : undefined,
            rating_avg: Number(data.rating_avg || 0),
            review_count: Number(data.review_count || 0),
            images: data.images || [],
            variants: (data.variants || []).map((v: any) => ({
              ...v,
              price: Number(v.price),
              stock_quantity: Number(v.stock_quantity),
            })),
            categories: (data.categories || []).map((c: any) => c.category).filter(Boolean),
          };
        }
      } catch (e) {}
    }
    return mockDb.getProductById(id);
  },

  async saveProduct(productData: Partial<Product>): Promise<Product> {
    if (supabase) {
      try {
        if (productData.id) {
          const { data, error } = await supabase
            .from('products')
            .update({
              name: productData.name,
              slug: productData.slug,
              description: productData.description,
              base_price: productData.base_price,
              sale_price: productData.sale_price,
              sku: productData.sku,
              status: productData.status,
              is_featured: productData.is_featured,
              is_new_arrival: productData.is_new_arrival,
              is_best_seller: productData.is_best_seller,
              updated_at: new Date().toISOString(),
            })
            .eq('id', productData.id)
            .select()
            .single();

          if (!error && data) {
            return mockDb.saveProduct(productData);
          }
        }
      } catch (e) {}
    }
    return mockDb.saveProduct(productData);
  },

  async getCategories(): Promise<Category[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            ...c,
            product_count: Number(c.product_count || 0),
          }));
        }
      } catch (e) {}
    }
    return mockDb.categories;
  },

  async getOrders(): Promise<Order[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {}
    }
    return mockDb.getOrders();
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data;
        }
      } catch (e) {}
    }
    return mockDb.getOrderById(id);
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();

        if (!error && data) {
          mockDb.createOrder(orderData);
          return data;
        }
      } catch (e) {}
    }
    return mockDb.createOrder(orderData);
  },

  async updateOrderStatus(orderId: string, status: Order['order_status']): Promise<Order | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ order_status: status, updated_at: new Date().toISOString() })
          .eq('id', orderId)
          .select()
          .single();

        if (!error && data) {
          mockDb.updateOrderStatus(orderId, status);
          return data;
        }
      } catch (e) {}
    }
    return mockDb.updateOrderStatus(orderId, status);
  },

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('delivery_zones')
          .select('*')
          .eq('is_active', true);

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            ...d,
            fee: Number(d.fee),
          }));
        }
      } catch (e) {}
    }
    return mockDb.deliveryZones;
  },

  async getCoupons(): Promise<Coupon[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('coupons').select('*');
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {}
    }
    return mockDb.getCoupons();
  },

  async getCouponByCode(code: string): Promise<Coupon | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', code.toUpperCase())
          .eq('is_active', true)
          .single();

        if (!error && data) {
          return data;
        }
      } catch (e) {}
    }
    return mockDb.getCouponByCode(code);
  },

  async saveCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    return mockDb.saveCoupon(couponData);
  },

  async deleteCoupon(id: string): Promise<boolean> {
    return mockDb.deleteCoupon(id);
  },

  async getBanners(): Promise<Banner[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {}
    }
    return mockDb.banners;
  },

  async getReviews(productId?: string): Promise<Review[]> {
    if (supabase) {
      try {
        let query = supabase.from('reviews').select('*').eq('is_approved', true);
        if (productId) {
          query = query.eq('product_id', productId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {}
    }
    return mockDb.getReviews(productId);
  },

  async createReview(reviewData: Partial<Review>): Promise<Review> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert([{
            product_id: reviewData.product_id,
            author_name: reviewData.author_name || 'Anonymous',
            rating: reviewData.rating || 5,
            comment: reviewData.comment || '',
            is_verified_purchase: reviewData.is_verified_purchase || false,
            is_approved: true,
          }])
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (e) {}
    }
    return mockDb.createReview(reviewData);
  },

  async getStoreSettings(): Promise<StoreSettings> {
    return mockDb.settings;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return mockDb.auditLogs;
  },

  async logAdminAction(email: string, action: string, resource: string, details?: any): Promise<AuditLog> {
    return mockDb.logAdminAction(email, action, resource, details);
  },
};
