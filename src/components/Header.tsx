'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const CartBadge = dynamic(() => import('@/components/CartBadge'), { ssr: false });

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop') || pathname.startsWith('/product');
  const isTrack = pathname.startsWith('/order-lookup') || pathname.startsWith('/order-tracking');
  const isContact = pathname.startsWith('/contact');

  return (
    <header className="hidden md:block w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#eedfe5] transition-all">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[74px] flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col group shrink-0">
          <span className="font-serif text-[30px] lg:text-[34px] font-medium leading-none text-[#38262e] tracking-tight group-hover:text-[#b73d67] transition-colors">
            Pretty Corner
          </span>
          <span className="font-sans text-[9px] font-bold tracking-[2px] text-[#7a6870] uppercase mt-1">
            Your Everyday Beauty Edit
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-6 lg:gap-8 text-[14px]">
          <Link
            href="/"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 ${
              isHome ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            Home
            {isHome && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>

          <Link
            href="/shop?category=skincare"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 ${
              pathname.includes('category=skincare') ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            Skincare
            {pathname.includes('category=skincare') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>

          <Link
            href="/shop?category=makeup"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 ${
              pathname.includes('category=makeup') ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            Makeup
            {pathname.includes('category=makeup') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>

          <Link
            href="/shop"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 ${
              isShop && !pathname.includes('category=') ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            All Products
            {isShop && !pathname.includes('category=') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>

          <Link
            href="/order-lookup"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 ${
              isTrack ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            Track Order
            {isTrack && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>

          <Link
            href="/contact"
            className={`font-medium transition-colors hover:text-[#b73d67] relative py-1 ${
              isContact ? 'text-[#b73d67] font-bold' : 'text-[#38262e]'
            }`}
          >
            Contact
            {isContact && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b73d67] rounded-full" />
            )}
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          {/* Bag Button */}
          <Link
            href="/bag"
            className="flex items-center gap-2 bg-[#fceef2] hover:bg-[#fae2ea] text-[#38262e] px-4 py-2 rounded-full transition-all group"
          >
            <div className="relative">
              <svg className="w-5 h-5 text-[#38262e] group-hover:text-[#b73d67] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <CartBadge className="absolute -top-1.5 -right-2 bg-[#b73d67] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center" />
            </div>
            <span className="font-bold text-[13px] text-[#38262e]">
              Bag
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
