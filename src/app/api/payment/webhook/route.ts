import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getServerMMPaySdk, getMMPayConfig, handlePaymentSuccess } from '@/lib/mmpay';

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

      // Fallback verification across MyanMyanPay HMAC formats
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
          if (expected.toLowerCase() === signature.toLowerCase()) {
            isValid = true;
            break;
          }
        }
      }
    } else {
      // If keys are not set up yet (sandbox testing without credentials), accept with warning in dev
      if (process.env.NODE_ENV !== 'production' && !config.isConfigured) {
        isValid = true;
      }
    }

    if (!isValid && config.isConfigured) {
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
      await handlePaymentSuccess(orderId);
      console.log(`[MyanMyanPay Webhook] Order ${orderId} marked as paid successfully.`);
    }

    // MyanMyanPay requires HTTP 200 with { received: true }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown webhook error';
    console.error('[MyanMyanPay Webhook Error]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
