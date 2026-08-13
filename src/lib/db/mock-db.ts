// IN-MEMORY DEMO DATABASE STORE FOR ZERO-DEPENDENCY LOCAL DEV & TESTING
import {
  Product,
  Category,
  Order,
  DeliveryZone,
  Coupon,
  Banner,
  Review,
  AuditLog,
  StoreSettings,
  CartItem,
} from '@/types';

// INITIAL DATA LOADED FROM SEED SPECIFICATIONS
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Audio & Acoustics',
    slug: 'audio-acoustics',
    description: 'Precision acoustic engineering, wireless headphones, and audiophile gear.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    display_order: 1,
    product_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Wearable Tech',
    slug: 'wearable-tech',
    description: 'Crafted titanium smartwatches and luxury fitness timepieces.',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    display_order: 2,
    product_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Leather Goods',
    slug: 'leather-goods',
    description: 'Handcrafted full-grain Italian leather bags and minimalist travel carry.',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    display_order: 3,
    product_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Apparel & Outerwear',
    slug: 'apparel-outerwear',
    description: 'Tailored organic fleece hoodies and urban outerwear essentials.',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    display_order: 4,
    product_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    name: 'Apex ANC Wireless Headphones',
    slug: 'apex-anc-wireless-headphones',
    description: 'Precision acoustic engineering meets active noise cancellation. Features custom 40mm beryllium drivers, 40-hour continuous battery life, ultra-plush memory foam ear cushions, and lossless Bluetooth 5.3 streaming.',
    base_price: 1450.00,
    sale_price: 1250.00,
    sku: 'AUD-APX-001',
    status: 'published',
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    rating_avg: 4.90,
    review_count: 38,
    seo_title: 'Apex ANC Wireless Headphones - Premium Lossless Audio',
    seo_description: 'Buy Apex ANC Wireless Headphones in Ghana with active noise cancellation and 40h battery.',
    categories: [INITIAL_CATEGORIES[0]],
    images: [
      { id: 'i1', product_id: 'p1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', alt_text: 'Matte Black Apex Headphones', display_order: 0, is_primary: true },
      { id: 'i2', product_id: 'p1', url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80', alt_text: 'Silver Titanium Edition', display_order: 1, is_primary: false }
    ],
    options: [
      { id: 'o1', product_id: 'p1', name: 'Color', values: ['Matte Black', 'Silver Titanium'] }
    ],
    variants: [
      { id: 'v1000000-0000-0000-0000-000000000001', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'AUD-APX-BLK', title: 'Matte Black', options: { Color: 'Matte Black' }, price: 1250.00, stock_quantity: 25, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
      { id: 'v1000000-0000-0000-0000-000000000002', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'AUD-APX-SLV', title: 'Silver Titanium', options: { Color: 'Silver Titanium' }, price: 1250.00, stock_quantity: 14, image_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    name: 'Chronos Sapphire Smartwatch',
    slug: 'chronos-sapphire-smartwatch',
    description: 'Forged from Grade 5 titanium with scratch-resistant sapphire crystal glass. Real-time biometric monitoring, standalone GPS tracking, 100m water resistance, and an AMOLED high-brightness display.',
    base_price: 2400.00,
    sale_price: null,
    sku: 'WRB-CHR-002',
    status: 'published',
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    rating_avg: 4.85,
    review_count: 24,
    categories: [INITIAL_CATEGORIES[1]],
    images: [
      { id: 'i3', product_id: 'p2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', alt_text: 'Chronos Sapphire Watch', display_order: 0, is_primary: true }
    ],
    options: [
      { id: 'o2', product_id: 'p2', name: 'Color', values: ['Midnight Onyx', 'Titanium Silver'] }
    ],
    variants: [
      { id: 'v1000000-0000-0000-0000-000000000003', product_id: 'p1000000-0000-0000-0000-000000000002', sku: 'WRB-CHR-BLK-O', title: 'Midnight Onyx', options: { Color: 'Midnight Onyx' }, price: 2400.00, stock_quantity: 10, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    name: 'Nomad Full-Grain Leather Weekender',
    slug: 'nomad-leather-weekender',
    description: 'Handmade from vegetable-tanned Italian full-grain leather. Designed for effortless weekend getaways with dedicated laptop compartment, shoe gallery, solid brass hardware, and YKK Excella zippers.',
    base_price: 1850.00,
    sale_price: 1650.00,
    sku: 'LTH-NMD-003',
    status: 'published',
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    rating_avg: 4.95,
    review_count: 19,
    categories: [INITIAL_CATEGORIES[2]],
    images: [
      { id: 'i4', product_id: 'p3', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80', alt_text: 'Nomad Weekender Tan', display_order: 0, is_primary: true }
    ],
    options: [
      { id: 'o3', product_id: 'p3', name: 'Color', values: ['Cognac Brown', 'Espresso Black'] }
    ],
    variants: [
      { id: 'v1000000-0000-0000-0000-000000000004', product_id: 'p1000000-0000-0000-0000-000000000003', sku: 'LTH-NMD-COG', title: 'Cognac Brown', options: { Color: 'Cognac Brown' }, price: 1650.00, stock_quantity: 8, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    name: 'Urban Heavyweight Fleece Hoodie',
    slug: 'urban-heavyweight-fleece-hoodie',
    description: 'Meticulously knit from 480 GSM organic combed cotton. Pre-shrunk relaxed fit, reinforced double-stitched seams, custom silver-tone eyelets, and kangaroo pouch pocket.',
    base_price: 680.00,
    sale_price: null,
    sku: 'APP-HOO-004',
    status: 'published',
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: true,
    rating_avg: 4.75,
    review_count: 42,
    categories: [INITIAL_CATEGORIES[3]],
    images: [
      { id: 'i5', product_id: 'p4', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80', alt_text: 'Urban Heavyweight Hoodie', display_order: 0, is_primary: true }
    ],
    options: [
      { id: 'o4', product_id: 'p4', name: 'Color', values: ['Charcoal Black', 'Oatmeal Beige'] },
      { id: 'o5', product_id: 'p4', name: 'Size', values: ['Medium', 'Large', 'X-Large'] }
    ],
    variants: [
      { id: 'v1000000-0000-0000-0000-000000000005', product_id: 'p1000000-0000-0000-0000-000000000004', sku: 'APP-HOO-BLK-M', title: 'Charcoal Black / Medium', options: { Color: 'Charcoal Black', Size: 'Medium' }, price: 680.00, stock_quantity: 30, image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80' },
      { id: 'v1000000-0000-0000-0000-000000000006', product_id: 'p1000000-0000-0000-0000-000000000004', sku: 'APP-HOO-BLK-L', title: 'Charcoal Black / Large', options: { Color: 'Charcoal Black', Size: 'Large' }, price: 680.00, stock_quantity: 20, image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'z1000000-0000-0000-0000-000000000001',
    name: 'Greater Accra Central',
    description: 'Express door delivery within Accra metro',
    estimated_delivery_days: '24 - 48 Hours',
    is_active: true,
    rates: [{ id: 'r1', zone_id: 'z1', rate: 35.00, free_shipping_threshold: 2000.00, min_order_amount: 0 }],
  },
  {
    id: 'z1000000-0000-0000-0000-000000000002',
    name: 'Tema & Environs',
    description: 'Standard delivery to Tema, Kpone, and Ashaiman',
    estimated_delivery_days: '2 - 3 Days',
    is_active: true,
    rates: [{ id: 'r2', zone_id: 'z2', rate: 45.00, free_shipping_threshold: 2500.00, min_order_amount: 0 }],
  },
  {
    id: 'z1000000-0000-0000-0000-000000000003',
    name: 'Kumasi & Ashanti Region',
    description: 'Express regional freight to Kumasi urban centers',
    estimated_delivery_days: '3 - 4 Days',
    is_active: true,
    rates: [{ id: 'r3', zone_id: 'z3', rate: 60.00, free_shipping_threshold: 3000.00, min_order_amount: 0 }],
  },
  {
    id: 'z1000000-0000-0000-0000-000000000004',
    name: 'Other Regions (Nationwide)',
    description: 'Courier delivery to all other regional capitals in Ghana',
    estimated_delivery_days: '4 - 6 Days',
    is_active: true,
    rates: [{ id: 'r4', zone_id: 'z4', rate: 85.00, free_shipping_threshold: 3500.00, min_order_amount: 0 }],
  },
  {
    id: 'z1000000-0000-0000-0000-000000000005',
    name: 'Store Pickup (Osu Flagship)',
    description: 'Pick up directly at our flagship store in Osu, Accra',
    estimated_delivery_days: 'Same Day',
    is_active: true,
    rates: [{ id: 'r5', zone_id: 'z5', rate: 0.00, free_shipping_threshold: 0, min_order_amount: 0 }],
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp1',
    code: 'WELCOME10',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 500,
    used_count: 14,
    is_active: true,
    start_date: new Date().toISOString(),
  },
  {
    id: 'cp2',
    code: 'SAVE200',
    discount_type: 'fixed_amount',
    discount_value: 200,
    min_order_amount: 1500,
    used_count: 8,
    is_active: true,
    start_date: new Date().toISOString(),
  },
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'THE LUXURY COLLECTION',
    subtitle: 'Experience uncompromising acoustic brilliance and Italian leather carry.',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    cta_text: 'Explore Catalog',
    cta_link: '/shop',
    is_active: true,
    display_order: 1,
  },
  {
    id: 'b2',
    title: 'NOMAD LEATHER WEEKENDER',
    subtitle: 'Forged from vegetable-tanned full-grain leather for a lifetime of journey.',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80',
    cta_text: 'Discover Leather Goods',
    cta_link: '/shop?category=leather-goods',
    is_active: true,
    display_order: 2,
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rv1',
    product_id: 'p1000000-0000-0000-0000-000000000001',
    author_name: 'Kojo Mensah',
    rating: 5,
    title: 'Astonishing sound clarity and build quality',
    comment: 'The ANC on the Apex headphones is superior to anything I have owned. The memory foam cushions make listening effortless for 8+ hours.',
    is_verified_purchase: true,
    is_approved: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rv2',
    product_id: 'p1000000-0000-0000-0000-000000000001',
    author_name: 'Abena Osei',
    rating: 5,
    title: 'Exceeded all expectations',
    comment: 'Fast delivery to Accra within 24 hours. The matte black finish looks incredibly premium in person.',
    is_verified_purchase: true,
    is_approved: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'ORD-2026-8891',
    customer_email: 'kwame.appiah@example.com',
    customer_name: 'Kwame Appiah',
    customer_phone: '+233 24 111 2222',
    shipping_address: {
      id: 'a1',
      customer_id: 'c1',
      full_name: 'Kwame Appiah',
      phone: '+233 24 111 2222',
      street_address: '14 Cantonments Road',
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      is_default: true,
    },
    delivery_zone_id: 'z1000000-0000-0000-0000-000000000001',
    delivery_zone_name: 'Greater Accra Central',
    delivery_fee: 35.00,
    subtotal: 1250.00,
    discount_amount: 100.00,
    tax_amount: 0.00,
    total_amount: 1185.00,
    currency: 'GHS',
    order_status: 'Payment Confirmed',
    payment_status: 'Paid',
    items: [
      {
        id: 'oi1',
        order_id: 'ord-1001',
        product_id: 'p1000000-0000-0000-0000-000000000001',
        variant_id: 'v1000000-0000-0000-0000-000000000001',
        product_name: 'Apex ANC Wireless Headphones',
        variant_title: 'Matte Black',
        sku: 'AUD-APX-BLK',
        unit_price: 1250.00,
        quantity: 1,
        total_price: 1250.00,
        product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  store_name: 'KL STUDIOS LUXURY COMMERCE',
  logo_url: '/logo.png',
  support_email: 'concierge@klstudios.com',
  support_phone: '+233 24 000 9999',
  store_address: 'Oxford Street, Osu, Accra, Ghana',
  currency: 'GHS',
  timezone: 'Africa/Accra',
};

// STATEFUL IN-MEMORY DATABASE WRAPPER FOR DEV / DEMO FALLBACK
class MockDatabase {
  categories: Category[] = [...INITIAL_CATEGORIES];
  products: Product[] = [...INITIAL_PRODUCTS];
  deliveryZones: DeliveryZone[] = [...INITIAL_DELIVERY_ZONES];
  coupons: Coupon[] = [...INITIAL_COUPONS];
  banners: Banner[] = [...INITIAL_BANNERS];
  reviews: Review[] = [...INITIAL_REVIEWS];
  orders: Order[] = [...INITIAL_ORDERS];
  settings: StoreSettings = { ...INITIAL_SETTINGS };
  auditLogs: AuditLog[] = [
    {
      id: 'al1',
      admin_email: 'admin@klstudios.com',
      action: 'Store Initialized',
      resource: 'System',
      created_at: new Date().toISOString(),
    },
  ];

  // PRODUCTS & VARIANTS
  getProducts(filters?: { categorySlug?: string; search?: string; status?: string }) {
    let result = [...this.products];
    if (filters?.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters?.categorySlug) {
      result = result.filter(p => p.categories?.some(c => c.slug === filters.categorySlug));
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      );
    }
    return result;
  }

  getProductBySlug(slug: string) {
    return this.products.find(p => p.slug === slug) || null;
  }

  getProductById(id: string) {
    return this.products.find(p => p.id === id) || null;
  }

  saveProduct(product: Partial<Product>) {
    if (product.id) {
      const idx = this.products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        this.products[idx] = { ...this.products[idx], ...product, updated_at: new Date().toISOString() };
        return this.products[idx];
      }
    }
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: product.name || 'New Product',
      slug: product.slug || `product-${Date.now()}`,
      description: product.description || '',
      base_price: product.base_price || 0,
      sale_price: product.sale_price,
      sku: product.sku || `SKU-${Date.now()}`,
      status: product.status || 'published',
      is_featured: product.is_featured || false,
      is_new_arrival: product.is_new_arrival || true,
      is_best_seller: product.is_best_seller || false,
      rating_avg: 5.0,
      review_count: 0,
      images: product.images || [],
      variants: product.variants || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  // ORDERS
  getOrders() {
    return [...this.orders];
  }

  getOrderById(id: string) {
    return this.orders.find(o => o.id === id || o.order_number === id) || null;
  }

  createOrder(orderData: Partial<Order>) {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_email: orderData.customer_email || 'guest@example.com',
      customer_name: orderData.customer_name || 'Valued Customer',
      customer_phone: orderData.customer_phone || '+233 24 000 0000',
      shipping_address: orderData.shipping_address!,
      delivery_zone_id: orderData.delivery_zone_id,
      delivery_fee: orderData.delivery_fee || 0,
      subtotal: orderData.subtotal || 0,
      discount_amount: orderData.discount_amount || 0,
      tax_amount: orderData.tax_amount || 0,
      total_amount: orderData.total_amount || 0,
      currency: 'GHS',
      order_status: orderData.order_status || 'Pending',
      payment_status: orderData.payment_status || 'Pending',
      items: orderData.items || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);

    // Deduct stock for variant items
    newOrder.items.forEach(item => {
      if (item.variant_id) {
        for (const p of this.products) {
          const v = p.variants?.find(varItem => varItem.id === item.variant_id);
          if (v) {
            v.stock_quantity = Math.max(0, v.stock_quantity - item.quantity);
            break;
          }
        }
      }
    });

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['order_status']) {
    const order = this.orders.find(o => o.id === orderId || o.order_number === orderId);
    if (order) {
      order.order_status = status;
      if (status === 'Payment Confirmed' || status === 'Processing') {
        order.payment_status = 'Paid';
      }
      order.updated_at = new Date().toISOString();
      return order;
    }
    return null;
  }

  // COUPONS
  getCoupons() {
    return [...this.coupons];
  }

  getCouponByCode(code: string) {
    return this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active) || null;
  }

  saveCoupon(couponData: Partial<Coupon>) {
    if (couponData.id) {
      const idx = this.coupons.findIndex(c => c.id === couponData.id);
      if (idx !== -1) {
        this.coupons[idx] = { ...this.coupons[idx], ...couponData };
        return this.coupons[idx];
      }
    }
    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: (couponData.code || `PROMO${Date.now()}`).toUpperCase(),
      discount_type: couponData.discount_type || 'percentage',
      discount_value: couponData.discount_value || 10,
      min_order_amount: couponData.min_order_amount || 0,
      used_count: 0,
      is_active: couponData.is_active !== undefined ? couponData.is_active : true,
      start_date: new Date().toISOString(),
    };
    this.coupons.unshift(newCoupon);
    return newCoupon;
  }

  deleteCoupon(id: string) {
    this.coupons = this.coupons.filter(c => c.id !== id);
    return true;
  }

  // REVIEWS
  getReviews(productId?: string) {
    if (productId) {
      return this.reviews.filter(r => r.product_id === productId && r.is_approved);
    }
    return [...this.reviews];
  }

  createReview(reviewData: Partial<Review>) {
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
    this.reviews.unshift(newReview);
    return newReview;
  }

  // AUDIT LOGS
  logAdminAction(email: string, action: string, resource: string, details?: any) {
    const log: AuditLog = {
      id: `al-${Date.now()}`,
      admin_email: email,
      action,
      resource,
      details,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

export const mockDb = new MockDatabase();
