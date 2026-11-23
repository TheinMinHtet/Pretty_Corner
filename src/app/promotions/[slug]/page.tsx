'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Promotion, Product } from '@/lib/types';

const ProductCardStepper = dynamic(() => import('@/components/ProductCardStepper'), {
  ssr: false,
  loading: () => (
    <button className="h-[30px] sm:h-[32px] px-3 bg-[#b73d67] text-white rounded-[7px] text-[11px] sm:text-[12px] font-bold flex items-center gap-1 shadow-xs">
      + Add
    </button>
  ),
});

export default function PromotionHubPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const {
    promotions,
    promotionsLoading,
    products,
    productsLoading,
    language,
    t,
    applyPromoCode,
    appliedPromo,
  } = useStore();

  const [copied, setCopied] = useState(false);

  // Find matching promotion by slug or id or code
  const promotion: Promotion | undefined = useMemo(() => {
    if (!slug) return undefined;
    const clean = slug.toLowerCase();
    return promotions.find(
      (p) =>
        (p.slug && p.slug.toLowerCase() === clean) ||
        p.id.toLowerCase() === clean ||
        p.code.toLowerCase() === clean
    );
  }, [promotions, slug]);

  const router = useRouter();

  // Forward to unified shop catalog
  useEffect(() => {
    if (slug) {
      const codeQuery = promotion?.code ? `?promo=${encodeURIComponent(promotion.code)}` : '';
      router.replace(`/shop${codeQuery}`);
    }
  }, [slug, promotion, router]);

  // Auto-ingest promo code into cart context on mount
  useEffect(() => {
    if (promotion && promotion.active !== false && !promotion.isOutOfStock) {
      applyPromoCode(promotion.code);
    }
  }, [promotion, applyPromoCode]);

  const handleCopyCode = () => {
    if (!promotion?.code) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(promotion.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Filter products belonging to this promotion
  const eligibleProducts: Product[] = useMemo(() => {
    if (!promotion) return [];

    if (promotion.targetType === 'SINGLE_PRODUCT') {
      const target = promotion.targetSlug || promotion.featuredProductIds?.[0];
      return products.filter((p) => p.id === target || p.slug === target || p.databaseId === target);
    }

    if (promotion.targetType === 'CATEGORY' && promotion.targetSlug) {
      const targetCat = promotion.targetSlug.toLowerCase();
      return products.filter((p) => (p.category || '').toLowerCase() === targetCat);
    }

    // Fallback: if entire store or no product filter
    return products.slice(0, 12);
  }, [promotion, products]);

  // Loading skeleton while initial promotions/products fetch is in-flight
  if (promotionsLoading || (productsLoading && products.length === 0)) {
    return (
      <main className="w-full min-h-[70vh] bg-white flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center bg-[#faf7f8] border border-[#eedfe5] rounded-[32px] p-8 sm:p-12 shadow-sm animate-pulse space-y-4">
          <div className="w-16 h-16 bg-[#fceef2] rounded-full mx-auto" />
          <div className="h-6 bg-[#eedfe5] rounded-full w-3/4 mx-auto" />
          <div className="h-4 bg-[#eedfe5] rounded-full w-1/2 mx-auto" />
        </div>
      </main>
    );
  }

  const isExpired = Boolean(promotion?.endDate && new Date(promotion.endDate) < new Date());
  const isQuotaExceeded = Boolean(
    promotion?.usageLimit !== null &&
    promotion?.usageLimit !== undefined &&
    (promotion?.usageCount ?? 0) >= promotion.usageLimit
  );

  // Handle case where promotion does not exist or is inactive/depleted
  if (!promotion || promotion.active === false || promotion.isOutOfStock || isExpired || isQuotaExceeded) {
    const isOut = promotion?.isOutOfStock;
    return (
      <main className="w-full min-h-[70vh] bg-white flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center bg-[#faf7f8] border border-[#eedfe5] rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 bg-[#fceef2] text-[#b73d67] rounded-full mx-auto flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-[26px] sm:text-[30px] font-black text-[#38262e] leading-snug">
            {isOut
              ? language === 'my'
                ? 'ပရိုမိုးရှင်း လက်ကျန်ကုန်သွားပါပြီ'
                : 'Promotion Out of Stock'
              : isQuotaExceeded
              ? language === 'my'
                ? 'ပရိုမိုးရှင်း အရေအတွက် ကုန်ဆုံးသွားပါပြီ'
                : 'Promotion Quota Exhausted'
              : language === 'my'
              ? 'ပရိုမိုးရှင်း သက်တမ်းကုန်သွားပါပြီ'
              : 'Promotion Concluded'}
          </h1>
          <p className="font-sans text-[14px] sm:text-[15px] text-[#7a6870] mt-3 leading-relaxed">
            {isOut
              ? language === 'my'
                ? 'ဤပရိုမိုးရှင်းတွင် ပါဝင်သော ပစ္စည်းများအားလုံး လက်ကျန်ကုန်သွားပါပြီ။ အခြားပစ္စည်းများကို လေ့လာကြည့်ရှုနိုင်ပါသည်။'
                : 'The products in this promotional campaign have temporarily sold out. Discover more items in our shop.'
              : isQuotaExceeded
              ? language === 'my'
                ? 'ဤပရိုမိုးရှင်း၏ အသုံးပြုနိုင်သည့် အကြိမ်အရေအတွက် ပြည့်သွားပါပြီ။'
                : 'The maximum redemption quota for this campaign has been reached.'
              : language === 'my'
              ? 'ဤပရိုမိုးရှင်း ကမ်ပိန်းသည် ပြီးဆုံးသွားပါပြီ။ နောက်ထပ် ပရိုမိုးရှင်း အထူးအစီအစဉ်များကို စောင့်မျှော်ပေးပါ။'
              : 'This special campaign has concluded. Explore our latest arrivals and seasonal favorites.'}
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#b73d67] hover:bg-[#982f53] text-white text-[14px] font-bold h-[48px] px-8 rounded-full shadow-sm transition-all"
            >
              {language === 'my' ? 'အရောင်းဆိုင်သို့ သွားမည်' : 'Explore Store'}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isApplied = appliedPromo?.code.toUpperCase() === promotion.code.toUpperCase();

  return (
    <main className="w-full bg-[#fdfbfc] min-h-screen pb-20">
      {/* 1. Hero Campaign Banner (Perplexity Rounded-[32px] Aesthetics) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-br from-[#faf4f6] via-[#fdf7f9] to-[#f9eff3] border border-[#eedfe5] shadow-xs p-6 sm:p-10 md:p-12 lg:p-16">
          {/* Subtle Decorative Gradient Orb */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#f9dbe4]/40 via-[#f9e9ef]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            {/* Badge Tag */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="font-sans text-[11px] sm:text-[12px] font-bold tracking-[2px] text-[#b73d67] uppercase bg-white/90 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#f1d3df] shadow-2xs">
                {promotion.bannerBadge || `${promotion.discountPercentage}% OFF CURATED COLLECTION`}
              </span>
            </div>

            {/* Campaign Title */}
            <h1 className="font-serif text-[32px] sm:text-[44px] md:text-[52px] font-black leading-[1.1] text-[#38262e] tracking-tight">
              {promotion.title}
            </h1>

            {/* Subtitle */}
            {promotion.subtitle && (
              <p className="font-sans text-[15px] sm:text-[17px] font-medium text-[#7a6870] mt-3 sm:mt-4 leading-relaxed max-w-xl">
                {promotion.subtitle}
              </p>
            )}

            {/* Campaign Meta & Auto-Ingested Coupon Card */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Coupon Pill */}
              <div className="inline-flex items-center gap-2.5 bg-white px-4 py-2 rounded-full border border-[#eedfe5] shadow-2xs">
                <span className="text-[12px] font-medium text-[#7a6870]">Coupon:</span>
                <span className="font-mono text-[14px] font-bold text-[#b73d67] tracking-wider">
                  {promotion.code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-[11px] font-bold text-[#38262e] hover:text-[#b73d67] bg-[#fceef2] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* Status Badge */}
              {isApplied ? (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[12px] font-bold px-3.5 py-2 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'my' ? 'စျေးခြင်းတွင် ထည့်သွင်းပြီးပါပြီ' : 'Applied to your order'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => applyPromoCode(promotion.code)}
                  className="inline-flex items-center gap-1.5 bg-[#b73d67] hover:bg-[#982f53] text-white text-[12px] font-bold px-4 py-2 rounded-full shadow-2xs transition-all cursor-pointer"
                >
                  <span>{language === 'my' ? 'ကူပွန် အသုံးပြုမည်' : 'Apply Coupon'}</span>
                </button>
              )}

              {/* Minimum Order Note */}
              {promotion.minimumOrderAmount && (
                <span className="text-[12px] font-medium text-[#7a6870] bg-white/70 px-3 py-1.5 rounded-full border border-[#eedfe5]">
                  {language === 'my'
                    ? `အနည်းဆုံး ${promotion.minimumOrderAmount.toLocaleString()} MMK ဝယ်ယူရပါမည်`
                    : `Min. spend: ${promotion.minimumOrderAmount.toLocaleString()} MMK`}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Eligible Products Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="flex items-center justify-between pb-6 border-b border-[#eedfe5]">
          <div>
            <h2 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#38262e]">
              {language === 'my' ? 'ပါဝင်သော အထူးပစ္စည်းများ' : 'Eligible Promotional Products'}
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#7a6870] mt-1">
              {language === 'my'
                ? `ဤပရိုမိုးရှင်းဖြင့် ${promotion.discountPercentage}% လျှော့စျေး ရယူလိုက်ပါ။`
                : `Enjoy ${promotion.discountPercentage}% automatic discount on these qualifying products.`}
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[13px] font-bold text-[#b73d67] hover:underline shrink-0"
          >
            {t.viewAll} →
          </Link>
        </div>

        {/* Product Grid */}
        {eligibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
            {eligibleProducts.map((product) => {
              const discountedPrice = Math.round(
                product.price * (1 - Math.min(60, promotion.discountPercentage) / 100)
              );

              return (
                <div
                  key={product.id}
                  className="flex flex-col group bg-white p-3 sm:p-4 rounded-[24px] border border-[#eedfe5] hover:shadow-sm transition-all"
                >
                  <div className="relative w-full h-[200px] sm:h-[240px] bg-[#f9f5f7] rounded-[18px] overflow-hidden">
                    <Link href={`/product/${product.slug || product.id}`} className="block relative w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Promo Discount Tag */}
                    <span className="absolute top-2.5 left-2.5 bg-[#b73d67] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs select-none">
                      -{promotion.discountPercentage}% OFF
                    </span>
                  </div>

                  {/* Details */}
                  <div className="pt-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-medium tracking-wide text-[#7a6870] uppercase">
                        {product.category}
                      </p>
                      <Link href={`/product/${product.slug || product.id}`}>
                        <h3 className="text-[15px] sm:text-[16px] font-medium text-[#38262e] hover:text-[#b73d67] transition-colors line-clamp-1 mt-0.5">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f5edf0]">
                      <div>
                        <span className="block text-[14px] sm:text-[15px] font-bold text-[#b73d67]">
                          {discountedPrice.toLocaleString()} MMK
                        </span>
                        <span className="block text-[11px] text-[#7a6870] line-through">
                          {product.price.toLocaleString()} MMK
                        </span>
                      </div>
                      <ProductCardStepper productId={product.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-serif text-[22px] text-[#38262e]">
              {language === 'my' ? 'ပစ္စည်းများ ရှာမတွေ့ပါ' : 'No items currently available in this promotion.'}
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block px-6 py-2.5 bg-[#b73d67] text-white text-[13px] font-bold rounded-full"
            >
              {language === 'my' ? 'ဆိုင်ရှိ ပစ္စည်းအားလုံး ကြည့်ရန်' : 'Browse All Products'}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
