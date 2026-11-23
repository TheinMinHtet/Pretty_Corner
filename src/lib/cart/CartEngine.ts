import { CartItem, Product, Promotion } from '../types';

export interface LineItemPricing {
  itemId: string;
  productId: string;
  name: string;
  size?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  isEligible: boolean;
  discountAmount: number;
  finalTotal: number;
  promoCode?: string;
}

export interface CartPricingSummary {
  itemCount: number;
  subtotal: number;
  promoSubtotal: number;
  nonPromoSubtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  appliedPromo: Promotion | null;
  lineItems: LineItemPricing[];
}

/**
 * Builds a deterministic composite cart item ID based on product ID and optional variant size.
 */
export function buildCartItemId(productId: string, sizeName?: string): string {
  const cleanSize = sizeName?.trim();
  return cleanSize ? `${productId}-${cleanSize}` : productId;
}

/**
 * Pure calculation of cart pricing including item count, subtotal, tier-aware promo/manual discount, and grand total.
 */
export function calculatePricing(
  items: CartItem[],
  promo: Promotion | null = null,
  shippingFee: number = 0,
  manualDiscount: number = 0,
  catalogProducts?: Product[]
): CartPricingSummary {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  let promoSubtotal = 0;
  let nonPromoSubtotal = 0;

  const percentage =
    promo && promo.discountPercentage > 0
      ? Math.min(100, Math.max(0, promo.discountPercentage))
      : 0;

  // First pass: evaluate eligibility per item and calculate promoSubtotal vs nonPromoSubtotal
  const evaluatedItems = items.map((item) => {
    let isEligible = false;

    if (promo && percentage > 0) {
      switch (promo.targetType) {
        case 'SINGLE_PRODUCT': {
          const target = promo.targetSlug || promo.featuredProductIds?.[0];
          const matched = catalogProducts?.find(
            (p) =>
              p.id === item.productId ||
              p.slug === item.productId ||
              (p.databaseId && p.databaseId === item.productId)
          );
          isEligible = Boolean(
            (target &&
              (item.productId === target ||
                matched?.slug === target ||
                matched?.id === target ||
                (matched?.databaseId && matched.databaseId === target))) ||
              (promo.featuredProductIds &&
                promo.featuredProductIds.includes(item.productId))
          );
          break;
        }
        case 'CATEGORY': {
          const targetCat = promo.targetSlug?.toLowerCase();
          const matched = catalogProducts?.find(
            (p) => p.id === item.productId || p.slug === item.productId
          );
          const itemCat = (item.category || matched?.category || '').toLowerCase();
          isEligible = Boolean(targetCat && itemCat === targetCat);
          break;
        }
        case 'ENTIRE_STORE':
          isEligible = true;
          break;
        default:
          isEligible = false;
          break;
      }
    }

    const itemSubtotal = item.price * item.quantity;
    if (isEligible) {
      promoSubtotal += itemSubtotal;
    } else {
      nonPromoSubtotal += itemSubtotal;
    }

    return {
      item,
      itemSubtotal,
      isEligible,
    };
  });

  // Threshold validation:
  // For targeted promotions (SINGLE_PRODUCT, CATEGORY), minimumOrderAmount is evaluated
  // strictly against promoSubtotal.
  // For ENTIRE_STORE, evaluated against total subtotal.
  const minOrder = promo?.minimumOrderAmount || 0;
  const thresholdBasis =
    promo?.targetType === 'ENTIRE_STORE' ? subtotal : promoSubtotal;
  const satisfiesMinOrder = thresholdBasis >= minOrder;

  // Second pass: compute per-line discountAmount
  const lineItems: LineItemPricing[] = evaluatedItems.map(
    ({ item, itemSubtotal, isEligible }) => {
      let itemDiscount = 0;
      if (isEligible && satisfiesMinOrder && percentage > 0) {
        // Apply 60% maximum safety margin ceiling per item
        const maxAllowedDiscount = Math.round(itemSubtotal * 0.6);
        const rawDiscount = Math.round((itemSubtotal * percentage) / 100);
        itemDiscount = Math.min(rawDiscount, maxAllowedDiscount);
      }

      return {
        itemId: item.id,
        productId: item.productId,
        name: item.name,
        size: item.size,
        unitPrice: item.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        isEligible: Boolean(isEligible && satisfiesMinOrder),
        discountAmount: itemDiscount,
        finalTotal: itemSubtotal - itemDiscount,
        promoCode: isEligible && satisfiesMinOrder ? promo?.code : undefined,
      };
    }
  );

  if (promo && satisfiesMinOrder && percentage > 0) {
    discountAmount = lineItems.reduce((sum, it) => sum + it.discountAmount, 0);
  } else if (!promo && manualDiscount > 0) {
    discountAmount = manualDiscount;
  }

  // Ensure non-negative integers
  discountAmount = Math.max(0, Math.round(discountAmount));
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const grandTotal = totalAfterDiscount + (shippingFee > 0 ? shippingFee : 0);

  return {
    itemCount,
    subtotal,
    promoSubtotal,
    nonPromoSubtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    appliedPromo: promo,
    lineItems,
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
      category: product.category,
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
  language: 'en' | 'my' = 'en',
  cart?: CartItem[],
  catalogProducts?: Product[]
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

  if (!matched || matched.isOutOfStock) {
    return {
      success: false,
      message:
        language === 'my'
          ? 'ပရိုမိုးရှင်းကုဒ် မမှန်ကန်ပါ သို့မဟုတ် သက်တမ်းကုန်သွားပါပြီ'
          : 'Invalid or expired promo code',
    };
  }

  const now = new Date();
  if (matched.endDate && new Date(matched.endDate) < now) {
    return {
      success: false,
      message:
        language === 'my'
          ? 'ဤပရိုမိုးရှင်း သက်တမ်းကုန်သွားပါပြီ'
          : 'This promotion has expired',
    };
  }

  if (
    matched.usageLimit !== null &&
    matched.usageLimit !== undefined &&
    (matched.usageCount ?? 0) >= matched.usageLimit
  ) {
    return {
      success: false,
      message:
        language === 'my'
          ? 'ဤပရိုမိုးရှင်း အသုံးပြုနိုင်သည့် အရေအတွက် ပြည့်သွားပါပြီ'
          : 'Promotion usage limit has been fully exhausted',
    };
  }

  // Check if cart has qualifying items for targeted promotions
  if (cart && cart.length > 0 && matched.targetType && matched.targetType !== 'ENTIRE_STORE') {
    const pricingTest = calculatePricing(cart, matched, 0, 0, catalogProducts);
    if (pricingTest.promoSubtotal === 0) {
      return {
        success: false,
        message:
          language === 'my'
            ? `ဤပရိုမိုးရှင်းကုဒ် (${matched.code}) အတွက် သတ်မှတ်ထားသော ပစ္စည်းများ သင့်အိတ်ထဲတွင် မရှိသေးပါ`
            : `No items in your bag qualify for promo code ${matched.code}. Please add qualifying promotional items to redeem this discount.`,
      };
    }
    if (matched.minimumOrderAmount && pricingTest.promoSubtotal < matched.minimumOrderAmount) {
      return {
        success: false,
        message:
          language === 'my'
            ? `ဤပရိုမိုးရှင်းအတွက် သတ်မှတ်ပစ္စည်း အနည်းဆုံး ${matched.minimumOrderAmount.toLocaleString()} MMK ဖိုး ဝယ်ယူရပါမည်`
            : `Minimum order amount of ${matched.minimumOrderAmount.toLocaleString()} MMK for qualifying promotional items is required to use code ${matched.code}.`,
      };
    }
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
