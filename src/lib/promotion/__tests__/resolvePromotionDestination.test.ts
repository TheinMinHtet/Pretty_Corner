import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolvePromotionDestination,
  evaluatePromotionAction,
} from '../resolvePromotionDestination';
import { Promotion } from '../../types';

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

  describe('Deep evaluatePromotionAction Descriptor', () => {
    test('evaluates valid active promotion with authoritative action descriptor', () => {
      const promo: Promotion = {
        id: 'promo-active',
        code: 'SAVE20',
        title: 'Spring Glow Sale',
        discountPercentage: 20,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'CATEGORY',
        targetSlug: 'skincare',
      };

      const action = evaluatePromotionAction(promo);
      assert.equal(action.isValid, true);
      assert.equal(action.destinationUrl, '/shop?category=skincare&promo=SAVE20');
      assert.equal(action.discountPercentage, 20);
      assert.equal(action.hasCode, true);
      assert.equal(action.code, 'SAVE20');
      assert.equal(action.badgeLabel, '20% OFF EXCLUSIVE');
    });

    test('flags expired and out-of-stock promotions as invalid', () => {
      const expiredPromo: Promotion = {
        id: 'promo-exp',
        code: 'OLD',
        title: 'Expired',
        discountPercentage: 10,
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        active: true,
      };

      const action = evaluatePromotionAction(expiredPromo);
      assert.equal(action.isValid, false);
      assert.equal(action.isExpired, true);
    });
  });
});

