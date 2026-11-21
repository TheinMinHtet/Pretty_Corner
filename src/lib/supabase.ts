import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Client for public operations (browsing products, looking up receipts, placing orders)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only client with admin service role (for admin dashboard, inventory management)
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations.');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
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
