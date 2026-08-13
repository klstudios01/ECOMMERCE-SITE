import { describe, it, expect } from 'vitest';
import { mockDb } from '../../src/lib/db/mock-db';

describe('Inventory & Stock Deductions', () => {
  it('deducts stock correctly when a valid order is created', () => {
    const product = mockDb.getProductById('p1000000-0000-0000-0000-000000000001');
    expect(product).toBeDefined();

    const variant = product?.variants?.[0];
    expect(variant).toBeDefined();

    const initialStock = variant!.stock_quantity;

    // Create a new order for 2 units
    mockDb.createOrder({
      customer_email: 'test@client.com',
      customer_name: 'Test Client',
      customer_phone: '+233 24 000 0000',
      shipping_address: {
        id: 'addr-1',
        customer_id: 'c1',
        full_name: 'Test Client',
        phone: '+233 24 000 0000',
        street_address: '10 Oxford St',
        city: 'Accra',
        region: 'Greater Accra',
        country: 'Ghana',
        is_default: true,
      },
      items: [
        {
          id: 'item-1',
          order_id: 'ord-test',
          variant_id: variant!.id,
          product_name: product!.name,
          variant_title: variant!.title,
          sku: variant!.sku,
          unit_price: variant!.price,
          quantity: 2,
          total_price: variant!.price * 2,
        },
      ],
      subtotal: variant!.price * 2,
      total_amount: variant!.price * 2,
    });

    const updatedProduct = mockDb.getProductById('p1000000-0000-0000-0000-000000000001');
    const updatedVariant = updatedProduct?.variants?.find(v => v.id === variant!.id);

    expect(updatedVariant!.stock_quantity).toBe(initialStock - 2);
  });
});
