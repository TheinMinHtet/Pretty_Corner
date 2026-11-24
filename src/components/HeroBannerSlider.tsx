'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { resolvePromotionDestination, evaluatePromotionAction } from '@/lib/promotion/resolvePromotionDestination';

export default function HeroBannerSlider() {
  const { promotions, promotionsLoading, t, language, applyPromoCode } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);

  // Filter only valid, active, in-stock, non-expired promotions using deep promotion evaluator
  const activePromos = promotions.filter((p) => evaluatePromotionAction(p).isValid);
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

  // Loading state shimmer before promotions are resolved
  if (promotionsLoading && promotions.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6">
        <div className="w-full h-[360px] sm:h-[440px] md:h-[500px] lg:h-[540px] rounded-[24px] sm:rounded-[36px] bg-[#faf7f8] border border-[#eedfe5]/70 skeleton-shimmer" />
      </section>
    );
  }

  // State 0: Fallback to default editorial hero if no active promotions
  if (totalSlides === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6">
        <div className="relative w-full h-[360px] sm:h-[440px] md:h-[490px] lg:h-[520px] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#faf7f8] border border-[#eedfe5]/70 shadow-xs group select-none">
          {/* Editorial Background Image with Subtle, Calm Ken Burns Transition */}
          <Image
            src="/assets/hero-banner.jpg"
            alt="Pretty Corner"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover object-right md:object-center pointer-events-none transition-transform duration-[8000ms] ease-out group-hover:scale-[1.02] opacity-80 sm:opacity-85"
          />

          {/* Calming Luminous Gradient Masks */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f8] via-[#faf7f8]/90 md:via-[#faf7f8]/75 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f8]/95 via-transparent to-transparent pointer-events-none" />

          {/* Hero Content Shell */}
          <div className="absolute inset-0 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-between z-10">
            <div className="max-w-xl">
              {/* Frosted Capsule Brand Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#f1d3df] shadow-2xs mb-2.5 sm:mb-3.5">
                <span className="w-2 h-2 rounded-full bg-[#b73d67]" />
                <span className="font-sans text-[10.5px] sm:text-[12px] font-bold tracking-[1.5px] sm:tracking-[2px] text-[#b73d67] uppercase">
                  {t.heroBadge}
                </span>
              </div>

              {/* Confident, Font-Black Display Headline */}
              <h1
                className={`font-serif font-black leading-[1.08] text-[#22131b] tracking-tight ${
                  language === 'my'
                    ? 'text-[24px] sm:text-[34px] md:text-[42px] lg:text-[48px]'
                    : 'text-[30px] sm:text-[44px] md:text-[54px] lg:text-[60px]'
                }`}
              >
                {t.heroTitleLine1}
                <br />
                {t.heroTitleLine2}
              </h1>

              {/* Supporting Copy */}
              <p className="font-sans text-[13.5px] sm:text-[16px] font-normal text-[#422c36] leading-relaxed mt-2.5 sm:mt-3.5 max-w-lg line-clamp-2 sm:line-clamp-none">
                {t.heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6">
      <div
        className="relative w-full h-[340px] sm:h-[410px] md:h-[480px] lg:h-[520px] rounded-[22px] sm:rounded-[32px] overflow-hidden bg-[#faf7f8] border border-[#eedfe5]/70 shadow-xs select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render Each Promotion Slide with Smooth Crossfade and Staggered Transitions */}
        {activePromos.map((promo, idx) => {
          const isActive = idx === currentIndex;
          const bannerImage = promo.imageUrl || '/assets/hero-banner.jpg';
          const action = evaluatePromotionAction(promo, { language, defaultCta: '' });
          const badgeText = action.badgeLabel;
          const ctaLabel = promo.ctaText || '';
          const ctaDestination = action.destinationUrl;

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
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />

              {/* Slide Content with Staggered Entrance Animations */}
              <div className="absolute inset-0 p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                <div className="max-w-xl">
                  {/* Banner Badge Tag */}
                  <div
                    className={`inline-flex items-center gap-2 mb-1.5 transition-all duration-600 ease-out ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    }`}
                  >
                    <span className="inline-block font-sans text-[10px] sm:text-[12px] font-bold tracking-[1.5px] sm:tracking-[2px] text-[#b73d67] uppercase bg-white/85 backdrop-blur-xs px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-[#f1d3df] shadow-2xs">
                      {badgeText}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h2
                    className={`font-serif font-medium leading-[1.15] text-[#38262e] mt-1 sm:mt-2 transition-all duration-700 delay-100 ease-out ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    } ${
                      language === 'my'
                        ? 'text-[22px] sm:text-[34px] md:text-[42px] lg:text-[48px]'
                        : 'text-[25px] sm:text-[42px] md:text-[54px] lg:text-[62px]'
                    }`}
                  >
                    {promo.title}
                  </h2>

                  {/* Subtitle / Description */}
                  {promo.subtitle && (
                    <p
                      className={`font-sans text-[12.5px] sm:text-[16px] font-medium text-[#2e1d25] leading-relaxed mt-2.5 sm:mt-3.5 max-w-md line-clamp-2 sm:line-clamp-none transition-all duration-700 delay-200 ease-out ${
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      {promo.subtitle}
                    </p>
                  )}

                  {/* Coupon Code Pill */}
                  {promo.code && (
                    <div
                      className={`mt-2 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#eedfe5] shadow-xs transition-all duration-700 delay-250 ease-out ${
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

                {/* Primary CTA Button (only if custom ctaText provided) & Mobile Story Indicator */}
                {ctaLabel ? (
                  <div
                    className={`pt-2 sm:pt-4 flex items-center gap-2 sm:block transition-all duration-700 delay-300 ease-out ${
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
                      className="inline-flex items-center justify-center gap-1.5 bg-[#b73d67] text-white text-[12px] sm:text-[15px] font-bold h-[36px] sm:h-[50px] px-4 sm:px-8 rounded-full sm:rounded-[14px] shadow-sm hover:bg-[#982f53] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
                    >
                      <span>{ctaLabel}</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>

                    {/* MOBILE-ONLY: Side-by-side Vertically Centered Story Indicator */}
                    {totalSlides > 1 && (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="sm:hidden inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#eedfe5] shadow-2xs shrink-0 select-none"
                      >
                        {/* Segmented Progress Story Bars for Mobile */}
                        <div className="flex items-center gap-1">
                          {activePromos.map((_, pIdx) => {
                            const isCurrent = pIdx === currentIndex;
                            const isPast = pIdx < currentIndex;
                            return (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  goToSlide(pIdx);
                                }}
                                aria-label={`Jump to promotion slide ${pIdx + 1}`}
                                className="py-0.5 px-0.5 flex items-center cursor-pointer focus:outline-none"
                              >
                                <div
                                  className={`h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                                    isCurrent ? 'w-5 bg-[#eedfe5]' : 'w-2 bg-[#eedfe5]/75'
                                  }`}
                                >
                                  {isCurrent && (
                                    <div
                                      key={`prog-mob-${currentIndex}-${cycleCount}`}
                                      className="h-full bg-[#b73d67] rounded-full animate-hero-progress origin-left"
                                      style={{
                                        animationPlayState: isPaused ? 'paused' : 'running',
                                      }}
                                    />
                                  )}
                                  {isPast && (
                                    <div className="h-full w-full bg-[#b73d67] rounded-full" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Mobile Slide Index Counter */}
                        <div className="flex items-center gap-1 pl-1 border-l border-[#eedfe5] text-[10px] font-mono font-bold text-[#514149] leading-none">
                          <span>
                            0{currentIndex + 1}/0{totalSlides}
                          </span>
                          {isPaused && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#b73d67] animate-pulse"
                              title={language === 'my' ? 'ခေတ္တရပ်ထားသည်' : 'Paused'}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* DESKTOP/LAPTOP-ONLY: Original Dedicated Story Progress Bar & Navigation */}
        {totalSlides > 1 && (
          <div className="hidden sm:flex absolute sm:bottom-7 sm:left-10 md:left-12 lg:left-16 z-30 items-center gap-2.5">
            {activePromos.map((_, idx) => {
              const isCurrent = idx === currentIndex;
              const isPast = idx < currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Jump to promotion slide ${idx + 1}`}
                  className="group/seg relative sm:h-7 flex items-center cursor-pointer focus:outline-none"
                >
                  <div className="w-16 md:w-20 sm:h-2 rounded-full bg-black/15 backdrop-blur-xs overflow-hidden transition-all group-hover/seg:bg-black/25">
                    {isCurrent && (
                      <div
                        key={`prog-desk-${currentIndex}-${cycleCount}`}
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

            {/* Slide Index Counter & Live Pause Indicator for Desktop */}
            <div className="ml-2 flex items-center gap-2 text-[12px] font-bold text-[#38262e]/75">
              <span className="font-mono tracking-wider">
                0{currentIndex + 1} / 0{totalSlides}
              </span>
              {isPaused && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#b73d67] bg-white/85 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#f1d3df] shadow-2xs">
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
