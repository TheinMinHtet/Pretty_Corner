'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer({ hasBottomNav = false }: { hasBottomNav?: boolean }) {
  return (
    <footer className="w-full bg-[#fdfafb] border-t border-[#eedfe5] mt-auto">
      {/* 1. Main Footer Grid: Classic 3 columns (Left: Brand, Middle: Customer Care, Right: Payment & Delivery) */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 sm:pt-7 lg:pt-9 pb-4 sm:pb-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 items-start">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left self-center md:self-start py-2 md:py-0">
            <Link href="/" className="inline-block group text-center md:text-left">
              <span className="font-serif text-[24px] sm:text-[28px] lg:text-[30px] font-medium text-[#38262e] tracking-tight group-hover:text-[#b73d67] transition-colors">
                Pretty Corner
              </span>
            </Link>
            <p className="text-[12px] sm:text-[13px] text-[#7a6870] mt-1.5 leading-relaxed">
              Your little corner of beauty and inspiration.
            </p>
          </div>

          {/* Column 2: Customer Care */}
          <div className="col-span-1">
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

          {/* Column 4: Follow Us */}
          <div className="col-span-2 md:col-span-1 pt-3 md:pt-0 border-t md:border-t-0 border-[#eedfe5]/60 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-serif text-[15px] sm:text-[17px] font-semibold text-[#38262e] mb-1.5 sm:mb-2 tracking-tight">
              Follow Us
            </h4>
            <p className="text-[12px] sm:text-[13px] text-[#7a6870] leading-relaxed mb-2.5 max-w-xs">
              Follow our socials for the latest updates:
            </p>
            <div className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-medium text-[#38262e]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#eedfe5] hover:border-[#1877f2] hover:text-[#1877f2] px-2.5 py-1 rounded-[6px] shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer group"
                title="Follow us on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-[#1877f2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#eedfe5] hover:border-[#000000] hover:text-[#000000] px-2.5 py-1 rounded-[6px] shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer group"
                title="Follow us on TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-[#000000]" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.49 2.72 1.34-.04 2.58-.88 3.08-2.12.33-.74.43-1.57.43-2.38V.02h-.08z" />
                </svg>
                <span>TikTok</span>
              </a>
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
