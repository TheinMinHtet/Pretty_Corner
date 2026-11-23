export interface ProductSize {
  name: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  databaseId?: string;
  name: string;
  brand?: string;
  category: 'electrical' | 'skincare' | 'makeup' | 'lifestyle' | 'lenses' | 'more' | string;
  subcategory?: string;
  badge?: 'BESTSELLER' | 'NEW' | 'DAILY ESSENTIAL' | 'TRAVEL SIZE' | 'TOP TECH' | 'POPULAR' | string;
  tagline?: string;
  subtitle?: string;
  price: number;
  stockQuantity?: number;
  sizes?: ProductSize[];
  image: string;
  gallery: string[];
  description: string;
  benefits: string[];
  usage: string;
  ingredients?: string;
  specs?: string;
  inStock: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  id: string; // unique item id (productId + size)
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface TownshipOption {
  name: string;
  fee: number;
  zone: string;
}

export interface Order {
  id: string; // e.g. PC-261117-024
  customerName: string;
  phone: string;
  township?: string;
  deliveryAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  landmarkNote?: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  total: number;
  paymentMethod: 'Mobile Banking' | 'Cash on Delivery' | 'MyanMyanPay' | 'KBZPay' | 'WavePay' | string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'expired' | 'cancelled';
  fulfillmentStatus: 'pending_review' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export type PromotionTargetType =
  | 'SINGLE_PRODUCT'
  | 'CATEGORY'
  | 'ENTIRE_STORE';

export type RedemptionMethod = 'CODE' | 'AUTOMATIC';

export interface Promotion {
  id: string;
  slug?: string;
  code: string;
  title: string;
  subtitle?: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
  targetType?: PromotionTargetType;
  targetSlug?: string;
  redemptionMethod?: RedemptionMethod;
  usageLimit?: number | null;
  usageCount?: number;
  minimumOrderAmount?: number | null;
  bannerColor?: string;
  imageUrl?: string;
  bannerBadge?: string;
  ctaText?: string;
  ctaLink?: string;
  featuredProductIds?: string[];
  isOutOfStock?: boolean;
}
