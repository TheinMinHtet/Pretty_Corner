import { CartItem, Product, Promotion } from '../types';

export interface CartPricingSummary {
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  appliedPromo: Promotion | null;
}

/**
 * Builds a deterministic composite cart item ID based on product ID and optional variant size.
 */
export function buildCartItemId(productId: string, sizeName?: string): string {
  const cleanSize = sizeName?.trim();
  return cleanSize ? `${productId}-${cleanSize}` : productId;
}

/**
 * Pure calculation of cart pricing including item count, subtotal, promo/manual discount, and grand total.
 */
export function calculatePricing(
  items: CartItem[],
  promo: Promotion | null = null,
  shippingFee: number = 0,
  manualDiscount: number = 0
): CartPricingSummary {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = promo
    ? Math.round((subtotal * promo.discountPercentage) / 100)
    : manualDiscount;

  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const grandTotal = totalAfterDiscount + (shippingFee > 0 ? shippingFee : 0);

  return {
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    appliedPromo: promo,
  };
}

/**
 * Adds a product to the cart with variant selection, returning an immutable new cart array.
 */
export function addCartItem(
  cart: CartItem[],
  product: Product,
  sizeName?: string,
  quantity: number = 1
): CartItem[] {
  const chosenSize = sizeName
    ? product.sizes?.find((s) => s.name === sizeName) || product.sizes?.[0]
    : product.sizes?.[0];

  const sizeLabel = chosenSize?.name || '';
  const itemPrice = chosenSize?.price ?? product.price;
  const itemId = buildCartItemId(product.id, sizeLabel);
  const existingIndex = cart.findIndex((item) => item.id === itemId);

  if (existingIndex > -1) {
    const updated = [...cart];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity,
    };
    return updated;
  }

  return [
    ...cart,
    {
      id: itemId,
      productId: product.id,
      name: product.name,
      size: sizeLabel,
      price: itemPrice,
      quantity,
      image: product.image,
    },
  ];
}

/**
 * Updates quantity of a cart item. If resulting quantity is 0 or less, the item is removed.
 */
export function updateCartItemQuantity(
  cart: CartItem[],
  itemId: string,
  delta: number
): CartItem[] {
  return cart
    .map((item) => {
      if (item.id === itemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
}

/**
 * Removes an item from the cart by its composite itemId.
 */
export function removeCartItem(cart: CartItem[], itemId: string): CartItem[] {
  return cart.filter((item) => item.id !== itemId);
}

/**
 * Gets the total quantity of a product in the cart (optionally filtered by variant size).
 */
export function getItemQuantity(
  cart: CartItem[],
  productId: string,
  sizeName?: string
): number {
  const normalizedId = productId.toLowerCase();
  if (sizeName) {
    const match = cart.find(
      (i) =>
        (i.productId.toLowerCase() === normalizedId) &&
        i.size === sizeName
    );
    return match ? match.quantity : 0;
  }

  return cart
    .filter((i) => i.productId.toLowerCase() === normalizedId)
    .reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * Validates a promo coupon code against active promotions.
 */
export function validatePromoCode(
  code: string,
  promos: Promotion[],
  language: 'en' | 'my'
): { success: boolean; message: string; promo?: Promotion } {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return {
      success: false,
      message: language === 'my' ? 'ပရိုမိုးရှင်းကုဒ် ရိုက်ထည့်ပေးပါ' : 'Please enter a promo code',
    };
  }

  const matched = promos.find(
    (p) => p.active !== false && p.code.trim().toUpperCase() === cleanCode
  );

  if (!matched) {
    return {
      success: false,
      message:
        language === 'my'
          ? 'ပရိုမိုးရှင်းကုဒ် မမှန်ကန်ပါ သို့မဟုတ် သက်တမ်းကုန်သွားပါပြီ'
          : 'Invalid or expired promo code',
    };
  }

  return {
    success: true,
    message:
      language === 'my'
        ? `${matched.discountPercentage}% လျှော့စျေး အောင်မြင်စွာ ရရှိပါသည်!`
        : `${matched.discountPercentage}% discount applied successfully!`,
    promo: matched,
  };
}
