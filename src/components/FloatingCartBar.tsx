'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function FloatingCartBar() {
  const pathname = usePathname();
  const { cartCount, cartSubtotal, isMounted } = useStore();

  // Hide the bar on cart/checkout pages and dedicated product detail page where purchase bar is present
  const isExcludedPage =
    pathname === '/bag' ||
    pathname.startsWith('/product') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/order-confirmation') ||
    pathname.startsWith('/payment-pending') ||
    pathname.startsWith('/payment-recovery');

  const isVisible = isMounted && cartCount > 0 && !isExcludedPage;

  if (!isMounted) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-20 opacity-0 pointer-events-none'
      } bottom-4 md:bottom-6 left-3 right-3 md:left-1/2 md:-translate-x-1/2 max-w-[420px] md:max-w-xl md:w-full mx-auto`}
    >
      <div className="bg-[#38262e]/85 text-white rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-2xl border border-white/15 flex items-center justify-between gap-3 backdrop-blur-lg">
        {/* Left Side: Bag Item Counter & Total Price */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-[#b73d67] flex items-center justify-center text-white shrink-0 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#b73d67] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in bag
            </span>
            <span className="text-[15px] sm:text-[17px] font-bold text-white tracking-tight leading-none mt-0.5">
              {cartSubtotal.toLocaleString()} MMK
            </span>
          </div>
        </div>

        {/* Right Side: View Cart / Bag Action */}
        <Link
          href="/bag"
          className="h-[42px] px-5 sm:px-6 bg-[#b73d67] hover:bg-[#a33259] active:scale-95 text-white text-[13px] sm:text-[14px] font-bold rounded-xl flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>View Cart</span>
        </Link>
      </div>
    </div>
  );
}
