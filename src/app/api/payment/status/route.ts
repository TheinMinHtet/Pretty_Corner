import { NextRequest, NextResponse } from 'next/server';
import { getStorefrontRepository } from '@/lib/repository/StorefrontRepository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    const cleanId = orderId.trim().toUpperCase();
    const repo = getStorefrontRepository();
    const order = await repo.findOrder(cleanId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found', orderId: cleanId },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      total: order.total,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to query order payment status';
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}
