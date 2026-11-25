'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

const CartBadge = dynamic(() => import('@/components/CartBadge'), { ssr: false });

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useStore();

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop') || pathname.startsWith('/product');
  const isBag = pathname.startsWith('/bag') || pathname.startsWith('/checkout') || pathname.startsWith('/order-confirmation') || pathname.startsWith('/payment');
  const isReceipt = pathname.startsWith('/order-lookup') || pathname.startsWith('/order-tracking');
  const isContact = pathname.startsWith('/contact') || pathname.startsWith('/about') || pathname.startsWith('/faq') || pathname.startsWith('/policies');

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white/98 backdrop-blur-md z-40 border-t border-[#eedfe5] shadow-lg pb-[env(safe-area-inset-bottom,0px)]">
      <div className="h-[56px] sm:h-[58px] max-w-md sm:max-w-lg mx-auto flex items-center justify-around px-1 sm:px-2">
        {/* Home Tab */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 max-w-[64px] min-[360px]:max-w-[72px] sm:max-w-[80px] py-1 transition-colors ${
            isHome ? 'text-[#b73d67]' : 'text-[#7a6870] hover:text-[#38262e]'
          }`}
        >
          <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
          <span className={`text-[9.5px] sm:text-[10.5px] mt-0.5 tracking-tight truncate max-w-full px-0.5 ${isHome ? 'font-bold' : 'font-medium'}`}>
            {t.navHome}
          </span>
        </Link>

        {/* Shop Tab */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 max-w-[64px] min-[360px]:max-w-[72px] sm:max-w-[80px] py-1 transition-colors ${
            isShop ? 'text-[#b73d67]' : 'text-[#7a6870] hover:text-[#38262e]'
          }`}
        >
          <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span className={`text-[9.5px] sm:text-[10.5px] mt-0.5 tracking-tight truncate max-w-full px-0.5 ${isShop ? 'font-bold' : 'font-medium'}`}>
            {t.navShop}
          </span>
        </Link>

        {/* Bag Tab */}
        <Link
          href="/bag"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 max-w-[64px] min-[360px]:max-w-[72px] sm:max-w-[80px] py-1 transition-colors relative ${
            isBag ? 'text-[#b73d67]' : 'text-[#7a6870] hover:text-[#38262e]'
          }`}
        >
          <div className="relative">
            <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <CartBadge />
          </div>
          <span
            className={`text-[9.5px] sm:text-[10.5px] mt-0.5 tracking-tight truncate max-w-full px-0.5 ${isBag ? 'font-bold' : 'font-medium'}`}
          >
            {t.navBag}
          </span>
        </Link>

        {/* Order Receipt Tab */}
        <Link
          href="/order-lookup"
          aria-label={t.navReceipt}
          title={t.navReceipt}
          className={`flex flex-col items-center justify-center flex-1 min-w-0 max-w-[78px] min-[360px]:max-w-[86px] sm:max-w-[94px] py-1 transition-colors ${
            isReceipt ? 'text-[#b73d67]' : 'text-[#7a6870] hover:text-[#38262e]'
          }`}
        >
          <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
            <path d="M8 7h8" />
            <path d="M8 11h8" />
            <path d="M8 15h5" />
          </svg>
          <span className={`text-[8.5px] min-[340px]:text-[9px] min-[370px]:text-[10px] sm:text-[10.5px] mt-0.5 tracking-tight whitespace-nowrap text-center ${isReceipt ? 'font-bold' : 'font-medium'}`}>
            {t.navReceipt}
          </span>
        </Link>

        {/* Contact Tab */}
        <Link
          href="/contact"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 max-w-[64px] min-[360px]:max-w-[72px] sm:max-w-[80px] py-1 transition-colors ${
            isContact ? 'text-[#b73d67]' : 'text-[#7a6870] hover:text-[#38262e]'
          }`}
        >
          <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className={`text-[9.5px] sm:text-[10.5px] mt-0.5 tracking-tight truncate max-w-full px-0.5 ${isContact ? 'font-bold' : 'font-medium'}`}>
            {t.navContact}
          </span>
        </Link>
      </div>
    </nav>
  );
}
