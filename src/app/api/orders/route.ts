import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { Order, CartItem, Promotion } from '@/lib/types';
import { calculatePricing } from '@/lib/cart/CartEngine';

function isUuid(val?: string): boolean {
  return Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));
}

function getAdminClient() {
  try {
    return getSupabaseAdmin();
  } catch {
    return supabase;
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(request: NextRequest) {
  try {
    const client = getAdminClient();
    if (!client) {
      return NextResponse.json({ error: 'Database client unavailable' }, { status: 503, headers: corsHeaders() });
    }

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const orderId = searchParams.get('orderId');

    let query = client
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (orderId) {
      query = query.ilike('id', orderId.trim());
    } else if (phone) {
      query = query.ilike('phone', `%${phone.trim()}%`);
    } else {
      query = query.limit(25);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
    }

    return NextResponse.json({ orders: data || [] }, { headers: corsHeaders() });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to retrieve orders' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: NextRequest) {
  let promoToRollback: string | null = null;
  const client = getAdminClient();

  try {
    if (!client) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503, headers: corsHeaders() });
    }

    const body = await request.json();
    const {
      id: customOrderId,
      customerName,
      phone,
      deliveryAddress,
      township,
      landmarkNote,
      items,
      paymentMethod,
      paymentStatus = 'pending',
      fulfillmentStatus = 'pending_review',
      promoCode,
      appliedPromotionId,
    } = body;

    // 1. Mandatory Input Validation
    if (!customerName?.trim() || !phone?.trim() || !deliveryAddress?.trim()) {
      return NextResponse.json(
        { error: 'Customer name, phone number, and delivery address are required.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // 2. Normalize Line Items & Stock Availability Check
    const normalizedItems: CartItem[] = items.map((it: any) => ({
      id: it.id || it.productId,
      productId: it.productId,
      name: it.name,
      size: it.size || '',
      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 1,
      image: it.image || '',
    }));

    for (const item of normalizedItems) {
      if (item.productId) {
        let prodQuery = client.from('products').select('id, name, stock_quantity');
        if (isUuid(item.productId)) {
          prodQuery = prodQuery.eq('id', item.productId);
        } else {
          prodQuery = prodQuery.or(`slug.eq.${item.productId},name.eq.${item.name}`);
        }
        const { data: prodData } = await prodQuery.maybeSingle();
        if (prodData && typeof prodData.stock_quantity === 'number') {
          if (prodData.stock_quantity < item.quantity) {
            return NextResponse.json(
              {
                error: `${prodData.name} only has ${prodData.stock_quantity} unit(s) remaining in stock. Please adjust your bag quantity.`,
              },
              { status: 409, headers: corsHeaders() }
            );
          }
        }
      }
    }

    // 3. Promotion Validation & Atomic Quota Reservation
    let matchedPromo: Promotion | null = null;
    let promoDiscount = 0;

    if (promoCode || appliedPromotionId) {
      let promoQuery = client.from('promotions').select('*');
      if (appliedPromotionId) {
        promoQuery = promoQuery.eq('id', appliedPromotionId);
      } else {
        promoQuery = promoQuery.ilike('code', promoCode.trim());
      }

      const { data: promoRow, error: promoError } = await promoQuery.maybeSingle();

      if (promoError || !promoRow) {
        return NextResponse.json(
          { error: 'The entered promotion code is invalid or no longer exists.' },
          { status: 400, headers: corsHeaders() }
        );
      }

      // Check Active Flag
      if (promoRow.is_active === false) {
        return NextResponse.json(
          { error: 'This promotion is currently inactive.' },
          { status: 400, headers: corsHeaders() }
        );
      }

      // Check Out of Stock Flag
      if (promoRow.is_out_of_stock === true) {
        return NextResponse.json(
          { error: 'This promotion is temporarily unavailable due to stock depletion.' },
          { status: 409, headers: corsHeaders() }
        );
      }

      // Check Temporal Validity
      const now = new Date();
      if (promoRow.start_date && new Date(promoRow.start_date) > now) {
        return NextResponse.json(
          { error: 'This promotion has not started yet.' },
          { status: 400, headers: corsHeaders() }
        );
      }
      if (promoRow.end_date && new Date(promoRow.end_date) < now) {
        return NextResponse.json(
          { error: 'This promotion has expired.' },
          { status: 400, headers: corsHeaders() }
        );
      }

      // Check Usage Limit before RPC
      if (
        promoRow.usage_limit !== null &&
        promoRow.usage_limit !== undefined &&
        promoRow.usage_count >= promoRow.usage_limit
      ) {
        return NextResponse.json(
          { error: 'Promotion usage limit has been fully exhausted.' },
          { status: 409, headers: corsHeaders() }
        );
      }

      matchedPromo = {
        id: promoRow.id,
        slug: promoRow.slug || undefined,
        code: promoRow.code,
        title: promoRow.title,
        subtitle: promoRow.subtitle || undefined,
        discountPercentage: Number(promoRow.discount_percentage) || 0,
        startDate: promoRow.start_date,
        endDate: promoRow.end_date,
        active: Boolean(promoRow.is_active),
        targetType: promoRow.target_type || 'ENTIRE_STORE',
        targetSlug: promoRow.target_slug || undefined,
        usageLimit: promoRow.usage_limit ? Number(promoRow.usage_limit) : undefined,
        usageCount: Number(promoRow.usage_count) || 0,
        minimumOrderAmount: promoRow.minimum_order_amount
          ? Number(promoRow.minimum_order_amount)
          : undefined,
        featuredProductIds: Array.isArray(promoRow.featured_product_ids)
          ? promoRow.featured_product_ids
          : [],
        isOutOfStock: Boolean(promoRow.is_out_of_stock),
      };

      // Atomic RPC Quota Increment (Row-Level Lock)
      const { data: incrementResult, error: rpcErr } = await client.rpc(
        'increment_promotion_usage',
        { p_id: promoRow.id }
      );

      if (rpcErr || !incrementResult) {
        return NextResponse.json(
          { error: 'Promotion quota has been exhausted. Please proceed without code.' },
          { status: 409, headers: corsHeaders() }
        );
      }

      // Set rollback pointer in case subsequent insert fails
      promoToRollback = promoRow.id;
    }

    // 4. Re-calculate Pricing Server-Side with Full Catalog Awareness
    const { data: dbProducts } = await client.from('products').select('id, slug, name, price, categories(slug, name)');
    const catalogProducts: any[] = (dbProducts || []).map((p: any) => {
      const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
      return {
        id: p.id,
        databaseId: p.id,
        slug: p.slug || p.id,
        name: p.name,
        price: p.price,
        category: cat?.slug || undefined,
      };
    });

    const pricing = calculatePricing(normalizedItems, matchedPromo, 0, 0, catalogProducts);
    promoDiscount = pricing.discountAmount;
    const finalTotal = pricing.grandTotal;

    // Check minimum order amount if promo was applied
    const promoBasis =
      matchedPromo?.targetType === 'ENTIRE_STORE'
        ? pricing.subtotal
        : pricing.promoSubtotal;

    if (
      matchedPromo &&
      matchedPromo.minimumOrderAmount &&
      promoBasis < matchedPromo.minimumOrderAmount
    ) {
      if (promoToRollback) {
        await client.rpc('decrement_promotion_usage', { p_id: promoToRollback });
        promoToRollback = null;
      }
      return NextResponse.json(
        {
          error: `Minimum order amount of ${matchedPromo.minimumOrderAmount.toLocaleString()} MMK for qualifying promotional items is required to use promo code ${matchedPromo.code}.`,
        },
        { status: 400, headers: corsHeaders() }
      );
    }

    // 5. Generate Order Ref & Persist
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const yearShort = now.getFullYear().toString().slice(-2);
    const initialSeq = Math.floor(10000 + Math.random() * 90000);
    let orderId = customOrderId || `PC-${yearShort}${month}${day}-${initialSeq}`;

    let { data: insertedOrder, error: orderErr } = await client
      .from('orders')
      .insert({
        id: orderId,
        customer_name: customerName.trim(),
        phone: phone.trim(),
        delivery_address: deliveryAddress.trim(),
        landmark_note: landmarkNote?.trim() || null,
        total_amount: finalTotal,
        payment_method: paymentMethod || 'Cash on Delivery',
        payment_status: paymentStatus,
        fulfillment_status: fulfillmentStatus,
        payment_slip_url: null,
        promo_code: matchedPromo?.code || null,
        discount_amount: promoDiscount,
      })
      .select()
      .single();

    // Auto-retry with fresh unique ID if duplicate key collision occurs
    if (
      orderErr &&
      (orderErr.code === '23505' ||
        orderErr.message?.includes('duplicate key') ||
        orderErr.message?.includes('orders_pkey'))
    ) {
      console.warn(`Order primary key collision on ${orderId}. Auto-regenerating unique ID and retrying...`);
      const retrySeq = Math.floor(10000 + Math.random() * 90000);
      orderId = `PC-${yearShort}${month}${day}-${retrySeq}`;

      const retryRes = await client
        .from('orders')
        .insert({
          id: orderId,
          customer_name: customerName.trim(),
          phone: phone.trim(),
          delivery_address: deliveryAddress.trim(),
          landmark_note: landmarkNote?.trim() || null,
          total_amount: finalTotal,
          payment_method: paymentMethod || 'Cash on Delivery',
          payment_status: paymentStatus,
          fulfillment_status: fulfillmentStatus,
          payment_slip_url: null,
          promo_code: matchedPromo?.code || null,
          discount_amount: promoDiscount,
        })
        .select()
        .single();

      insertedOrder = retryRes.data;
      orderErr = retryRes.error;
    }

    if (orderErr) {
      console.error('Order insert error:', orderErr);
      if (promoToRollback) {
        await client.rpc('decrement_promotion_usage', { p_id: promoToRollback });
        promoToRollback = null;
      }
      return NextResponse.json(
        { error: 'Failed to record order: ' + orderErr.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    // 6. Insert Order Items with Line-Item Discount Breakdown
    const itemsToInsert = normalizedItems.map((it) => {
      const linePricing = pricing.lineItems.find(
        (lp) => lp.itemId === it.id || lp.productId === it.productId
      );
      return {
        order_id: orderId,
        product_id: isUuid(it.productId) ? it.productId : null,
        product_name: it.size ? `${it.name} (${it.size})` : it.name,
        unit_price: it.price,
        quantity: it.quantity,
        item_total: it.price * it.quantity,
        discount_amount: linePricing?.discountAmount || 0,
        product_image: it.image || null,
      };
    });

    const { error: itemsErr } = await client.from('order_items').insert(itemsToInsert);
    if (itemsErr) {
      console.warn('Order items insert partial warning:', itemsErr);
    }

    // 7. Deduct Stock in Products & Record Audit in inventory_adjustments
    for (const item of normalizedItems) {
      if (item.productId) {
        let prodQuery = client.from('products').select('id, name, slug, stock_quantity');
        if (isUuid(item.productId)) {
          prodQuery = prodQuery.eq('id', item.productId);
        } else {
          prodQuery = prodQuery.or(`slug.eq.${item.productId},name.eq.${item.name}`);
        }
        const { data: currentProd } = await prodQuery.maybeSingle();

        if (currentProd && typeof currentProd.stock_quantity === 'number') {
          const prevStock = currentProd.stock_quantity;
          const nextStock = Math.max(0, prevStock - item.quantity);

          const { error: stockUpdateErr } = await client
            .from('products')
            .update({
              stock_quantity: nextStock,
              updated_at: new Date().toISOString(),
            })
            .eq('id', currentProd.id);

          if (stockUpdateErr) {
            console.warn('Failed to update product stock:', stockUpdateErr);
          }

          const { error: adjErr } = await client.from('inventory_adjustments').insert({
            product_id: currentProd.id,
            product_name: currentProd.name,
            sku: currentProd.slug?.toUpperCase() || currentProd.id.slice(0, 8).toUpperCase(),
            type: 'decrease',
            quantity: item.quantity,
            previous_stock: prevStock,
            new_stock: nextStock,
            reason: `Customer order ${orderId} placed via ${paymentMethod || 'Cash on Delivery'}`,
            performed_by: customerName.trim(),
          });

          if (adjErr) {
            console.warn('Failed to record inventory adjustment:', adjErr);
          }
        }
      }
    }

    const createdOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      township: township || undefined,
      landmarkNote: landmarkNote?.trim() || undefined,
      items: normalizedItems,
      subtotal: pricing.subtotal,
      discount: promoDiscount,
      deliveryFee: 0,
      total: finalTotal,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus,
      fulfillmentStatus,
      createdAt: insertedOrder?.created_at || new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        order: createdOrder,
        appliedPromo: matchedPromo
          ? {
              code: matchedPromo.code,
              discountPercentage: matchedPromo.discountPercentage,
              discountAmount: promoDiscount,
            }
          : null,
      },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error('POST /api/orders unexpected error:', error);
    if (promoToRollback && client) {
      try {
        await client.rpc('decrement_promotion_usage', { p_id: promoToRollback });
      } catch {}
    }
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing order' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
