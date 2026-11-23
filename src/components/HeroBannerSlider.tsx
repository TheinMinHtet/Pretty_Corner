'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { resolvePromotionDestination } from '@/lib/promotion/resolvePromotionDestination';

export default function HeroBannerSlider() {
  const { promotions, t, language, applyPromoCode } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);

  // Filter only active, in-stock, non-expired, and non-exhausted promotions
  const now = new Date();
  const activePromos = promotions.filter((p) => {
    if (p.active === false || p.isOutOfStock === true) return false;
    if (p.endDate && new Date(p.endDate) < now) return false;
    if (p.usageLimit !== null && p.usageLimit !== undefined && (p.usageCount ?? 0) >= p.usageLimit) {
      return false;
    }
    return true;
  });
  const totalSlides = activePromos.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setCycleCount((c) => c + 1);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setCycleCount((c) => c + 1);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setCycleCount((c) => c + 1);
  }, []);

  // Auto-advance slideshow every 5.5 seconds when >1 active promotions and not paused
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused, nextSlide]);

  // Touch event handlers for mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  // State 0: Fallback to default editorial hero if no active promotions
  if (totalSlides === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6">
        <div className="relative w-full h-[330px] sm:h-[410px] md:h-[480px] lg:h-[520px] rounded-[20px] sm:rounded-[32px] overflow-hidden bg-[#faf7f8] border border-[#eedfe5]/70 shadow-xs">
          <Image
            src="/assets/hero-banner.jpg"
            alt="Pretty Corner Hero"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent pointer-events-none" />

          <div className="absolute inset-0 p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-between z-10">
            <div className="max-w-lg">
              <span className="inline-block font-sans text-[10.5px] sm:text-[12px] font-bold tracking-[1.5px] sm:tracking-[2px] text-[#b73d67] uppercase bg-white/80 backdrop-blur-xs px-3 py-0.5 sm:py-1 rounded-full border border-[#f1d3df] shadow-2xs">
                {t.heroBadge}
              </span>
              <h2
                className={`font-serif font-medium leading-[1.1] text-[#38262e] mt-2 sm:mt-3 ${
                  language === 'my'
                    ? 'text-[24px] sm:text-[34px] md:text-[42px] lg:text-[48px]'
                    : 'text-[30px] sm:text-[44px] md:text-[54px] lg:text-[60px]'
                }`}
              >
                {t.heroTitleLine1}
                <br />
                {t.heroTitleLine2}
              </h2>
              <p className="font-sans text-[13.5px] sm:text-[16px] font-medium text-[#2e1d25] leading-relaxed mt-2 sm:mt-3 max-w-md line-clamp-2 sm:line-clamp-none">
                {t.heroDescription}
              </p>
            </div>

            <div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-[#b73d67] text-white text-[13px] sm:text-[15px] font-bold h-[42px] sm:h-[50px] px-6 sm:px-8 rounded-[12px] sm:rounded-[14px] shadow-sm hover:bg-[#a33259] active:scale-[0.98] transition-all"
              >
                {t.heroCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6">
      <div
        className="relative w-full h-[330px] sm:h-[410px] md:h-[480px] lg:h-[520px] rounded-[20px] sm:rounded-[32px] overflow-hidden bg-[#faf7f8] border border-[#eedfe5]/70 shadow-xs select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render Each Promotion Slide with Smooth Crossfade and Staggered Transitions */}
        {activePromos.map((promo, idx) => {
          const isActive = idx === currentIndex;
          const bannerImage = promo.imageUrl || '/assets/hero-banner.jpg';
          const badgeText = promo.bannerBadge || `${promo.discountPercentage}% OFF EXCLUSIVE`;
          const ctaLabel = promo.ctaText || t.heroCta;
          const ctaDestination = resolvePromotionDestination({
            targetType: promo.targetType,
            promotionSlug: promo.slug,
            targetSlug: promo.targetSlug,
            code: promo.code,
            featuredProductIds: promo.featuredProductIds,
          });

          return (
            <div
              key={promo.id}
              className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with subtle Ken Burns drift */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={bannerImage}
                  alt={promo.title}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 1280px"
                  className={`object-cover pointer-events-none transition-transform duration-[6500ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>

              {/* Editorial Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/45 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent pointer-events-none" />

              {/* Slide Content with Staggered Entrance Animations */}
              <div className="absolute inset-0 p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                <div className="max-w-xl">
                  {/* Banner Badge Tag */}
                  <div
                    className={`inline-flex items-center gap-2 mb-1.5 transition-all duration-600 ease-out ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    }`}
                  >
                    <span className="inline-block font-sans text-[10px] sm:text-[12px] font-bold tracking-[1.5px] sm:tracking-[2px] text-[#b73d67] uppercase bg-white/85 backdrop-blur-xs px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-[#f1d3df] shadow-2xs">
                      {badgeText}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h2
                    className={`font-serif font-medium leading-[1.15] text-[#38262e] mt-1.5 sm:mt-2 transition-all duration-700 delay-100 ease-out ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    } ${
                      language === 'my'
                        ? 'text-[24px] sm:text-[34px] md:text-[42px] lg:text-[48px]'
                        : 'text-[30px] sm:text-[42px] md:text-[54px] lg:text-[62px]'
                    }`}
                  >
                    {promo.title}
                  </h2>

                  {/* Subtitle / Description */}
                  {promo.subtitle && (
                    <p
                      className={`font-sans text-[13px] sm:text-[16px] font-medium text-[#2e1d25] leading-snug sm:leading-relaxed mt-2 sm:mt-3 max-w-md transition-all duration-700 delay-200 ease-out ${
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      {promo.subtitle}
                    </p>
                  )}

                  {/* Coupon Code Pill */}
                  {promo.code && (
                    <div
                      className={`mt-2.5 sm:mt-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#eedfe5] shadow-xs transition-all duration-700 delay-250 ease-out ${
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <span className="text-[10px] sm:text-[12px] font-medium text-[#7a6870]">Use Code:</span>
                      <span className="text-[11px] sm:text-[13px] font-mono font-bold text-[#b73d67] tracking-wider">
                        {promo.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(promo.code, e)}
                        className="ml-1 text-[10px] sm:text-[11px] font-bold text-[#38262e] hover:text-[#b73d67] bg-[#fceef2] hover:bg-[#f8dde5] px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                        title="Copy coupon code"
                      >
                        {copiedCode === promo.code ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary CTA Button */}
                <div
                  className={`pt-2 sm:pt-4 transition-all duration-700 delay-300 ease-out ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Link
                    href={ctaDestination}
                    onClick={() => {
                      if (promo.code) {
                        applyPromoCode(promo.code);
                      }
                    }}
                    className="inline-flex items-center justify-center bg-[#b73d67] text-white text-[13px] sm:text-[15px] font-bold h-[42px] sm:h-[50px] px-5 sm:px-8 rounded-[12px] sm:rounded-[14px] shadow-sm hover:bg-[#982f53] active:scale-[0.98] transition-all"
                  >
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Minimalist Automated Progress Story Indicators (Replacing manual left/right buttons) */}
        {totalSlides > 1 && (
          <div className="absolute bottom-5 sm:bottom-7 left-6 sm:left-10 md:left-12 lg:left-16 z-30 flex items-center gap-2.5">
            {activePromos.map((_, idx) => {
              const isCurrent = idx === currentIndex;
              const isPast = idx < currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Jump to promotion slide ${idx + 1}`}
                  className="group/seg relative h-6 sm:h-7 flex items-center cursor-pointer focus:outline-none"
                >
                  {/* Outer track pill */}
                  <div className="w-10 sm:w-16 md:w-20 h-1.5 sm:h-2 rounded-full bg-black/15 backdrop-blur-xs overflow-hidden transition-all group-hover/seg:bg-black/25">
                    {isCurrent && (
                      <div
                        key={`prog-${currentIndex}-${cycleCount}`}
                        className="h-full bg-[#b73d67] rounded-full animate-hero-progress origin-left"
                        style={{
                          animationPlayState: isPaused ? 'paused' : 'running',
                        }}
                      />
                    )}
                    {isPast && (
                      <div className="h-full w-full bg-[#b73d67]/80 rounded-full" />
                    )}
                    {!isCurrent && !isPast && (
                      <div className="h-full w-0 bg-transparent rounded-full" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Slide Index Counter & Live Pause Indicator */}
            <div className="ml-2 flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#38262e]/75">
              <span className="font-mono tracking-wider">
                0{currentIndex + 1} / 0{totalSlides}
              </span>
              {isPaused && (
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#b73d67] bg-white/85 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#f1d3df] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] animate-pulse" />
                  {language === 'my' ? 'ခေတ္တရပ်ထားသည်' : 'Paused'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
