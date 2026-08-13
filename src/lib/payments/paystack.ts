import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_demo_paystack_secret_key';

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number; // in sub-units (pesewas)
    currency: string;
    gateway_response: string;
    channel: string;
    customer: {
      email: string;
      customer_code: string;
    };
    metadata?: Record<string, any>;
  };
}

export async function initializePaystackTransaction(params: {
  email: string;
  amount: number; // in GHS (e.g. 150.00)
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}): Promise<PaystackInitResponse> {
  const { email, amount, reference, callbackUrl, metadata } = params;

  // Convert GHS to Pesewas (x 100)
  const amountInPesewas = Math.round(amount * 100);

  // If running in demo / development mode without real Paystack secret
  if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY.includes('demo')) {
    return {
      status: true,
      message: 'Demo transaction initialized',
      data: {
        authorization_url: `/checkout/success?reference=${reference}`,
        access_code: `demo_access_${reference}`,
        reference,
      },
    };
  }

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInPesewas,
        currency: 'GHS',
        reference,
        callback_url: callbackUrl,
        metadata,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    return {
      status: false,
      message: error?.message || 'Failed to communicate with Paystack API',
    };
  }
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResponse> {
  if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY.includes('demo')) {
    return {
      status: true,
      message: 'Demo transaction verified successfully',
      data: {
        id: 99999999,
        domain: 'test',
        status: 'success',
        reference,
        amount: 15000,
        currency: 'GHS',
        gateway_response: 'Successful demo payment',
        channel: 'card',
        customer: {
          email: 'demo@customer.com',
          customer_code: 'CUS_demo123',
        },
      },
    };
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    return {
      status: false,
      message: error?.message || 'Failed to verify transaction with Paystack API',
    };
  }
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string): boolean {
  const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!webhookSecret) return false;

  try {
    const hash = crypto.createHmac('sha512', webhookSecret).update(rawBody).digest('hex');
    return hash === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}
