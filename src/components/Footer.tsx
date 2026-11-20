'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#fdfafb] border-t border-[#eedfe5] mt-auto">
      {/* 1. Main Footer Grid: 2 columns on mobile (Brand spans 2 cols, Customer Care & Payment side-by-side), 3 columns on desktop */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-5 sm:pt-6 lg:pt-8 pb-5 sm:pb-8 lg:pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 lg:gap-12">
          {/* Column 1: Brand & Philosophy - Spans 2 cols on mobile, 1 col on desktop */}
          <div className="col-span-2 md:col-span-1 flex flex-col space-y-2 sm:space-y-4">
            <div className="flex items-center justify-between sm:justify-start gap-3 flex-wrap">
              <Link href="/" className="inline-block group">
                <span className="font-serif text-[24px] sm:text-[30px] lg:text-[32px] font-medium text-[#38262e] tracking-tight group-hover:text-[#b73d67] transition-colors">
                  Pretty Corner
                </span>
                <p className="font-sans text-[9px] sm:text-[10px] font-bold tracking-[2px] text-[#7a6870] uppercase mt-0.5">
                  Beauty, Gadgets & Variety Edit
                </p>
              </Link>

              <div className="sm:pt-1">
                <span className="inline-flex items-center gap-1.5 bg-[#fceef2] text-[#b73d67] text-[10px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#f5d9e3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67]" />
                  100% Authentic Guaranteed
                </span>
              </div>
            </div>

            <p className="text-[12px] sm:text-[13px] text-[#7a6870] leading-relaxed max-w-sm">
              Curated authentic cosmetics, smart electrical gadgets, and lifestyle variety lovingly delivered in Myanmar.
            </p>
          </div>

          {/* Column 2: Customer Care */}
          <div className="col-span-1">
            <h4 className="font-serif text-[16px] sm:text-[18px] font-medium text-[#38262e] mb-2.5 sm:mb-4 tracking-tight">
              Customer Care
            </h4>
            <ul className="space-y-1.5 sm:space-y-2.5 text-[12px] sm:text-[13px] text-[#7a6870] leading-snug">
              <li>
                <Link href="/about" className="hover:text-[#b73d67] transition-colors inline-block">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#b73d67] transition-colors inline-block">
                  Frequently asked questions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-[#b73d67] transition-colors inline-block">
                  Shipping & Yangon Townships
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-[#b73d67] transition-colors inline-block">
                  Return & Refund policy
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-[#b73d67] transition-colors inline-block">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-[#b73d67] transition-colors inline-block">
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Payment & Delivery */}
          <div className="col-span-1">
            <h4 className="font-serif text-[16px] sm:text-[18px] font-medium text-[#38262e] mb-2.5 sm:mb-4 tracking-tight">
              Payment & Delivery
            </h4>
            <p className="text-[12px] sm:text-[13px] text-[#7a6870] leading-relaxed mb-2.5 sm:mb-3">
              Doorstep delivery in Yangon & digital payment:
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] font-medium text-[#38262e]">
              <span className="bg-white border border-[#eedfe5] px-2.5 py-1 rounded-[6px] shadow-2xs inline-block w-fit">
                Mobile Banking
              </span>
              <span className="bg-white border border-[#eedfe5] px-2.5 py-1 rounded-[6px] shadow-2xs inline-block w-fit">
                Cash on Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Copyright Bar */}
      <div className="border-t border-[#eedfe5] bg-white py-3.5 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:py-3.5 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-[12px] text-[#7a6870] text-center sm:text-left">
          <p>© {new Date().getFullYear()} Pretty Corner. All rights reserved.</p>
          <p className="text-[#a4929a]">
            Yangon, Myanmar
          </p>
        </div>
      </div>
    </footer>
  );
}
