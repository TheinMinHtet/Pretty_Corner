import { Product, Order, Promotion, CartItem } from '../types';
import { supabase } from '../supabase';
import { DEFAULT_PROMOTIONS } from '../mockData';
import { normalizeMyanmarDigits } from '../validation';

export interface StorefrontRepository {
  getProducts(): Promise<Product[]>;
  getProduct(slugOrId: string): Promise<Product | null>;
  getPromotions(): Promise<Promotion[]>;
  findOrder(refOrPhone: string): Promise<Order | null>;
  createOrder(
    submission: Omit<Order, 'id' | 'createdAt'> & { promoCode?: string; appliedPromotionId?: string },
    customOrderId?: string,
    formattedDate?: string
  ): Promise<Order>;
  updatePaymentStatus(orderId: string, status: Order['paymentStatus']): Promise<Order | null>;
}

export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:3001';
  return raw.replace(/\/+$/, '');
}

interface SupabaseCategoryJoin {
  slug?: string;
  name?: string;
}

interface SupabaseProductRow {
  id: string;
  slug: string;
  name: string;
  badge: string | null;
  price: number;
  stock_quantity: number;
  description: string | null;
  benefits: string[] | null;
  usage: string | null;
  main_image: string;
  gallery: string[] | null;
  is_active: boolean;
  categories: SupabaseCategoryJoin | SupabaseCategoryJoin[] | null;
}

interface SupabaseOrderItemRow {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  product_image: string | null;
}

interface SupabaseOrderRow {
  id: string;
  customer_name: string;
  phone: string;
  delivery_address: string;
  landmark_note: string | null;
  total_amount: number;
  payment_method: string;
  payment_status: Order['paymentStatus'];
  fulfillment_status: Order['fulfillmentStatus'];
  created_at: string;
  order_items?: SupabaseOrderItemRow[];
}

interface SupabasePromotionRow {
  id: string;
  slug: string | null;
  code: string;
  title: string;
  subtitle: string | null;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  target_type: Promotion['targetType'] | null;
  target_slug: string | null;
  redemption_method: Promotion['redemptionMethod'] | null;
  usage_limit: number | null;
  usage_count: number;
  minimum_order_amount: number | null;
  featured_product_ids: string[] | null;
  image_url: string | null;
  banner_badge: string | null;
  cta_text: string | null;
  cta_link: string | null;
  is_out_of_stock: boolean | null;
}

function mapProductRow(row: SupabaseProductRow): Product {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  const categorySlug = cat?.slug || 'skincare';
  const categoryName = cat?.name || 'Skincare';
  const galleryList = Array.isArray(row.gallery) && row.gallery.length > 0
    ? row.gallery
    : [row.main_image];

  return {
    id: row.id,
    databaseId: row.id,
    slug: row.slug || row.id,
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

function mapOrderRow(data: SupabaseOrderRow): Order {
  const dateObj = new Date(data.created_at);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const formattedDate = `${day} Nov ${dateObj.getFullYear()} · ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const items: CartItem[] = (data.order_items || []).map((it) => ({
    id: it.id,
    productId: it.product_id || it.product_name,
    name: it.product_name,
    size: '',
    price: it.unit_price,
    quantity: it.quantity,
    image: it.product_image || '/assets/dew-drop-serum.png',
  }));

  return {
    id: data.id,
    customerName: data.customer_name,
    phone: data.phone,
    deliveryAddress: data.delivery_address,
    landmarkNote: data.landmark_note || undefined,
    total: data.total_amount,
    subtotal: data.total_amount,
    paymentMethod: data.payment_method,
    paymentStatus: data.payment_status,
    fulfillmentStatus: data.fulfillment_status,
    createdAt: formattedDate,
    items,
  };
}

/**
 * Production implementation combining REST API, Supabase DB queries, and fallback fixtures.
 */
export class HttpAndSupabaseRepositoryAdapter implements StorefrontRepository {
  async getProducts(): Promise<Product[]> {
    // 1. Try external API
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/products?audience=storefront`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.products) && json.products.length > 0) {
          return json.products;
        }
      }
    } catch {}

    // 2. Query Supabase
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
          return (data as unknown as SupabaseProductRow[]).map(mapProductRow);
        }
      }
    } catch (err) {
      console.warn('Failed to query products from Supabase:', err);
    }

    return [];
  }

  async getProduct(slugOrId: string): Promise<Product | null> {
    const cleanId = slugOrId.trim();
    if (!cleanId) return null;

    // 1. Try external API
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(
        `${baseUrl}/api/products/${encodeURIComponent(cleanId)}?audience=storefront`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.product) return json.product;
      }
    } catch {}

    // 2. Query Supabase
    try {
      if (supabase) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
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
          query = query.or(`id.eq.${cleanId},slug.eq.${cleanId}`);
        } else {
          query = query.eq('slug', cleanId);
        }

        const { data, error } = await query.maybeSingle();
        if (!error && data) {
          return mapProductRow(data as unknown as SupabaseProductRow);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch product from Supabase:', err);
    }

    return null;
  }

  async getPromotions(): Promise<Promotion[]> {
    // 1. Fetch from Supabase
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const rows = data as unknown as SupabasePromotionRow[];
          return rows.map((row) => ({
            id: row.id,
            slug: row.slug || undefined,
            code: row.code,
            title: row.title,
            subtitle: row.subtitle || undefined,
            discountPercentage: Number(row.discount_percentage) || 0,
            startDate: row.start_date,
            endDate: row.end_date,
            active: Boolean(row.is_active),
            targetType: row.target_type || 'ENTIRE_STORE',
            targetSlug: row.target_slug || undefined,
            redemptionMethod: row.redemption_method || 'CODE',
            usageLimit: row.usage_limit ? Number(row.usage_limit) : undefined,
            usageCount: Number(row.usage_count) || 0,
            minimumOrderAmount: row.minimum_order_amount ? Number(row.minimum_order_amount) : undefined,
            isOutOfStock: Boolean(row.is_out_of_stock),
            bannerColor: '#FCEEF2',
            featuredProductIds: Array.isArray(row.featured_product_ids)
              ? row.featured_product_ids
              : [],
            imageUrl: row.image_url || undefined,
            bannerBadge: row.banner_badge || undefined,
            ctaText: row.cta_text || undefined,
            ctaLink: row.cta_link || undefined,
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to query promotions from Supabase:', err);
    }

    // 2. Fallback to API if available
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/promotions`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.promotions) && json.promotions.length > 0) {
          return json.promotions.filter((p: Promotion) => p.active !== false);
        }
      }
    } catch {}

    return DEFAULT_PROMOTIONS;
  }

  async findOrder(refOrPhone: string): Promise<Order | null> {
    const raw = refOrPhone.trim().toUpperCase();
    if (!raw) return null;

    const normalized = normalizeMyanmarDigits(raw);
    const digitsOnly = normalized.replace(/[\s-]/g, '');

    try {
      if (supabase) {
        let query = supabase.from('orders').select('*, order_items(*)');
        if (raw.startsWith('PC-')) {
          query = query.ilike('id', raw);
        } else if (digitsOnly.length >= 6) {
          query = query.or(`id.ilike.%${raw}%,phone.ilike.%${digitsOnly}%`);
        } else {
          query = query.ilike('id', raw);
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return mapOrderRow(data as unknown as SupabaseOrderRow);
        }
      }
    } catch (err) {
      console.warn('Failed to find order from Supabase:', err);
    }

    return null;
  }

  async createOrder(
    submission: Omit<Order, 'id' | 'createdAt'> & { promoCode?: string; appliedPromotionId?: string },
    customOrderId?: string,
    formattedDate?: string
  ): Promise<Order> {
    const orderId = customOrderId || `PC-${Date.now().toString().slice(-8)}`;
    const createdAt = formattedDate || new Date().toLocaleString();

    const createdOrder: Order = {
      ...submission,
      id: orderId,
      createdAt,
    };

    // Authoritative Ingress: Post to /api/orders (ADR 0001)
    const baseUrl = typeof window !== 'undefined' ? '' : getApiBaseUrl();
    const endpoint = `${baseUrl}/api/orders`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...createdOrder,
        promoCode: submission.promoCode,
        appliedPromotionId: submission.appliedPromotionId,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || `Order placement failed (HTTP ${res.status})`);
    }

    const json = (await res.json()) as { order?: Order };
    return json.order || createdOrder;
  }

  async updatePaymentStatus(
    orderId: string,
    status: Order['paymentStatus']
  ): Promise<Order | null> {
    const cleanId = orderId.trim().toUpperCase();

    // 1. Update Supabase
    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            payment_status: status,
            fulfillment_status: status === 'paid' ? 'confirmed' : status === 'cancelled' ? 'cancelled' : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', cleanId);
      } catch (err) {
        console.warn('Failed to update order payment in Supabase:', err);
      }
    }

    // 2. Update external API if configured
    try {
      const baseUrl = getApiBaseUrl();
      const statusMap: Record<Order['paymentStatus'], string> = {
        paid: 'Paid',
        pending: 'Pending',
        failed: 'Failed',
        expired: 'Expired',
        cancelled: 'Cancelled',
      };
      await fetch(`${baseUrl}/api/orders/${encodeURIComponent(cleanId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: statusMap[status] }),
      });
    } catch {}

    return this.findOrder(cleanId);
  }
}

/**
 * In-memory repository adapter for lightning-fast, deterministic testing without network I/O.
 */
export class InMemoryStorefrontRepository implements StorefrontRepository {
  private products: Product[] = [];
  private promotions: Promotion[] = [...DEFAULT_PROMOTIONS];
  private orders: Order[] = [];

  constructor(seed?: { products?: Product[]; promotions?: Promotion[]; orders?: Order[] }) {
    if (seed?.products) this.products = [...seed.products];
    if (seed?.promotions) this.promotions = [...seed.promotions];
    if (seed?.orders) this.orders = [...seed.orders];
  }

  async getProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async getProduct(slugOrId: string): Promise<Product | null> {
    const clean = slugOrId.toLowerCase();
    const found = this.products.find(
      (p) => p.id.toLowerCase() === clean || p.slug.toLowerCase() === clean
    );
    return found ? { ...found } : null;
  }

  async getPromotions(): Promise<Promotion[]> {
    return [...this.promotions];
  }

  async findOrder(refOrPhone: string): Promise<Order | null> {
    const cleanRef = refOrPhone.trim().toUpperCase();
    const digitsOnly = normalizeMyanmarDigits(cleanRef).replace(/[\s-]/g, '');

    const found = this.orders.find((o) => {
      const matchId = o.id.toUpperCase() === cleanRef;
      const orderPhone = normalizeMyanmarDigits(o.phone).replace(/[\s-]/g, '');
      const matchPhone =
        digitsOnly.length >= 6 &&
        (orderPhone.endsWith(digitsOnly) || digitsOnly.endsWith(orderPhone));
      return matchId || matchPhone;
    });

    return found ? { ...found } : null;
  }

  async createOrder(
    submission: Omit<Order, 'id' | 'createdAt'>,
    customOrderId?: string,
    formattedDate?: string
  ): Promise<Order> {
    const order: Order = {
      ...submission,
      id: customOrderId || `PC-${Date.now().toString().slice(-8)}`,
      createdAt: formattedDate || new Date().toLocaleString(),
    };
    this.orders.unshift(order);
    return { ...order };
  }

  async updatePaymentStatus(
    orderId: string,
    status: Order['paymentStatus']
  ): Promise<Order | null> {
    const cleanId = orderId.toUpperCase();
    const order = this.orders.find((o) => o.id.toUpperCase() === cleanId);
    if (!order) return null;

    order.paymentStatus = status;
    if (status === 'paid') {
      order.fulfillmentStatus = 'confirmed';
    } else if (status === 'cancelled') {
      order.fulfillmentStatus = 'cancelled';
    }
    return { ...order };
  }
}

// Default singleton repository
let repositoryInstance: StorefrontRepository | null = null;

export function getStorefrontRepository(): StorefrontRepository {
  if (!repositoryInstance) {
    repositoryInstance = new HttpAndSupabaseRepositoryAdapter();
  }
  return repositoryInstance;
}

export function setStorefrontRepository(repo: StorefrontRepository): void {
  repositoryInstance = repo;
}
