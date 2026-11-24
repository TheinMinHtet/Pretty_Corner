'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import LanguageToggle from '@/components/LanguageToggle';

const CartBadge = dynamic(() => import('@/components/CartBadge'), { ssr: false });

export default function Header() {
  const pathname = usePathname();
  const { t } = useStore();

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop') || pathname.startsWith('/product');
  const isTrack = pathname.startsWith('/order-lookup') || pathname.startsWith('/order-tracking');
  const isContact = pathname.startsWith('/contact');

  return (
    <header className="w-full sticky top-0 z-50 bg-white/98 sm:bg-white/95 backdrop-blur-md border-b border-[#eedfe5] transition-all">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2.5 min-[360px]:px-3 sm:px-6 lg:px-8 h-[54px] min-[360px]:h-[56px] sm:h-[64px] md:h-[74px] flex items-center justify-between gap-1.5 min-[360px]:gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col group shrink-0">
          <span className="font-serif text-[18px] min-[360px]:text-[20px] sm:text-[28px] md:text-[30px] lg:text-[34px] font-medium leading-none text-[#38262e] tracking-tight group-hover:text-[#b73d67] transition-colors">
            {t.brandName}
          </span>
          <span className="font-sans text-[6.5px] min-[360px]:text-[7px] sm:text-[9px] font-bold tracking-[0.8px] min-[360px]:tracking-[1.2px] sm:tracking-[2px] text-[#7a6870] uppercase mt-0.5 sm:mt-1">
            {t.brandSlogan}
          </span>
        </Link>

        {/* Center Nav Links (lg and above: prevents squishing/wrapping on tablet/intermediate viewports) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px] whitespace-nowrap">
          <Link
            href="/"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 whitespace-nowrap ${
              isHome ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            {t.navHome}
            {isHome && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>

          <Link
            href="/shop"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 whitespace-nowrap ${
              isShop ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            {t.navShop}
            {isShop && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>

          <Link
            href="/order-lookup"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 whitespace-nowrap ${
              isTrack ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            {t.navReceipt}
            {isTrack && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>

          <Link
            href="/contact"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 whitespace-nowrap ${
              isContact ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            {t.navContact}
            {isContact && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>
        </nav>

        {/* Right Action Icons: Language Toggle + Bag */}
        <div className="flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-3 shrink-0">
          {/* Aesthetic Language Switcher */}
          <LanguageToggle />

          {/* Bag Button */}
          <Link
            href="/bag"
            aria-label={t.navBag}
            className="flex items-center justify-center gap-1 sm:gap-2 bg-[#fceef2] hover:bg-[#fae2ea] text-[#38262e] h-7 min-[380px]:h-8 sm:h-9 px-2 min-[380px]:px-2.5 sm:px-4 rounded-full transition-all group shrink-0"
          >
            <div className="relative flex items-center justify-center">
              <svg className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-5 sm:h-5 text-[#38262e] group-hover:text-[#b73d67] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <CartBadge className="absolute -top-1.5 -right-2 bg-[#b73d67] text-white text-[8.5px] min-[360px]:text-[9px] font-bold rounded-full w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 flex items-center justify-center" />
            </div>
            <span className="hidden min-[380px]:inline font-bold text-[11px] sm:text-[13px] text-[#38262e]">
              {t.navBag}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
