import { z } from 'zod';
import { Order, Product } from './types';

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

export async function fetchStorefrontProducts(): Promise<Product[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/products?audience=storefront`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }
  const json = await res.json();
  const parsed = ProductsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error('Invalid products response from shared API');
  }
  return parsed.data.products;
}

export async function fetchStorefrontProduct(id: string): Promise<Product | null> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(
    `${baseUrl}/api/products/${encodeURIComponent(id)}?audience=storefront`,
    { cache: 'no-store' }
  );
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch product (${res.status})`);
  }
  const json = await res.json();
  const parsed = SingleProductResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error('Invalid product response from shared API');
  }
  return parsed.data.product;
}

export async function fetchStorefrontOrders(): Promise<Order[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/orders?audience=storefront`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch orders (${res.status})`);
  }
  const json = (await res.json()) as { orders?: Order[] };
  return Array.isArray(json.orders) ? json.orders : [];
}

export async function createStorefrontOrderApi(
  orderData: Omit<Order, 'id' | 'createdAt'>
): Promise<Order | null> {
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
}

export async function updateStorefrontOrderPaymentApi(
  orderId: string,
  status: Order['paymentStatus']
): Promise<Order | null> {
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
}
