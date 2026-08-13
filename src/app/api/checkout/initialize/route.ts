import { NextResponse } from 'next/server';
import { checkoutFormSchema } from '@/lib/validation/schemas';
import { dbService } from '@/lib/db/client';
import { calculateOrderTotals } from '@/lib/orders/calculator';
import { initializePaystackTransaction } from '@/lib/payments/paystack';

// Basic in-memory rate limiter for checkout initialization (max 10 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();

    // Check rate limit
    const ipRecord = rateLimitMap.get(clientIp);
    if (ipRecord && now < ipRecord.expiresAt) {
      if (ipRecord.count >= 15) {
        return NextResponse.json(
          { success: false, error: 'Too many checkout attempts. Please wait a minute before trying again.' },
          { status: 429 }
        );
      }
      ipRecord.count += 1;
    } else {
      rateLimitMap.set(clientIp, { count: 1, expiresAt: now + 60000 });
    }

    const body = await request.json();
    
    // 1. Validate Form Input Payload via Zod
    const validationResult = checkoutFormSchema.safeParse(body.formData);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const formData = validationResult.data;
    const cartItemsInput = body.items || [];

    if (!Array.isArray(cartItemsInput) || cartItemsInput.length === 0) {
      return NextResponse.json({ success: false, error: 'Shopping cart is empty' }, { status: 400 });
    }

    // 2. Server-side validation of products and variants
    const allProducts = await dbService.getProducts();
    const validatedOrderItems = [];

    for (const item of cartItemsInput) {
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      let foundVariant = null;
      let foundProduct = null;

      for (const p of allProducts) {
        const v = p.variants?.find(varItem => varItem.id === item.variantId);
        if (v) {
          foundVariant = v;
          foundProduct = p;
          break;
        }
      }

      if (!foundVariant || !foundProduct) {
        return NextResponse.json(
          { success: false, error: `Invalid product variant requested: ${item.variantId}` },
          { status: 400 }
        );
      }

      // Check stock availability
      if (foundVariant.stock_quantity < quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${foundProduct.name} (${foundVariant.title}). Only ${foundVariant.stock_quantity} left.` },
          { status: 400 }
        );
      }

      validatedOrderItems.push({
        variant_id: foundVariant.id,
        product_id: foundProduct.id,
        product_name: foundProduct.name,
        variant_title: foundVariant.title,
        sku: foundVariant.sku,
        unit_price: foundVariant.price,
        quantity,
        total_price: foundVariant.price * quantity,
        product_image: foundVariant.image_url || foundProduct.images?.[0]?.url,
      });
    }

    // 3. Validate Delivery Zone
    const zones = await dbService.getDeliveryZones();
    const selectedZone = zones.find(z => z.id === formData.deliveryZoneId) || zones[0];
    const deliveryRate = selectedZone?.rates?.[0] || null;

    // 4. Validate Coupon if provided
    let appliedCoupon = null;
    if (formData.couponCode) {
      appliedCoupon = await dbService.getCouponByCode(formData.couponCode);
    }

    // 5. Enforce Server-Side Monetary Calculation
    const totals = calculateOrderTotals({
      items: validatedOrderItems,
      coupon: appliedCoupon,
      deliveryRate,
    });

    // 6. Create Pending Order Record in DB
    const newOrder = await dbService.createOrder({
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      shipping_address: {
        id: `addr-${Date.now()}`,
        customer_id: 'guest',
        full_name: formData.customerName,
        phone: formData.customerPhone,
        street_address: formData.streetAddress,
        city: formData.city,
        region: formData.region,
        country: formData.country,
        is_default: false,
      },
      delivery_zone_id: selectedZone.id,
      delivery_zone_name: selectedZone.name,
      delivery_fee: totals.deliveryFee,
      subtotal: totals.subtotal,
      discount_amount: totals.discountAmount,
      tax_amount: totals.taxAmount,
      total_amount: totals.totalAmount,
      order_status: 'Pending',
      payment_status: 'Unpaid',
      items: validatedOrderItems as any,
      notes: formData.notes,
    });

    // 7. Initialize Paystack Gateway Transaction
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const paystackResult = await initializePaystackTransaction({
      email: formData.customerEmail,
      amount: totals.totalAmount,
      reference: newOrder.order_number,
      callbackUrl: `${siteUrl}/checkout/success?reference=${newOrder.order_number}`,
      metadata: {
        order_id: newOrder.id,
        order_number: newOrder.order_number,
        customer_name: formData.customerName,
      },
    });

    if (!paystackResult.status || !paystackResult.data) {
      return NextResponse.json(
        { success: false, error: paystackResult.message || 'Payment gateway initialization failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.order_number,
      authorizationUrl: paystackResult.data.authorization_url,
      reference: paystackResult.data.reference,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Server processing error' }, { status: 500 });
  }
}
