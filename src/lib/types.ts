export interface ProductSize {
  name: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: 'electrical' | 'skincare' | 'makeup' | 'lifestyle' | 'lenses' | 'more' | string;
  subcategory?: string;
  badge?: 'BESTSELLER' | 'NEW' | 'DAILY ESSENTIAL' | 'TRAVEL SIZE' | 'TOP TECH' | 'POPULAR';
  tagline: string;
  subtitle: string;
  price: number;
  sizes: ProductSize[];
  image: string;
  gallery: string[];
  description: string;
  benefits: string[];
  usage: string;
  ingredients: string;
  specs?: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string; // unique item id (productId + size)
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
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
  township: string;
  deliveryAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  landmarkNote?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'Mobile Banking' | 'Cash on Delivery' | 'MyanMyanPay' | 'KBZPay' | 'WavePay' | string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'expired';
  fulfillmentStatus: 'pending_review' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}
