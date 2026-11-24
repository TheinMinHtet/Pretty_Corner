import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getServerMMPaySdk, getMMPayConfig, handlePaymentSuccess } from '@/lib/mmpay';
import { getStorefrontRepository } from '@/lib/repository/StorefrontRepository';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const nonce = req.headers.get('x-mmpay-nonce') || '';
    const signature = req.headers.get('x-mmpay-signature') || '';

    const config = getMMPayConfig();
    const sdk = getServerMMPaySdk();

    let isValid = false;

    if (config.secretKey && nonce && signature) {
      if (sdk) {
        try {
          isValid = await sdk.verifyCb(rawBody, nonce, signature);
        } catch (err) {
          console.warn('MyanMyanPay SDK verification attempt failed:', err);
        }
      }

      // Fallback verification across MyanMyanPay HMAC formats with constant-time equality
      if (!isValid) {
        const checkFormats = [
          `${nonce}.${rawBody}`, // Standard MyanMyanPay specification: nonce.body
          `${nonce}${rawBody}`,
        ];

        try {
          const parsed = JSON.parse(rawBody);
          const compact = JSON.stringify(parsed);
          checkFormats.push(`${nonce}.${compact}`);
          checkFormats.push(`${nonce}${compact}`);
        } catch {}

        for (const candidate of checkFormats) {
          const expected = crypto
            .createHmac('sha256', config.secretKey)
            .update(candidate)
            .digest('hex');

          const bufExpected = Buffer.from(expected.toLowerCase(), 'utf8');
          const bufSignature = Buffer.from(signature.toLowerCase(), 'utf8');

          if (
            bufExpected.length === bufSignature.length &&
            crypto.timingSafeEqual(bufExpected, bufSignature)
          ) {
            isValid = true;
            break;
          }
        }
      }
    } else {
      // If keys are not set up yet in local development, accept simulation only outside production
      if (process.env.NODE_ENV !== 'production' && !config.isConfigured) {
        isValid = true;
      }
    }

    if (!config.isConfigured && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Payment gateway configuration is missing' },
        { status: 503 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid MyanMyanPay signature' },
        { status: 401 }
      );
    }

    let payload: {
      orderId?: string;
      status?: string;
      amount?: number;
      transactionRefId?: string;
    } = {};

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { orderId, status } = payload;

    if (orderId && (status === 'SUCCESS' || status === 'PAID')) {
      const cleanOrderId = orderId.trim().toUpperCase();
      const repo = getStorefrontRepository();
      const order = await repo.findOrder(cleanOrderId);

      if (order) {
        const expectedTotal = Math.round(order.total);
        if (typeof payload.amount === 'number' && payload.amount < expectedTotal) {
          console.warn(
            `[MyanMyanPay Webhook] Underpayment detected for ${cleanOrderId}: expected ${expectedTotal}, got ${payload.amount}`
          );
          return NextResponse.json(
            { error: 'Payment amount does not match order total' },
            { status: 400 }
          );
        }
        await handlePaymentSuccess(cleanOrderId);
        console.log(`[MyanMyanPay Webhook] Order ${cleanOrderId} marked as paid successfully.`);
      } else {
        console.warn(`[MyanMyanPay Webhook] Order ${cleanOrderId} not found.`);
      }
    }

    // MyanMyanPay requires HTTP 200 with { received: true }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown webhook error';
    console.error('[MyanMyanPay Webhook Error]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'active',
      service: 'Pretty Corner Payment Webhook',
      endpoint: '/api/payment/webhook',
      domain: 'https://prettycornershopmm.com',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-mmpay-nonce, x-mmpay-signature',
    },
  });
}
