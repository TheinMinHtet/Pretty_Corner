import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePromotionDestination } from '../resolvePromotionDestination';

describe('resolvePromotionDestination', () => {
  describe('SINGLE_PRODUCT target tier', () => {
    test('routes to /shop?product=:targetSlug with promo query param', () => {
      const dest = resolvePromotionDestination({
        targetType: 'SINGLE_PRODUCT',
        targetSlug: 'ceramide-cream',
        code: 'SAVE10',
      });
      assert.equal(dest, '/shop?product=ceramide-cream&promo=SAVE10');
    });

    test('routes to /shop?product=:targetSlug without promo param when code is absent', () => {
      const dest = resolvePromotionDestination({
        targetType: 'SINGLE_PRODUCT',
        targetSlug: 'ceramide-cream',
      });
      assert.equal(dest, '/shop?product=ceramide-cream');
    });

    test('falls back to /shop when targetSlug is missing', () => {
      const dest = resolvePromotionDestination({
        targetType: 'SINGLE_PRODUCT',
        code: 'SAVE10',
      });
      assert.equal(dest, '/shop?promo=SAVE10');
    });
  });

  describe('CATEGORY target tier', () => {
    test('routes to /shop?category=:targetSlug with promo query param', () => {
      const dest = resolvePromotionDestination({
        targetType: 'CATEGORY',
        targetSlug: 'skincare',
        code: 'GLOW20',
      });
      assert.equal(dest, '/shop?category=skincare&promo=GLOW20');
    });

    test('routes to /shop?category=:targetSlug without promo param when code is absent', () => {
      const dest = resolvePromotionDestination({
        targetType: 'CATEGORY',
        targetSlug: 'skincare',
      });
      assert.equal(dest, '/shop?category=skincare');
    });

    test('falls back to /shop when targetSlug is missing', () => {
      const dest = resolvePromotionDestination({
        targetType: 'CATEGORY',
        code: 'CAT',
      });
      assert.equal(dest, '/shop?promo=CAT');
    });
  });

  describe('ENTIRE_STORE target tier', () => {
    test('routes to /shop with promo param', () => {
      const dest = resolvePromotionDestination({
        targetType: 'ENTIRE_STORE',
        code: 'STOREWIDE15',
      });
      assert.equal(dest, '/shop?promo=STOREWIDE15');
    });

    test('routes to /shop without promo param when code is absent', () => {
      const dest = resolvePromotionDestination({
        targetType: 'ENTIRE_STORE',
      });
      assert.equal(dest, '/shop');
    });
  });

  describe('Pure Deterministic Tier Routing (No Manual URL Override)', () => {
    test('ignores manual ctaLink and deterministically routes to CATEGORY page', () => {
      const dest = resolvePromotionDestination({
        targetType: 'CATEGORY',
        targetSlug: 'skincare',
        code: 'GLOW15',
        ctaLink: '/promotions/old-drop',
      });
      assert.equal(dest, '/shop?category=skincare&promo=GLOW15');
    });

    test('ignores external URL and routes to designated SINGLE_PRODUCT on /shop', () => {
      const dest = resolvePromotionDestination({
        targetType: 'SINGLE_PRODUCT',
        targetSlug: 'dew-drop-serum',
        code: 'DEW10',
        ctaLink: 'https://evil.example.com',
      });
      assert.equal(dest, '/shop?product=dew-drop-serum&promo=DEW10');
    });

    test('ignores protocol-relative and javascript: URIs', () => {
      const dest = resolvePromotionDestination({
        targetType: 'ENTIRE_STORE',
        code: 'SAFE',
        ctaLink: 'javascript:alert(1)',
      });
      assert.equal(dest, '/shop?promo=SAFE');
    });
  });
});

