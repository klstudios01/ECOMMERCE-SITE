// SERVER-SIDE ORDER MONETARY CALCULATION ENGINE
import { CartItem, Coupon, DeliveryRate } from '@/types';

export interface CalculationInput {
  items: Array<{
    variant_id: string;
    unit_price: number; // Server-validated price
    quantity: number;
  }>;
  coupon?: Coupon | null;
  deliveryRate?: DeliveryRate | null;
  taxRatePercent?: number; // e.g. 0% or VAT
}

export interface CalculationResult {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  appliedCouponCode?: string;
}

export function calculateOrderTotals(input: CalculationInput): CalculationResult {
  const { items, coupon, deliveryRate, taxRatePercent = 0 } = input;

  // 1. Calculate raw subtotal from validated server prices
  const rawSubtotal = items.reduce((sum, item) => {
    const itemQty = Math.max(1, Math.floor(item.quantity));
    const itemPrice = Math.max(0, item.unit_price);
    return sum + itemPrice * itemQty;
  }, 0);

  const subtotal = Math.round(rawSubtotal * 100) / 100;

  // 2. Calculate coupon discount if valid
  let discountAmount = 0;
  let appliedCouponCode: string | undefined = undefined;

  if (coupon && coupon.is_active) {
    const minOrder = coupon.min_order_amount || 0;
    if (subtotal >= minOrder) {
      appliedCouponCode = coupon.code;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (subtotal * coupon.discount_value) / 100;
        if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
          discountAmount = coupon.max_discount_amount;
        }
      } else if (coupon.discount_type === 'fixed_amount') {
        discountAmount = coupon.discount_value;
      }
    }
  }

  discountAmount = Math.min(subtotal, Math.round(discountAmount * 100) / 100);
  const discountedSubtotal = subtotal - discountAmount;

  // 3. Calculate delivery fee with free shipping threshold check
  let deliveryFee = 0;
  if (deliveryRate) {
    deliveryFee = deliveryRate.rate;
    if (
      deliveryRate.free_shipping_threshold &&
      deliveryRate.free_shipping_threshold > 0 &&
      subtotal >= deliveryRate.free_shipping_threshold
    ) {
      deliveryFee = 0;
    }
  }
  deliveryFee = Math.round(deliveryFee * 100) / 100;

  // 4. Calculate tax
  let taxAmount = 0;
  if (taxRatePercent > 0) {
    taxAmount = (discountedSubtotal * taxRatePercent) / 100;
  }
  taxAmount = Math.round(taxAmount * 100) / 100;

  // 5. Calculate final total
  const totalAmount = Math.max(0, Math.round((discountedSubtotal + deliveryFee + taxAmount) * 100) / 100);

  return {
    subtotal,
    discountAmount,
    deliveryFee,
    taxAmount,
    totalAmount,
    appliedCouponCode,
  };
}
