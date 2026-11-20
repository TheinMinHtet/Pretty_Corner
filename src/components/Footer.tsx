'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#fdfafb] border-t border-[#eedfe5] mt-auto">
      {/* 1. Main Footer Grid: Classic 3 columns (Left: Brand, Middle: Customer Care, Right: Payment & Delivery) */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Column 1: Brand & Philosophy */}
          <div className="col-span-2 md:col-span-1 flex flex-col space-y-2 sm:space-y-2.5">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-[26px] sm:text-[28px] lg:text-[30px] font-medium text-[#38262e] tracking-tight group-hover:text-[#b73d67] transition-colors">
                Pretty Corner
              </span>
              <p className="font-sans text-[9px] sm:text-[10px] font-bold tracking-[2px] text-[#7a6870] uppercase mt-0.5">
                Beauty, Gadgets & Variety Edit
              </p>
            </Link>

            <p className="text-[12px] sm:text-[13px] text-[#7a6870] leading-relaxed max-w-xs sm:max-w-[320px]">
              Curated authentic cosmetics, smart electrical gadgets, and lifestyle variety lovingly delivered across Myanmar.
            </p>
          </div>

          {/* Column 2: Customer Care (Single neat vertical list, shifted right on desktop for even spacing) */}
          <div className="col-span-1 md:pl-12 lg:pl-20">
            <h4 className="font-serif text-[16px] sm:text-[17px] font-medium text-[#38262e] mb-2.5 sm:mb-3.5 tracking-tight">
              Customer Care
            </h4>
            <ul className="space-y-2 text-[12.5px] sm:text-[13px] text-[#7a6870] leading-snug">
              <li>
                <Link href="/about" className="hover:text-[#b73d67] transition-colors inline-block">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#b73d67] transition-colors inline-block">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-[#b73d67] transition-colors inline-block">
                  Shipping & Townships
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-[#b73d67] transition-colors inline-block">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-[#b73d67] transition-colors inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-[#b73d67] transition-colors inline-block">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Payment & Delivery */}
          <div className="col-span-1">
            <h4 className="font-serif text-[16px] sm:text-[17px] font-medium text-[#38262e] mb-2.5 sm:mb-3.5 tracking-tight">
              Payment & Delivery
            </h4>
            <p className="text-[12px] sm:text-[13px] text-[#7a6870] leading-relaxed mb-3">
              Doorstep delivery in Yangon & digital payment:
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 text-[11.5px] sm:text-[12px] font-medium text-[#38262e]">
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
      <div className="border-t border-[#eedfe5] bg-white py-3.5 px-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-[12px] text-[#7a6870] text-center sm:text-left">
          <p>© {new Date().getFullYear()} Pretty Corner. All rights reserved.</p>
          <p className="text-[#a4929a]">
            Yangon, Myanmar
          </p>
        </div>
      </div>
    </footer>
  );
}
