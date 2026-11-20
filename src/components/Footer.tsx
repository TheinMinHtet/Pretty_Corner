'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#fdfafb] border-t border-[#eedfe5] mt-auto">
      {/* 1. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 lg:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Brand & Philosophy */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-[30px] lg:text-[32px] font-medium text-[#38262e] tracking-tight group-hover:text-[#b73d67] transition-colors">
                Pretty Corner
              </span>
              <p className="font-sans text-[10px] font-bold tracking-[2px] text-[#7a6870] uppercase mt-0.5">
                Beauty, Gadgets & Variety Edit
              </p>
            </Link>

            <p className="text-[13px] text-[#7a6870] leading-relaxed max-w-sm">
              A corner for all your everyday favorites. Curated authentic cosmetics, smart electrical gadgets, and lifestyle variety lovingly delivered in Myanmar.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-[#fceef2] text-[#b73d67] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#f5d9e3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67]" />
                100% Authentic Guaranteed
              </span>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="font-serif text-[18px] font-medium text-[#38262e] mb-4 tracking-tight">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#7a6870]">
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
          <div>
            <h4 className="font-serif text-[18px] font-medium text-[#38262e] mb-4 tracking-tight">
              Payment & Delivery
            </h4>
            <p className="text-[13px] text-[#7a6870] leading-relaxed mb-3">
              Flexible digital payments and doorstep delivery across Yangon:
            </p>
            <div className="flex flex-wrap gap-2 text-[12px] font-medium text-[#38262e]">
              <span className="bg-white border border-[#eedfe5] px-3 py-1.5 rounded-[6px] shadow-2xs">
                Mobile Banking
              </span>
              <span className="bg-white border border-[#eedfe5] px-3 py-1.5 rounded-[6px] shadow-2xs">
                Cash on Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Copyright Bar */}
      <div className="border-t border-[#eedfe5] bg-white pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#7a6870]">
          <p>© {new Date().getFullYear()} Pretty Corner. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px]">
            <Link href="/policies/privacy" className="hover:text-[#38262e] transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/policies/terms" className="hover:text-[#38262e] transition-colors">
              Terms of Service
            </Link>
            <span>·</span>
            <Link href="/policies/shipping" className="hover:text-[#38262e] transition-colors">
              Shipping & Delivery
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
