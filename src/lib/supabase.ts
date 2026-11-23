import { createClient } from '@supabase/supabase-js';

const directSupabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vbcdopdttqmplwnknppl.supabase.co'
).replace(/\/+$/, '');

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

/**
 * Returns the effective Supabase URL.
 * In the browser, it routes through window.location.origin + '/supabase'
 * so that traffic travels through Vercel's edge proxy, bypassing Myanmar ISP blocks.
 * On the server, it talks directly to the official Supabase endpoint.
 *
 * @param useDirectConnection If true, bypasses the proxy and connects directly to Supabase cloud.
 */
export function getEffectiveSupabaseUrl(useDirectConnection: boolean = false): string {
  if (typeof window !== 'undefined' && !useDirectConnection) {
    return `${window.location.origin}/supabase`;
  }
  return directSupabaseUrl;
}

/**
 * Creates or retrieves the public Supabase client.
 * In browser runtime, connects through /supabase Vercel edge rewrite.
 */
export function createPublicSupabaseClient(useDirectConnection: boolean = false) {
  const url = getEffectiveSupabaseUrl(useDirectConnection);
  return (url && supabaseAnonKey)
    ? createClient(url, supabaseAnonKey)
    : (null as unknown as ReturnType<typeof createClient>);
}

// Client for public operations (browsing products, looking up receipts, placing orders)
// In the browser, routes through /supabase rewrite on current origin; on server, routes directly.
export const supabase = (directSupabaseUrl && supabaseAnonKey)
  ? (typeof window !== 'undefined'
      ? createClient(`${window.location.origin}/supabase`, supabaseAnonKey)
      : createClient(directSupabaseUrl, supabaseAnonKey))
  : (null as unknown as ReturnType<typeof createClient>);

// Server-only client with admin service role (for admin dashboard, inventory management)
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations.');
  }
  return createClient(directSupabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Database Row Types aligned with Supabase schema
export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ProductRow {
  id: string;
  category_id: string | null;
  slug: string;
  name: string;
  badge: string | null;
  price: number;
  stock_quantity: number;
  description: string | null;
  benefits: string[];
  usage: string | null;
  main_image: string;
  gallery: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  customer_name: string;
  phone: string;
  delivery_address: string;
  landmark_note: string | null;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  fulfillment_status: string;
  payment_slip_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  item_total: number;
  product_image: string | null;
  created_at: string;
}
