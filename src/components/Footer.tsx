'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer({ hasBottomNav = false }: { hasBottomNav?: boolean }) {
  return (
    <footer className="w-full bg-[#fdfafb] border-t border-[#eedfe5] mt-auto">
      {/* 1. Main Footer Grid: Classic 3 columns (Left: Brand, Middle: Customer Care, Right: Payment & Delivery) */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 sm:pt-7 lg:pt-9 pb-4 sm:pb-7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 lg:gap-12 items-start">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left mb-1 sm:mb-0">
            <Link href="/" className="inline-block group text-center md:text-left">
              <span className="font-serif text-[24px] sm:text-[28px] lg:text-[30px] font-medium text-[#38262e] tracking-tight group-hover:text-[#b73d67] transition-colors">
                Pretty Corner
              </span>
            </Link>
          </div>

          {/* Column 2: Customer Care */}
          <div className="col-span-1 md:pl-12 lg:pl-20">
            <h4 className="font-serif text-[15px] sm:text-[17px] font-semibold text-[#38262e] mb-2 sm:mb-3 tracking-tight">
              Customer Care
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-[12px] sm:text-[13px] text-[#7a6870] leading-snug">
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
            <h4 className="font-serif text-[15px] sm:text-[17px] font-semibold text-[#38262e] mb-2 sm:mb-3 tracking-tight">
              Payment & Delivery
            </h4>
            <p className="text-[12px] sm:text-[13px] text-[#7a6870] leading-relaxed mb-2.5">
              Doorstep delivery &amp; digital payment:
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

      {/* 2. Bottom Copyright Bar - Clears bottom navigation on mobile */}
      <div className={`border-t border-[#eedfe5] bg-white pt-3 px-5 sm:px-6 lg:px-8 ${hasBottomNav ? 'pb-[72px] md:pb-3' : 'pb-3'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 text-[11px] sm:text-[12px] text-[#7a6870] text-center sm:text-left">
          <p>© {new Date().getFullYear()} Pretty Corner. All rights reserved.</p>
          <p className="text-[#a4929a]">
            Yangon, Myanmar
          </p>
        </div>
      </div>
    </footer>
  );
}
