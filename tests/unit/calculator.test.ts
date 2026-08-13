import { describe, it, expect } from 'vitest';
import { calculateOrderTotals } from '../../src/lib/orders/calculator';
import { Coupon, DeliveryRate } from '../../src/types';

describe('Server-Side Order Calculator Engine', () => {
  it('calculates simple subtotal without discount or shipping', () => {
    const result = calculateOrderTotals({
      items: [
        { variant_id: 'v1', unit_price: 100, quantity: 2 },
        { variant_id: 'v2', unit_price: 50, quantity: 1 },
      ],
    });

    expect(result.subtotal).toBe(250);
    expect(result.discountAmount).toBe(0);
    expect(result.deliveryFee).toBe(0);
    expect(result.totalAmount).toBe(250);
  });

  it('applies percentage discount correctly with minimum order threshold', () => {
    const coupon: Coupon = {
      id: 'c1',
      code: 'SAVE10',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 100,
      used_count: 0,
      is_active: true,
      start_date: new Date().toISOString(),
    };

    const result = calculateOrderTotals({
      items: [{ variant_id: 'v1', unit_price: 500, quantity: 1 }],
      coupon,
    });

    expect(result.subtotal).toBe(500);
    expect(result.discountAmount).toBe(50);
    expect(result.totalAmount).toBe(450);
    expect(result.appliedCouponCode).toBe('SAVE10');
  });

  it('rejects coupon if subtotal is below minimum order amount', () => {
    const coupon: Coupon = {
      id: 'c1',
      code: 'BIGSAVER',
      discount_type: 'fixed_amount',
      discount_value: 100,
      min_order_amount: 1000,
      used_count: 0,
      is_active: true,
      start_date: new Date().toISOString(),
    };

    const result = calculateOrderTotals({
      items: [{ variant_id: 'v1', unit_price: 500, quantity: 1 }],
      coupon,
    });

    expect(result.subtotal).toBe(500);
    expect(result.discountAmount).toBe(0);
    expect(result.totalAmount).toBe(500);
    expect(result.appliedCouponCode).toBeUndefined();
  });

  it('applies free shipping when subtotal reaches free shipping threshold', () => {
    const deliveryRate: DeliveryRate = {
      id: 'dr1',
      zone_id: 'z1',
      rate: 45,
      free_shipping_threshold: 1000,
    };

    const resultLow = calculateOrderTotals({
      items: [{ variant_id: 'v1', unit_price: 500, quantity: 1 }],
      deliveryRate,
    });
    expect(resultLow.deliveryFee).toBe(45);
    expect(resultLow.totalAmount).toBe(545);

    const resultHigh = calculateOrderTotals({
      items: [{ variant_id: 'v1', unit_price: 1200, quantity: 1 }],
      deliveryRate,
    });
    expect(resultHigh.deliveryFee).toBe(0);
    expect(resultHigh.totalAmount).toBe(1200);
  });
});
