'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function FloatingCartBar() {
  const pathname = usePathname();
  const { cartCount, cartSubtotal, isMounted, t } = useStore();

  // Hide the bar on cart/checkout pages where purchase flow is present
  const isExcludedPage =
    pathname === '/bag' ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/order-confirmation') ||
    pathname.startsWith('/payment-pending') ||
    pathname.startsWith('/payment-recovery');

  const isVisible = isMounted && cartCount > 0 && !isExcludedPage;

  if (!isMounted) return null;

  // Position above bottom nav when bottom nav is present (e.g. /shop, /) or near screen bottom on /product
  const hasBottomNav =
    !pathname.startsWith('/product') &&
    !pathname.startsWith('/checkout') &&
    !pathname.startsWith('/order-confirmation') &&
    !pathname.startsWith('/payment');

  const bottomPosition = hasBottomNav
    ? 'bottom-[calc(66px+env(safe-area-inset-bottom,0px))] lg:bottom-6'
    : 'bottom-[calc(16px+env(safe-area-inset-bottom,0px))] lg:bottom-6';

  return (
    <div
      className={`fixed z-50 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] min-[360px]:w-[calc(100%-24px)] max-w-[420px] sm:max-w-md lg:max-w-xl transition-all duration-300 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-20 opacity-0 pointer-events-none'
      } ${bottomPosition}`}
    >
      {/* Molten Glass / Translucent Liquid Sheen Container */}
      <div className="relative overflow-hidden rounded-2xl p-2.5 min-[360px]:p-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-2 min-[360px]:gap-3 bg-white/75 backdrop-blur-2xl backdrop-saturate-200 border border-white/85 shadow-[0_16px_40px_-8px_rgba(56,38,46,0.18),0_4px_16px_rgba(183,61,103,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)]">
        {/* Subtle glass reflection sheen */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        {/* Left Side: Bag Item Counter & Total Price */}
        <div className="relative flex items-center gap-2 min-[360px]:gap-2.5 sm:gap-3 min-w-0 shrink-0">
          <div className="relative w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-10 sm:h-10 rounded-xl bg-[#b73d67]/15 border border-[#b73d67]/30 flex items-center justify-center text-[#b73d67] shrink-0 shadow-xs backdrop-blur-sm">
            <svg className="w-4 h-4 min-[360px]:w-4.5 min-[360px]:h-4.5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#b73d67] text-white text-[9px] min-[360px]:text-[10px] font-bold rounded-full w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-[10px] min-[360px]:text-[11px] font-bold uppercase tracking-wider text-[#7a6870] leading-none whitespace-nowrap">
              {cartCount} {cartCount === 1 ? t.itemCountSingular : t.itemsCount}
            </span>
            <span className="text-[13px] min-[340px]:text-[14px] sm:text-[17px] font-bold text-[#38262e] tracking-tight leading-none mt-1 whitespace-nowrap">
              {cartSubtotal.toLocaleString()} MMK
            </span>
          </div>
        </div>

        {/* Right Side: View Cart / Bag Action (translucent glass button) */}
        <Link
          href="/bag"
          className="relative h-[36px] min-[360px]:h-[40px] sm:h-[42px] px-3 min-[360px]:px-4.5 sm:px-6 bg-[#b73d67] hover:bg-[#a13359] active:scale-95 text-white text-[11.5px] min-[360px]:text-[13px] sm:text-[14px] font-bold rounded-xl flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer border border-white/30 backdrop-blur-sm whitespace-nowrap"
        >
          <span>{t.viewBag}</span>
        </Link>
      </div>
    </div>
  );
}
