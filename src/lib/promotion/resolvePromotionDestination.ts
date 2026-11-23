import { Promotion } from '../types';

export interface ResolveDestinationInput {
  targetType?: 'SINGLE_PRODUCT' | 'CATEGORY' | 'ENTIRE_STORE';
  promotionSlug?: string;
  slug?: string;
  code?: string;
  targetSlug?: string;
  featuredProductIds?: string[];
  ctaLink?: string;
  customDestination?: string;
}

export interface PromotionActionDescriptor {
  isValid: boolean;
  destinationUrl: string;
  badgeLabel: string;
  ctaLabel: string;
  code?: string;
  discountPercentage: number;
  formattedDiscount: string;
  hasCode: boolean;
  isExpired: boolean;
  isExhausted: boolean;
  isOutOfStock: boolean;
}

/**
 * Evaluates a promotion and provides an authoritative action descriptor containing validity,
 * destination routing, formatted discount tags, and copy labels.
 */
export function evaluatePromotionAction(
  promo: Promotion,
  options?: { language?: 'en' | 'my'; defaultCta?: string }
): PromotionActionDescriptor {
  const now = new Date();
  const isExpired = Boolean(promo.endDate && new Date(promo.endDate) < now);
  const isExhausted = Boolean(
    promo.usageLimit !== null &&
    promo.usageLimit !== undefined &&
    (promo.usageCount ?? 0) >= promo.usageLimit
  );
  const isOutOfStock = Boolean(promo.isOutOfStock);
  const isActive = promo.active !== false;

  const isValid = isActive && !isExpired && !isExhausted && !isOutOfStock;

  const destinationUrl = resolvePromotionDestination({
    targetType: promo.targetType,
    promotionSlug: promo.slug,
    targetSlug: promo.targetSlug,
    code: promo.code,
    featuredProductIds: promo.featuredProductIds,
  });

  const discountPercentage = promo.discountPercentage || 0;
  const formattedDiscount = `${discountPercentage}% OFF`;
  const badgeLabel = promo.bannerBadge || (discountPercentage > 0 ? `${discountPercentage}% OFF EXCLUSIVE` : 'SPECIAL OFFER');
  const ctaLabel = promo.ctaText || options?.defaultCta || (options?.language === 'my' ? 'ဝယ်ယူမည်' : 'Shop Now');

  return {
    isValid,
    destinationUrl,
    badgeLabel,
    ctaLabel,
    code: promo.code || undefined,
    discountPercentage,
    formattedDiscount,
    hasCode: Boolean(promo.code),
    isExpired,
    isExhausted,
    isOutOfStock,
  };
}

/**
 * Deterministically derives the storefront destination URL for a promotion
 * based purely on its target tier, campaign slug, promo code, and product filters.
 *
 * - SINGLE_PRODUCT: Routes to /shop?product=:targetSlug&promo=CODE
 * - CATEGORY: Routes to /shop?category=:targetSlug&promo=CODE
 * - ENTIRE_STORE: Routes to /shop?promo=CODE
 */
export function resolvePromotionDestination(input: ResolveDestinationInput): string {
  const codeParam = input.code ? `promo=${encodeURIComponent(input.code)}` : '';
  const querySuffix = codeParam ? `?${codeParam}` : '';

  switch (input.targetType) {
    case 'SINGLE_PRODUCT':
      if (input.targetSlug) {
        const prodParam = `product=${encodeURIComponent(input.targetSlug)}`;
        return `/shop?${prodParam}${codeParam ? '&' + codeParam : ''}`;
      }
      return `/shop${querySuffix}`;

    case 'CATEGORY':
      if (input.targetSlug) {
        const catParam = `category=${encodeURIComponent(input.targetSlug)}`;
        return `/shop?${catParam}${codeParam ? '&' + codeParam : ''}`;
      }
      return `/shop${querySuffix}`;

    case 'ENTIRE_STORE':
    default:
      return `/shop${querySuffix}`;
  }
}

