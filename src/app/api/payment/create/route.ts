import { NextRequest, NextResponse } from 'next/server';
import { getServerMMPaySdk, getMMPayConfig } from '@/lib/mmpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, items, customMessage } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing orderId or amount' },
        { status: 400 }
      );
    }

    const config = getMMPayConfig();
    const sdk = getServerMMPaySdk();

    // If sandbox credentials are not configured yet, return simulation-ready response
    if (!sdk || !config.isConfigured) {
      return NextResponse.json({
        success: true,
        isConfigured: false,
        orderId,
        amount,
        message: 'MyanMyanPay sandbox keys not configured yet. Fallback to simulation.',
      });
    }

    const callbackUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || 'https://pretty-corner.vercel.app'
    }/api/payment/webhook`;

    const payResponse = await sdk.pay({
      orderId,
      amount: Math.round(Number(amount)),
      currency: 'MMK',
      callbackUrl,
      customMessage: customMessage || `Order ${orderId} at Pretty Corner`,
      items: Array.isArray(items)
        ? items.map((it: { name: string; price?: number; amount?: number; quantity: number }) => ({
            name: it.name,
            amount: it.price || it.amount || 0,
            quantity: it.quantity || 1,
          }))
        : undefined,
    });

    return NextResponse.json({
      success: true,
      isConfigured: true,
      data: payResponse,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown payment initialization error';
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}
