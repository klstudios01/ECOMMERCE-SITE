import { z } from 'zod';

export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, 'Full name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z.string().min(8, 'Please enter a valid phone number'),
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  region: z.string().min(2, 'Region is required'),
  country: z.string().default('Ghana'),
  deliveryZoneId: z.string().min(1, 'Please select a delivery zone'),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const productSchema = z.object({
  name: z.string().min(3, 'Product title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description must be detailed'),
  basePrice: z.number().positive('Base price must be greater than 0'),
  salePrice: z.number().nullable().optional(),
  sku: z.string().min(3, 'SKU is required'),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  categoryId: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.number().positive('Discount value must be positive'),
  minOrderAmount: z.number().min(0).default(0),
  usageLimit: z.number().optional(),
  isActive: z.boolean().default(true),
});

export type CouponFormValues = z.infer<typeof couponSchema>;

export const reviewSchema = z.object({
  productId: z.string().uuid('Valid product ID is required'),
  authorName: z.string().min(2, 'Your name is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().optional(),
  comment: z.string().min(10, 'Review comment must be at least 10 characters'),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
