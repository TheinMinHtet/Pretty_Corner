'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Promotion } from '@/lib/types';

export default function HeroBannerSlider() {
  const { promotions, promotionsLoading, t, language } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);

  // Filter only active promotions
  const activePromos = promotions.filter((p) => p.active !== false);

  const totalSlides = activePromos.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-advance slideshow every 5 seconds when >1 active promotions and not paused
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
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
  if (!promotionsLoading && totalSlides === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        <div className="relative w-full h-[386px] sm:h-[460px] md:h-[500px] lg:h-[540px] rounded-2xl md:rounded-3xl overflow-hidden bg-[#faf7f8] shadow-xs">
          <Image
            src="/assets/hero-banner.jpg"
            alt="Pretty Corner Hero"
            fill
            priority
            className="object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/35 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />

          <div className="absolute inset-0 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-between z-10">
            <div className="max-w-lg">
              <span className="inline-block font-sans text-[11px] sm:text-[12px] font-bold tracking-[2px] text-[#b73d67] uppercase">
                {t.heroBadge}
              </span>
              <h2
                className={`font-serif font-medium leading-[1.1] text-[#38262e] mt-2 ${
                  language === 'my'
                    ? 'text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]'
                    : 'text-[41px] sm:text-[50px] md:text-[58px] lg:text-[64px]'
                }`}
              >
                {t.heroTitleLine1}
                <br />
                {t.heroTitleLine2}
              </h2>
              <p className="font-sans text-[15px] sm:text-[16.5px] font-medium text-[#2e1d25] leading-relaxed mt-3 max-w-md">
                {t.heroDescription}
              </p>
            </div>

            <div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-[#b73d67] text-white text-[14px] sm:text-[15px] font-bold h-[48px] sm:h-[52px] px-7 sm:px-8 rounded-[12px] shadow-sm hover:bg-[#a33259] active:scale-[0.98] transition-all"
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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      <div
        className="relative w-full h-[386px] sm:h-[460px] md:h-[500px] lg:h-[540px] rounded-2xl md:rounded-3xl overflow-hidden bg-[#faf7f8] shadow-xs group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render Each Promotion Slide */}
        {activePromos.map((promo, idx) => {
          const isActive = idx === currentIndex;
          const bannerImage = promo.imageUrl || '/assets/hero-banner.jpg';
          const badgeText = promo.bannerBadge || `${promo.discountPercentage}% OFF EXCLUSIVE`;
          const ctaLabel = promo.ctaText || t.heroCta;
          const ctaDestination = promo.ctaLink || '/shop';

          return (
            <div
              key={promo.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Slide Background Image */}
              <Image
                src={bannerImage}
                alt={promo.title}
                fill
                priority={idx === 0}
                className="object-cover pointer-events-none scale-[1.01]"
              />

              {/* Editorial Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/45 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent pointer-events-none" />

              {/* Slide Editorial Typography & Content */}
              <div className="absolute inset-0 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-between">
                <div className="max-w-xl">
                  {/* Banner Badge Tag */}
                  <div className="inline-flex items-center gap-2 mb-1.5">
                    <span className="inline-block font-sans text-[11px] sm:text-[12px] font-bold tracking-[2px] text-[#b73d67] uppercase bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-[#f1d3df] shadow-2xs">
                      {badgeText}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h2
                    className={`font-serif font-medium leading-[1.1] text-[#38262e] mt-2 ${
                      language === 'my'
                        ? 'text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]'
                        : 'text-[38px] sm:text-[48px] md:text-[56px] lg:text-[62px]'
                    }`}
                  >
                    {promo.title}
                  </h2>

                  {/* Subtitle / Description */}
                  {promo.subtitle && (
                    <p className="font-sans text-[15px] sm:text-[16.5px] font-medium text-[#2e1d25] leading-relaxed mt-3 max-w-md">
                      {promo.subtitle}
                    </p>
                  )}

                  {/* Coupon Code Pill */}
                  {promo.code && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#eedfe5] shadow-xs">
                      <span className="text-[11px] sm:text-[12px] font-medium text-[#7a6870]">Use Code:</span>
                      <span className="text-[12px] sm:text-[13px] font-mono font-bold text-[#b73d67] tracking-wider">
                        {promo.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(promo.code, e)}
                        className="ml-1 text-[11px] font-bold text-[#38262e] hover:text-[#b73d67] bg-[#fceef2] hover:bg-[#f8dde5] px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                        title="Copy coupon code"
                      >
                        {copiedCode === promo.code ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary CTA Button */}
                <div className="pt-4">
                  <Link
                    href={ctaDestination}
                    className="inline-flex items-center justify-center bg-[#b73d67] text-white text-[14px] sm:text-[15px] font-bold h-[48px] sm:h-[52px] px-7 sm:px-8 rounded-[12px] shadow-sm hover:bg-[#982f53] active:scale-[0.98] transition-all"
                  >
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Arrows (Only when > 1 slide) */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/85 hover:bg-white text-[#38262e] shadow-md flex items-center justify-center backdrop-blur-md transition-all active:scale-95 opacity-0 group-hover:opacity-100 sm:opacity-75 focus:opacity-100 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/85 hover:bg-white text-[#38262e] shadow-md flex items-center justify-center backdrop-blur-md transition-all active:scale-95 opacity-0 group-hover:opacity-100 sm:opacity-75 focus:opacity-100 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Carousel Pagination Dots Indicator (Only when > 1 slide) */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {activePromos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                  currentIndex === idx
                    ? 'w-7 bg-[#b73d67]'
                    : 'w-2 bg-white/80 border border-[#b73d67]/30 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
