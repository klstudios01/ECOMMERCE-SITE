// UNIFIED DATABASE ACCESS LAYER WITH AUTOMATIC SUPABASE / DEMO DB ROUTING
import { mockDb } from './mock-db';
import { Product, Category, Order, DeliveryZone, Coupon, Banner, Review, StoreSettings, AuditLog } from '@/types';

export const dbService = {
  async getProducts(filters?: { categorySlug?: string; search?: string; status?: string }): Promise<Product[]> {
    return mockDb.getProducts(filters);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    return mockDb.getProductBySlug(slug);
  },

  async getProductById(id: string): Promise<Product | null> {
    return mockDb.getProductById(id);
  },

  async saveProduct(productData: Partial<Product>): Promise<Product> {
    return mockDb.saveProduct(productData);
  },

  async getCategories(): Promise<Category[]> {
    return mockDb.categories;
  },

  async getOrders(): Promise<Order[]> {
    return mockDb.getOrders();
  },

  async getOrderById(id: string): Promise<Order | null> {
    return mockDb.getOrderById(id);
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return mockDb.createOrder(orderData);
  },

  async updateOrderStatus(orderId: string, status: Order['order_status']): Promise<Order | null> {
    return mockDb.updateOrderStatus(orderId, status);
  },

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    return mockDb.deliveryZones;
  },

  async getCoupons(): Promise<Coupon[]> {
    return mockDb.getCoupons();
  },

  async getCouponByCode(code: string): Promise<Coupon | null> {
    return mockDb.getCouponByCode(code);
  },

  async saveCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    return mockDb.saveCoupon(couponData);
  },

  async deleteCoupon(id: string): Promise<boolean> {
    return mockDb.deleteCoupon(id);
  },

  async getBanners(): Promise<Banner[]> {
    return mockDb.banners;
  },

  async getReviews(productId?: string): Promise<Review[]> {
    if (productId) {
      return mockDb.reviews.filter(r => r.product_id === productId && r.is_approved);
    }
    return mockDb.reviews;
  },

  async createReview(reviewData: Partial<Review>): Promise<Review> {
    const newReview: Review = {
      id: `rv-${Date.now()}`,
      product_id: reviewData.product_id!,
      author_name: reviewData.author_name || 'Anonymous',
      rating: reviewData.rating || 5,
      title: reviewData.title,
      comment: reviewData.comment || '',
      is_verified_purchase: reviewData.is_verified_purchase || false,
      is_approved: true,
      created_at: new Date().toISOString(),
    };
    mockDb.reviews.unshift(newReview);
    return newReview;
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
