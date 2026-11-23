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

