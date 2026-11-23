import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePricing,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  buildCartItemId,
  validatePromoCode,
} from '../CartEngine';
import { CartItem, Product, Promotion } from '../../types';

describe('CartEngine', () => {
  const sampleProducts: Product[] = [
    {
      id: 'prod-1',
      slug: 'serum-alpha',
      name: 'Alpha Serum',
      category: 'skincare',
      price: 30000,
      image: '/serum.jpg',
      gallery: [],
      description: 'Glow serum',
      benefits: [],
      usage: 'daily',
      inStock: true,
    },
    {
      id: 'prod-2',
      slug: 'hair-dryer',
      name: 'Ion Hair Dryer',
      category: 'electrical',
      price: 80000,
      image: '/dryer.jpg',
      gallery: [],
      description: 'Fast drying',
      benefits: [],
      usage: 'dry hair',
      inStock: true,
    },
    {
      id: 'prod-3',
      slug: 'velvet-lipstick',
      name: 'Velvet Lipstick',
      category: 'makeup',
      price: 15000,
      image: '/lipstick.jpg',
      gallery: [],
      description: 'Long lasting',
      benefits: [],
      usage: 'lips',
      inStock: true,
    },
  ];

  const cartItems: CartItem[] = [
    {
      id: 'prod-1',
      productId: 'prod-1',
      name: 'Alpha Serum',
      size: '',
      price: 30000,
      quantity: 2, // 60,000 MMK subtotal
      image: '/serum.jpg',
    },
    {
      id: 'prod-2',
      productId: 'prod-2',
      name: 'Ion Hair Dryer',
      size: '',
      price: 80000,
      quantity: 1, // 80,000 MMK subtotal
      image: '/dryer.jpg',
    },
  ];

  describe('calculatePricing with Target Tiers', () => {
    test('calculates correct totals without promotion', () => {
      const summary = calculatePricing(cartItems, null, 2500);
      assert.equal(summary.itemCount, 3);
      assert.equal(summary.subtotal, 140000);
      assert.equal(summary.discountAmount, 0);
      assert.equal(summary.shippingFee, 2500);
      assert.equal(summary.grandTotal, 142500);
    });

    test('ENTIRE_STORE tier: applies discount across all eligible items', () => {
      const promo: Promotion = {
        id: 'promo-1',
        code: 'STORE10',
        title: '10% Off All',
        discountPercentage: 10,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'ENTIRE_STORE',
      };

      const summary = calculatePricing(cartItems, promo, 0, 0, sampleProducts);
      // 10% of 60,000 = 6,000; 10% of 80,000 = 8,000; Total discount = 14,000
      assert.equal(summary.subtotal, 140000);
      assert.equal(summary.discountAmount, 14000);
      assert.equal(summary.grandTotal, 126000);
    });

    test('SINGLE_PRODUCT tier: applies discount only to the designated product', () => {
      const promo: Promotion = {
        id: 'promo-2',
        code: 'SERUM20',
        title: '20% Off Serum',
        discountPercentage: 20,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'SINGLE_PRODUCT',
        targetSlug: 'serum-alpha',
      };

      const summary = calculatePricing(cartItems, promo, 0, 0, sampleProducts);
      // Serum subtotal: 60,000 * 20% = 12,000. Hair dryer subtotal: 80,000 * 0% = 0.
      assert.equal(summary.subtotal, 140000);
      assert.equal(summary.discountAmount, 12000);
      assert.equal(summary.grandTotal, 128000);
    });

    test('CATEGORY tier: applies discount only to products matching target category', () => {
      const promo: Promotion = {
        id: 'promo-3',
        code: 'SKIN15',
        title: '15% Off Skincare',
        discountPercentage: 15,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'CATEGORY',
        targetSlug: 'skincare',
      };

      const summary = calculatePricing(cartItems, promo, 0, 0, sampleProducts);
      // Skincare (Serum): 60,000 * 15% = 9,000. Electrical (Dryer): 0.
      assert.equal(summary.discountAmount, 9000);
      assert.equal(summary.grandTotal, 131000);
    });

    test('enforces minimumOrderAmount threshold', () => {
      const promo: Promotion = {
        id: 'promo-5',
        code: 'BIGSPENDER',
        title: '20% off over 200k',
        discountPercentage: 20,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'ENTIRE_STORE',
        minimumOrderAmount: 200000,
      };

      // Cart subtotal is 140,000 (< 200,000) -> discount must be 0
      const summary = calculatePricing(cartItems, promo, 0, 0, sampleProducts);
      assert.equal(summary.discountAmount, 0);
      assert.equal(summary.grandTotal, 140000);
    });

    test('enforces 60% margin safety ceiling per line item', () => {
      const highPromo: Promotion = {
        id: 'promo-6',
        code: 'CRAZY80',
        title: '80% Flash Sale',
        discountPercentage: 80,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'ENTIRE_STORE',
      };

      const summary = calculatePricing(cartItems, highPromo, 0, 0, sampleProducts);
      // 60,000 * 60% = 36,000 max. 80,000 * 60% = 48,000 max. Total discount = 84,000 (not 112,000)
      assert.equal(summary.discountAmount, 84000);
      assert.equal(summary.grandTotal, 56000);
    });

    test('rounds discount and total to integer Myanmar Kyat (no decimals)', () => {
      const itemsWithOddPrices: CartItem[] = [
        {
          id: 'prod-odd',
          productId: 'prod-odd',
          name: 'Odd Price Item',
          size: '',
          price: 13333,
          quantity: 1,
          image: '',
        },
      ];

      const promo: Promotion = {
        id: 'promo-odd',
        code: 'ODD15',
        title: '15% Off',
        discountPercentage: 15,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'ENTIRE_STORE',
      };

      const summary = calculatePricing(itemsWithOddPrices, promo, 0);
      // 13333 * 0.15 = 1999.95 -> rounds to 2000 MMK
      assert.equal(summary.discountAmount, 2000);
      assert.equal(summary.grandTotal, 11333);
      assert.equal(Number.isInteger(summary.discountAmount), true);
      assert.equal(Number.isInteger(summary.grandTotal), true);
    });

    test('mixed cart: isolates promotional items from non-promotional items with line-item breakdowns', () => {
      // 2x Alpha Serum (60,000 MMK) + 1x Ion Hair Dryer (80,000 MMK) = 140,000 MMK subtotal
      const mixedPromo: Promotion = {
        id: 'promo-targeted',
        code: 'SERUM20',
        title: '20% Off Serums',
        discountPercentage: 20,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'SINGLE_PRODUCT',
        targetSlug: 'serum-alpha',
      };

      const summary = calculatePricing(cartItems, mixedPromo, 0, 0, sampleProducts);
      assert.equal(summary.subtotal, 140000);
      assert.equal(summary.promoSubtotal, 60000);
      assert.equal(summary.nonPromoSubtotal, 80000);
      assert.equal(summary.discountAmount, 12000); // 20% of 60,000 ONLY
      assert.equal(summary.grandTotal, 128000); // 140,000 - 12,000

      // Line items inspection
      assert.equal(summary.lineItems.length, 2);
      const serumItem = summary.lineItems.find((it) => it.productId === 'prod-1');
      const dryerItem = summary.lineItems.find((it) => it.productId === 'prod-2');

      assert.ok(serumItem);
      assert.equal(serumItem.isEligible, true);
      assert.equal(serumItem.discountAmount, 12000);
      assert.equal(serumItem.finalTotal, 48000);
      assert.equal(serumItem.promoCode, 'SERUM20');

      assert.ok(dryerItem);
      assert.equal(dryerItem.isEligible, false);
      assert.equal(dryerItem.discountAmount, 0);
      assert.equal(dryerItem.finalTotal, 80000);
      assert.equal(dryerItem.promoCode, undefined);
    });
  });

  describe('Cart Item Operations & Variant Handling', () => {
    test('buildCartItemId produces consistent composite key for variants', () => {
      assert.equal(buildCartItemId('p1', '50ml'), 'p1-50ml');
      assert.equal(buildCartItemId('p1', ''), 'p1');
      assert.equal(buildCartItemId('p1', undefined), 'p1');
    });

    test('addCartItem adds new item and increments existing variant', () => {
      const productWithSizes: Product = {
        ...sampleProducts[0],
        sizes: [
          { name: '30ml', price: 25000, inStock: true },
          { name: '50ml', price: 40000, inStock: true },
        ],
      };

      let cart = addCartItem([], productWithSizes, '30ml', 1);
      assert.equal(cart.length, 1);
      assert.equal(cart[0].id, 'prod-1-30ml');
      assert.equal(cart[0].price, 25000);
      assert.equal(cart[0].quantity, 1);

      // Add another 30ml
      cart = addCartItem(cart, productWithSizes, '30ml', 2);
      assert.equal(cart.length, 1);
      assert.equal(cart[0].quantity, 3);

      // Add 50ml variant
      cart = addCartItem(cart, productWithSizes, '50ml', 1);
      assert.equal(cart.length, 2);
      assert.equal(cart[1].id, 'prod-1-50ml');
      assert.equal(cart[1].price, 40000);
    });

    test('updateCartItemQuantity increments, decrements, and removes when reaching zero', () => {
      let cart: CartItem[] = [
        { id: 'item-1', productId: 'p1', name: 'P1', size: '', price: 1000, quantity: 2, image: '' },
      ];

      cart = updateCartItemQuantity(cart, 'item-1', 1);
      assert.equal(cart[0].quantity, 3);

      cart = updateCartItemQuantity(cart, 'item-1', -2);
      assert.equal(cart[0].quantity, 1);

      // Decrement below 1 removes it
      cart = updateCartItemQuantity(cart, 'item-1', -1);
      assert.equal(cart.length, 0);
    });

    test('removeCartItem removes item by id', () => {
      const initial: CartItem[] = [
        { id: 'item-1', productId: 'p1', name: 'P1', size: '', price: 1000, quantity: 1, image: '' },
        { id: 'item-2', productId: 'p2', name: 'P2', size: '', price: 2000, quantity: 1, image: '' },
      ];
      const result = removeCartItem(initial, 'item-1');
      assert.equal(result.length, 1);
      assert.equal(result[0].id, 'item-2');
    });
  });

  describe('validatePromoCode', () => {
    const promoList: Promotion[] = [
      {
        id: 'p1',
        code: 'WELCOME10',
        title: 'Welcome Discount',
        discountPercentage: 10,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
      },
      {
        id: 'p2',
        code: 'EXPIRED20',
        title: 'Old Promo',
        discountPercentage: 20,
        startDate: '2025-01-01',
        endDate: '2025-02-01',
        active: false,
      },
    ];

    test('validates case-insensitively and returns matched promo', () => {
      const result = validatePromoCode('welcome10', promoList, 'en');
      assert.equal(result.success, true);
      assert.equal(result.promo?.code, 'WELCOME10');
    });

    test('rejects inactive or nonexistent code', () => {
      const inactiveResult = validatePromoCode('EXPIRED20', promoList, 'en');
      assert.equal(inactiveResult.success, false);

      const fakeResult = validatePromoCode('NOTREAL', promoList, 'en');
      assert.equal(fakeResult.success, false);
    });

    test('rejects expired promo date or exhausted usage limit', () => {
      const expiredPromo: Promotion = {
        id: 'p-past',
        code: 'PASTDATE',
        title: 'Past Promo',
        discountPercentage: 10,
        startDate: '2026-01-01',
        endDate: '2026-02-01', // Expired
        active: true,
      };

      const exhaustedPromo: Promotion = {
        id: 'p-quota',
        code: 'EXHAUSTED',
        title: 'Quota Promo',
        discountPercentage: 10,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        usageLimit: 50,
        usageCount: 50, // Exhausted
      };

      const resExpired = validatePromoCode('PASTDATE', [expiredPromo], 'en');
      assert.equal(resExpired.success, false);
      assert.match(resExpired.message, /expired/i);

      const resQuota = validatePromoCode('EXHAUSTED', [exhaustedPromo], 'en');
      assert.equal(resQuota.success, false);
      assert.match(resQuota.message, /usage limit/i);
    });

    test('handles empty code input', () => {
      const emptyResult = validatePromoCode('   ', promoList, 'en');
      assert.equal(emptyResult.success, false);
    });

    test('rejects promo code if cart has zero qualifying items', () => {
      const targetedPromo: Promotion = {
        id: 'p-targeted',
        code: 'LIPSTICKONLY',
        title: 'Lipstick Promo',
        discountPercentage: 20,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'CATEGORY',
        targetSlug: 'makeup',
      };

      // Cart only has skincare ('serum-alpha')
      const cartSkincareOnly: CartItem[] = [cartItems[0]];
      const res = validatePromoCode(
        'LIPSTICKONLY',
        [targetedPromo],
        'en',
        cartSkincareOnly,
        sampleProducts
      );

      assert.equal(res.success, false);
      assert.match(res.message, /qualifying.*items/i);
    });

    test('rejects promo code if qualifying items subtotal is below minimumOrderAmount', () => {
      const thresholdPromo: Promotion = {
        id: 'p-thresh',
        code: 'MINSERUM',
        title: 'Serum promo over 100k',
        discountPercentage: 20,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'SINGLE_PRODUCT',
        targetSlug: 'serum-alpha',
        minimumOrderAmount: 100000,
      };

      // Cart has 1 serum (30,000 MMK) + 1 hair dryer (80,000 MMK) = total 110,000 MMK
      // Total cart >= 100,000, BUT qualifying serum subtotal is 30,000 (< 100,000)
      const mixedCart: CartItem[] = [
        { ...cartItems[0], quantity: 1, price: 30000 },
        cartItems[1], // 80,000
      ];

      const res = validatePromoCode(
        'MINSERUM',
        [thresholdPromo],
        'en',
        mixedCart,
        sampleProducts
      );

      assert.equal(res.success, false);
      assert.match(res.message, /minimum order amount.*qualifying promotional items/i);
    });
  });

  describe('Deepened Pricing Summary Rows & Presentation Metadata', () => {
    test('produces authoritative summaryRows for subtotal, discount, shipping, and grand total', () => {
      const promo: Promotion = {
        id: 'promo-1',
        code: 'STORE10',
        title: '10% Off All',
        discountPercentage: 10,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        active: true,
        targetType: 'ENTIRE_STORE',
      };

      const summary = calculatePricing(cartItems, promo, 3000, 0, sampleProducts);
      assert.ok(summary.summaryRows);
      assert.equal(summary.summaryRows.length, 4);

      const subtotalRow = summary.summaryRows.find((r) => r.key === 'subtotal');
      assert.ok(subtotalRow);
      assert.equal(subtotalRow.amount, 140000);
      assert.equal(subtotalRow.formattedAmount, '140,000 MMK');

      const discountRow = summary.summaryRows.find((r) => r.key === 'discount');
      assert.ok(discountRow);
      assert.equal(discountRow.amount, 14000);
      assert.equal(discountRow.formattedAmount, '−14,000 MMK');
      assert.equal(discountRow.isNegative, true);

      const shippingRow = summary.summaryRows.find((r) => r.key === 'shipping');
      assert.ok(shippingRow);
      assert.equal(shippingRow.amount, 3000);
      assert.equal(shippingRow.formattedAmount, '3,000 MMK');

      const totalRow = summary.summaryRows.find((r) => r.key === 'total');
      assert.ok(totalRow);
      assert.equal(totalRow.amount, 129000);
      assert.equal(totalRow.formattedAmount, '129,000 MMK');

      // Verify enriched line items
      assert.equal(summary.lineItems[0].hasDiscount, true);
      assert.equal(summary.lineItems[0].formattedFinalTotal, '54,000 MMK');
      assert.equal(summary.lineItems[0].formattedSubtotal, '60,000 MMK');
    });
  });
});
