// CENTRAL TYPINGS FOR E-COMMERCE PLATFORM

export type AdminRole = 'Super Admin' | 'Store Manager' | 'Order Manager' | 'Content Manager';

export interface Profile {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  profile_id: string;
  profile?: Profile;
  loyalty_points: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_featured: boolean;
  display_order: number;
  product_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductOption {
  id: string;
  product_id: string;
  name: string; // e.g. "Color", "Size"
  values: string[]; // e.g. ["Matte Black", "Silver Titanium"]
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  title: string; // e.g. "Matte Black"
  options: Record<string, string>; // {"Color": "Matte Black"}
  price: number;
  stock_quantity: number;
  image_url?: string;
  barcode?: string;
  weight_kg?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  sale_price?: number | null;
  sku: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  rating_avg: number;
  review_count: number;
  seo_title?: string;
  seo_description?: string;
  categories?: Category[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  options?: ProductOption[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  variant?: ProductVariant;
  product?: Product;
}

export interface Cart {
  id: string;
  customer_id?: string;
  session_id?: string;
  items: CartItem[];
  subtotal: number;
}

export interface Address {
  id: string;
  customer_id: string;
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  region: string;
  country: string;
  is_default: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  estimated_delivery_days: string;
  is_active: boolean;
  rates?: DeliveryRate[];
}

export interface DeliveryRate {
  id: string;
  zone_id: string;
  rate: number;
  free_shipping_threshold?: number;
  min_order_amount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Payment Confirmed' 
  | 'Processing' 
  | 'Ready for Delivery' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Refunded';

export type PaymentStatus = 'Unpaid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  variant_title: string;
  sku: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  product_image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: Address;
  delivery_zone_id?: string;
  delivery_zone_name?: string;
  delivery_fee: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id?: string;
  author_name: string;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  images?: string[];
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  is_active: boolean;
  display_order: number;
}

export interface StoreSettings {
  store_name: string;
  logo_url: string;
  support_email: string;
  support_phone: string;
  store_address: string;
  currency: string;
  timezone: string;
}

export interface AuditLog {
  id: string;
  admin_id?: string;
  admin_email?: string;
  action: string;
  resource: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}
