import { Order, Product, Promotion } from './types';
import { getStorefrontRepository, getApiBaseUrl } from './repository/StorefrontRepository';

export { getApiBaseUrl };

export async function fetchStorefrontProducts(): Promise<Product[] | null> {
  const repo = getStorefrontRepository();
  const products = await repo.getProducts();
  return products.length > 0 ? products : null;
}

export async function fetchStorefrontProduct(id: string): Promise<Product | null> {
  const repo = getStorefrontRepository();
  return repo.getProduct(id);
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
    const repo = getStorefrontRepository();
    return await repo.createOrder(orderData);
  } catch {
    return null;
  }
}

export async function updateStorefrontOrderPaymentApi(
  orderId: string,
  status: Order['paymentStatus']
): Promise<Order | null> {
  try {
    const repo = getStorefrontRepository();
    return await repo.updatePaymentStatus(orderId, status);
  } catch {
    return null;
  }
}

export async function fetchStorefrontPromotions(): Promise<Promotion[]> {
  const repo = getStorefrontRepository();
  return repo.getPromotions();
}
