import { z } from 'zod';
import { Order, Product } from './types';
import { supabase } from './supabase';

export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:3001';
  return raw.replace(/\/+$/, '');
}

const ProductSizeSchema = z.object({
  name: z.string(),
  price: z.number(),
  inStock: z.boolean(),
});

const StorefrontProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  badge: z.string().optional(),
  tagline: z.string().optional(),
  subtitle: z.string().optional(),
  price: z.number(),
  stockQuantity: z.number().optional(),
  sizes: z.array(ProductSizeSchema).optional(),
  image: z.string(),
  gallery: z.array(z.string()),
  description: z.string(),
  benefits: z.array(z.string()),
  usage: z.string(),
  ingredients: z.string().optional(),
  specs: z.string().optional(),
  inStock: z.boolean(),
  rating: z.number().optional(),
  reviewsCount: z.number().optional(),
});

const ProductsResponseSchema = z.object({
  products: z.array(StorefrontProductSchema),
});

const SingleProductResponseSchema = z.object({
  product: StorefrontProductSchema,
});

export async function fetchStorefrontProducts(): Promise<Product[] | null> {
  // 1. Try external API if configured and reachable
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/products?audience=storefront`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      const parsed = ProductsResponseSchema.safeParse(json);
      if (parsed.success && parsed.data.products.length > 0) {
        return parsed.data.products;
      }
    }
  } catch {}

  // 2. Query Supabase catalog
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          slug,
          name,
          badge,
          price,
          stock_quantity,
          description,
          benefits,
          usage,
          main_image,
          gallery,
          is_active,
          categories (
            slug,
            name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.slug || row.id,
          slug: row.slug,
          name: row.name,
          category: row.categories?.slug || 'skincare',
          subcategory: row.categories?.name || 'Skincare',
          badge: row.badge || undefined,
          price: row.price,
          stockQuantity: row.stock_quantity,
          image: row.main_image,
          gallery: Array.isArray(row.gallery) && row.gallery.length > 0 ? row.gallery : [row.main_image],
          description: row.description || '',
          benefits: Array.isArray(row.benefits) ? row.benefits : [],
          usage: row.usage || '',
          inStock: (row.stock_quantity ?? 0) > 0,
        }));
      }
    }
  } catch (err) {
    console.warn('Failed to query products from Supabase:', err);
  }

  return null;
}

export async function fetchStorefrontProduct(id: string): Promise<Product | null> {
  // 1. Try external API if reachable
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(
      `${baseUrl}/api/products/${encodeURIComponent(id)}?audience=storefront`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      const json = await res.json();
      const parsed = SingleProductResponseSchema.safeParse(json);
      if (parsed.success) {
        return parsed.data.product;
      }
    }
  } catch {}

  // 2. Query Supabase directly by slug or id!
  try {
    if (supabase) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let query = supabase
        .from('products')
        .select(`
          id,
          slug,
          name,
          badge,
          price,
          stock_quantity,
          description,
          benefits,
          usage,
          main_image,
          gallery,
          is_active,
          categories (
            slug,
            name
          )
        `);

      if (isUuid) {
        query = query.or(`id.eq.${id},slug.eq.${id}`);
      } else {
        query = query.eq('slug', id);
      }

      const { data, error } = await query.single();
      if (!error && data) {
        const row: any = data;
        const categorySlug = row.categories?.slug || 'skincare';
        const categoryName = row.categories?.name || 'Skincare';
        const galleryList = Array.isArray(row.gallery) && row.gallery.length > 0
          ? row.gallery
          : [row.main_image];

        return {
          id: row.slug || row.id,
          slug: row.slug,
          name: row.name,
          category: categorySlug,
          subcategory: categoryName,
          badge: row.badge || undefined,
          price: row.price,
          stockQuantity: row.stock_quantity,
          image: row.main_image,
          gallery: galleryList,
          description: row.description || '',
          benefits: Array.isArray(row.benefits) ? row.benefits : [],
          usage: row.usage || '',
          inStock: (row.stock_quantity ?? 0) > 0,
        };
      }
    }
  } catch (err) {
    console.warn('Failed to fetch product from Supabase:', err);
  }

  return null;
}

export async function fetchStorefrontOrders(): Promise<Order[] | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/orders?audience=storefront`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return null;
    }
    const json = (await res.json()) as { orders?: Order[] };
    return Array.isArray(json.orders) ? json.orders : [];
  } catch {
    return null;
  }
}

export async function createStorefrontOrderApi(
  orderData: Omit<Order, 'id' | 'createdAt'>
): Promise<Order | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      return null;
    }
    const json = (await res.json()) as { order?: Order };
    return json.order ?? null;
  } catch {
    return null;
  }
}

export async function updateStorefrontOrderPaymentApi(
  orderId: string,
  status: Order['paymentStatus']
): Promise<Order | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const statusMap: Record<Order['paymentStatus'], string> = {
      paid: 'Paid',
      pending: 'Pending',
      failed: 'Failed',
      expired: 'Expired',
    };
    const res = await fetch(
      `${baseUrl}/api/orders/${encodeURIComponent(orderId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: statusMap[status] }),
      }
    );
    if (!res.ok) {
      return null;
    }
    const json = (await res.json()) as { storefrontOrder?: Order };
    return json.storefrontOrder ?? null;
  } catch {
    return null;
  }
}
