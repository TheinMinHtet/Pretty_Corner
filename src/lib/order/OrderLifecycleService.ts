import { Order, CartItem } from '../types';
import { StorefrontRepository, getStorefrontRepository } from '../repository/StorefrontRepository';
import { normalizeMyanmarDigits } from '../validation';

export interface OrderSubmissionDraft {
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
}

export interface OrderSubmissionResult {
  order: Order;
  redirectUrl: string;
  shouldClearCart: boolean;
  activePendingOrderId: string | null;
}

/**
 * Deep Order Intake interface: normalizes digits, computes date & ID, persists via repository,
 * and determines atomic redirection and cart-clearing rules.
 */
export async function processOrderSubmission(
  draft: OrderSubmissionDraft,
  appliedPromo?: { code?: string; id?: string } | null,
  repo: StorefrontRepository = getStorefrontRepository()
): Promise<OrderSubmissionResult> {
  const isCOD = draft.paymentMethod === 'Cash on Delivery';
  const orderId = generateOrderId();
  const createdAt = formatOrderDate();

  const submission: Omit<Order, 'id' | 'createdAt'> & { promoCode?: string; appliedPromotionId?: string } = {
    customerName: draft.customerName.trim(),
    phone: normalizeMyanmarDigits(draft.phone).replace(/[\s-]/g, ''),
    township: draft.township?.trim(),
    deliveryAddress: draft.deliveryAddress.trim(),
    coordinates: draft.coordinates || { lat: 16.8302, lng: 96.1301 },
    landmarkNote: draft.landmarkNote?.trim() || undefined,
    items: draft.items,
    subtotal: draft.subtotal,
    discount: draft.discount || 0,
    deliveryFee: draft.deliveryFee || 0,
    total: draft.total,
    paymentMethod: draft.paymentMethod,
    paymentStatus: 'pending',
    fulfillmentStatus: isCOD ? 'confirmed' : 'pending_review',
    promoCode: appliedPromo?.code,
    appliedPromotionId: appliedPromo?.id,
  };

  const savedOrder = await repo.createOrder(submission, orderId, createdAt);

  return {
    order: savedOrder,
    redirectUrl: isCOD
      ? `/order-confirmation?orderId=${encodeURIComponent(savedOrder.id)}`
      : `/payment-pending?orderId=${encodeURIComponent(savedOrder.id)}`,
    shouldClearCart: isCOD,
    activePendingOrderId: isCOD ? null : savedOrder.id,
  };
}

export function generateOrderId(): string {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const yearShort = date.getFullYear().toString().slice(-2);
  const randomSeq = Math.floor(10000 + Math.random() * 90000);
  return `PC-${yearShort}${month}${day}-${randomSeq}`;
}

export function formatOrderDate(input?: Date | string | null): string {
  if (!input) {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[now.getMonth()];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${day} ${monthName} ${now.getFullYear()} · ${timeStr}`;
  }
  const date = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(date.getTime())) return typeof input === 'string' ? input : '';
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[date.getMonth()];
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} ${monthName} ${date.getFullYear()} · ${timeStr}`;
}

/**
 * Submits an order through the repository and computes the appropriate redirection route.
 */
export async function submitOrder(
  draft: OrderSubmissionDraft,
  repo: StorefrontRepository = getStorefrontRepository()
): Promise<{ order: Order; redirectUrl: string }> {
  const isCOD = draft.paymentMethod === 'Cash on Delivery';
  const orderId = generateOrderId();
  const createdAt = formatOrderDate();

  const submission: Omit<Order, 'id' | 'createdAt'> = {
    customerName: draft.customerName.trim(),
    phone: draft.phone.trim(),
    township: draft.township?.trim(),
    deliveryAddress: draft.deliveryAddress.trim(),
    coordinates: draft.coordinates || { lat: 16.8302, lng: 96.1301 },
    landmarkNote: draft.landmarkNote?.trim() || undefined,
    items: draft.items,
    subtotal: draft.subtotal,
    discount: draft.discount || 0,
    deliveryFee: draft.deliveryFee || 0,
    total: draft.total,
    paymentMethod: draft.paymentMethod,
    paymentStatus: 'pending',
    fulfillmentStatus: isCOD ? 'confirmed' : 'pending_review',
  };

  const createdOrder = await repo.createOrder(submission, orderId, createdAt);
  const redirectUrl = isCOD
    ? `/order-confirmation?orderId=${encodeURIComponent(createdOrder.id)}`
    : `/payment-pending?orderId=${encodeURIComponent(createdOrder.id)}`;

  return {
    order: createdOrder,
    redirectUrl,
  };
}

/**
 * Resiliently resolves an order: checks in-memory cache first, then falls back to repository query.
 * Normalizes Myanmar numerals (၀-၉) and matches on ID or phone suffix.
 */
export async function resolveOrder(
  refOrPhone: string,
  cachedOrders: Order[] = [],
  repo: StorefrontRepository = getStorefrontRepository()
): Promise<Order | null> {
  const raw = refOrPhone.trim().toUpperCase();
  if (!raw) return null;

  const normalized = normalizeMyanmarDigits(raw);
  const digitsOnly = normalized.replace(/[\s-]/g, '');

  // 1. Check in-memory cache
  const memoryMatch = cachedOrders.find((o) => {
    const matchId = o.id.toUpperCase() === raw;
    const orderPhone = normalizeMyanmarDigits(o.phone).replace(/[\s-]/g, '');
    const matchPhone =
      digitsOnly.length >= 6 &&
      (orderPhone.endsWith(digitsOnly) || digitsOnly.endsWith(orderPhone));
    return matchId || matchPhone;
  });

  if (memoryMatch) {
    return memoryMatch;
  }

  // 2. Query repository
  return repo.findOrder(raw);
}

/**
 * Completes payment transition: sets status to 'paid', fulfillment to 'confirmed', and updates storage.
 */
export async function completePayment(
  orderId: string,
  repo: StorefrontRepository = getStorefrontRepository()
): Promise<Order | null> {
  return repo.updatePaymentStatus(orderId, 'paid');
}
