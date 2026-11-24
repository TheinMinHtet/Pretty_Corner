import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { getStorefrontRepository } from '@/lib/repository/StorefrontRepository';
import { checkRateLimit } from '@/lib/rateLimit';

function getAdminClient() {
  try {
    return getSupabaseAdmin();
  } catch {
    return supabase;
  }
}

function corsHeaders(req?: NextRequest) {
  const origin = req?.headers.get('origin');
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://prettycornershopmm.com';
  let allowOrigin = allowedOrigin;
  if (
    origin &&
    (origin === allowedOrigin ||
      origin === 'https://prettycornershopmm.com' ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost:'))
  ) {
    allowOrigin = origin;
  }
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const rateCheck = checkRateLimit(`cancel_order_${ip}`, 30, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few moments before trying again.' },
        { status: 429, headers: corsHeaders(request) }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawOrderId = body.orderId;
    if (!rawOrderId || typeof rawOrderId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid orderId parameter' },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    const cleanId = rawOrderId.trim().toUpperCase();
    const client = getAdminClient();
    const repo = getStorefrontRepository();

    if (!client) {
      // Fallback in-memory repo update
      await repo.updatePaymentStatus(cleanId, 'cancelled');
      return NextResponse.json(
        { success: true, orderId: cleanId, status: 'cancelled' },
        { headers: corsHeaders(request) }
      );
    }

    // 1. Fetch current order from database
    const { data: orderData, error: fetchErr } = await client
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', cleanId)
      .maybeSingle();

    if (fetchErr) {
      console.warn(`[Order Cancel] Error querying order ${cleanId}:`, fetchErr);
    }

    // If order was already cancelled, idempotent return
    if (orderData && orderData.payment_status === 'cancelled') {
      await repo.updatePaymentStatus(cleanId, 'cancelled');
      return NextResponse.json(
        { success: true, orderId: cleanId, status: 'cancelled', alreadyCancelled: true },
        { headers: corsHeaders(request) }
      );
    }

    // 2. Persist cancellation in Supabase
    const { error: updateErr } = await client
      .from('orders')
      .update({
        payment_status: 'cancelled',
        fulfillment_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', cleanId);

    if (updateErr) {
      console.error(`[Order Cancel] Failed to update order status in Supabase for ${cleanId}:`, updateErr);
      return NextResponse.json(
        { error: 'Failed to update order status in database', details: updateErr.message },
        { status: 500, headers: corsHeaders(request) }
      );
    }

    // 3. Rollback inventory stock for each order line item
    if (orderData && Array.isArray(orderData.order_items)) {
      for (const item of orderData.order_items) {
        if (item.product_id) {
          try {
            const { data: currentProd } = await client
              .from('products')
              .select('id, name, slug, stock_quantity')
              .eq('id', item.product_id)
              .maybeSingle();

            if (currentProd && typeof currentProd.stock_quantity === 'number') {
              const prevStock = currentProd.stock_quantity;
              const nextStock = prevStock + (item.quantity || 1);

              await client
                .from('products')
                .update({
                  stock_quantity: nextStock,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', currentProd.id);

              await client.from('inventory_adjustments').insert({
                product_id: currentProd.id,
                product_name: currentProd.name,
                sku: currentProd.slug?.toUpperCase() || currentProd.id.slice(0, 8).toUpperCase(),
                type: 'increase',
                quantity: item.quantity || 1,
                previous_stock: prevStock,
                new_stock: nextStock,
                reason: `Customer cancelled order ${cleanId}`,
                performed_by: orderData.customer_name || 'Customer',
              });
            }
          } catch (invErr) {
            console.warn(`[Order Cancel] Inventory rollback notice for item ${item.product_id}:`, invErr);
          }
        }
      }
    }

    // 4. Rollback promo quota if applied
    if (orderData?.promo_code) {
      try {
        const { data: promoRow } = await client
          .from('promotions')
          .select('id')
          .ilike('code', orderData.promo_code.trim())
          .maybeSingle();

        if (promoRow?.id) {
          await client.rpc('decrement_promotion_usage', { p_id: promoRow.id });
        }
      } catch (promoErr) {
        console.warn(`[Order Cancel] Promo quota rollback notice for ${orderData.promo_code}:`, promoErr);
      }
    }

    // 5. Synchronize storefront repository
    await repo.updatePaymentStatus(cleanId, 'cancelled');

    return NextResponse.json(
      {
        success: true,
        orderId: cleanId,
        status: 'cancelled',
        message: `Order ${cleanId} has been successfully cancelled in database.`,
      },
      { headers: corsHeaders(request) }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to cancel order';
    console.error('[Order Cancel Unexpected Error]:', message);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
