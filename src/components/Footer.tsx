'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="hidden md:block bg-[#faf6f8] border-t border-[#eedfe5] mt-auto">
      {/* 1. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info (col-span-2) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block">
                <span className="font-serif text-[32px] font-medium text-[#38262e] tracking-tight">
                  Pretty Corner
                </span>
                <p className="font-sans text-[10px] font-bold tracking-[2px] text-[#7a6870] uppercase mt-1">
                  Your Everyday Beauty Edit
                </p>
              </Link>
              <p className="text-[14px] text-[#7a6870] leading-relaxed mt-4 max-w-sm">
                A corner for your kind of beautiful. Authentic skincare and everyday cosmetics, thoughtfully picked and lovingly delivered across Yangon and Myanmar.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-[#eedfe5]/70 flex items-center gap-3 text-[12px] text-[#7a6870]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>100% Authentic Guaranteed · Direct Delivery</span>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h4 className="font-serif text-[18px] font-medium text-[#38262e] mb-4">
              Shop Skincare
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#7a6870]">
              <li>
                <Link href="/shop?category=skincare" className="hover:text-[#b73d67] transition-colors">
                  All Skincare
                </Link>
              </li>
              <li>
                <Link href="/shop?category=skincare" className="hover:text-[#b73d67] transition-colors">
                  Hydrating Serums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=skincare" className="hover:text-[#b73d67] transition-colors">
                  Daily Moisturizers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=skincare" className="hover:text-[#b73d67] transition-colors">
                  SPF & Sun Protection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=makeup" className="hover:text-[#b73d67] transition-colors">
                  Everyday Makeup
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="font-serif text-[18px] font-medium text-[#38262e] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#7a6870]">
              <li>
                <Link href="/order-lookup" className="hover:text-[#b73d67] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#b73d67] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-[#b73d67] transition-colors">
                  Yangon Delivery Townships
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-[#b73d67] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#b73d67] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Payment & Trust */}
          <div>
            <h4 className="font-serif text-[18px] font-medium text-[#38262e] mb-4">
              Payment & Delivery
            </h4>
            <p className="text-[13px] text-[#7a6870] leading-relaxed mb-3">
              We accept local digital payments & cash on delivery in Yangon:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-[#38262e]">
              <span className="bg-white border border-[#eedfe5] px-2.5 py-1 rounded-[6px]">
                KBZPay
              </span>
              <span className="bg-white border border-[#eedfe5] px-2.5 py-1 rounded-[6px]">
                WavePay
              </span>
              <span className="bg-white border border-[#eedfe5] px-2.5 py-1 rounded-[6px]">
                Cash on Delivery
              </span>
              <span className="bg-white border border-[#eedfe5] px-2.5 py-1 rounded-[6px]">
                Mobile Banking
              </span>
            </div>
            <div className="mt-4 p-3 bg-[#fceef2] rounded-[8px] text-[12px] text-[#b73d67]">
              Same-day & next-day delivery available across Yangon.
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Copyright Bar */}
      <div className="border-t border-[#eedfe5] bg-white py-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#7a6870]">
          <p>© {new Date().getFullYear()} Pretty Corner. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/policies/privacy" className="hover:text-[#38262e] transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/policies/terms" className="hover:text-[#38262e] transition-colors">
              Terms of Service
            </Link>
            <span>·</span>
            <Link href="/policies/shipping" className="hover:text-[#38262e] transition-colors">
              Shipping Information
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
