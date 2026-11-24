'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function Footer({ hasBottomNav = false }: { hasBottomNav?: boolean }) {
  const { t, socialLinks } = useStore();
  const facebookUrl = socialLinks?.facebook || 'https://facebook.com/prettycornermm';
  const tiktokUrl = socialLinks?.tiktok || 'https://www.tiktok.com/@prettycorner';

  return (
    <footer className="w-full bg-[#fdfafb] border-t border-[#eedfe5] mt-auto">
      {/* 1. Main Footer Grid: Balanced layout with Customer Care & Payment side-by-side and centered on mobile */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9 pb-6 sm:pb-8">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Column 1: Brand & Follow Us (Full-width on mobile, 1 col on desktop) */}
          <div className="w-full md:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-[24px] sm:text-[28px] lg:text-[30px] font-medium text-[#38262e] tracking-tight group-hover:text-[#b73d67] transition-colors">
                {t.brandName}
              </span>
            </Link>
            <p className="text-[12px] sm:text-[13px] text-[#7a6870] mt-2 leading-relaxed max-w-xs sm:max-w-none">
              {t.footerDescription}
            </p>
            <div className="flex items-center gap-2.5 text-[12px] font-medium text-[#38262e] mt-3.5 sm:mt-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#eedfe5] hover:border-[#1877f2] hover:text-[#1877f2] px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer group text-[11.5px] sm:text-[12px]"
                title="Follow us on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-[#1877f2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#eedfe5] hover:border-[#000000] hover:text-[#000000] px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer group text-[11.5px] sm:text-[12px]"
                title="Follow us on TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-[#000000]" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.49 2.72 1.34-.04 2.58-.88 3.08-2.12.33-.74.43-1.57.43-2.38V.02h-.08z" />
                </svg>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Columns 2 & 3: Grouped together in a centered, balanced container on mobile */}
          <div className="w-full md:col-span-2 grid grid-cols-2 gap-4 sm:gap-8 lg:gap-12 max-w-[320px] min-[360px]:max-w-[340px] sm:max-w-none mx-auto sm:mx-0 pt-1 sm:pt-0">
            {/* Column 2: Customer Care (Indented with left padding on mobile for optical symmetry) */}
            <div className="flex flex-col items-start text-left pl-5 min-[360px]:pl-7 min-[400px]:pl-9 sm:pl-0">
              <h4 className="font-serif text-[14.5px] sm:text-[17px] font-semibold text-[#38262e] mb-2 sm:mb-3 tracking-tight">
                {t.customerCare}
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[12px] sm:text-[13px] text-[#7a6870] leading-snug">
                <li>
                  <Link href="/about" className="hover:text-[#b73d67] transition-colors inline-block py-0.5">
                    {t.aboutUs}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#b73d67] transition-colors inline-block py-0.5">
                    {t.faqs}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#b73d67] transition-colors inline-block py-0.5">
                    {t.navContact}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Payment & Delivery */}
            <div className="flex flex-col items-start text-left">
              <h4 className="font-serif text-[14.5px] sm:text-[17px] font-semibold text-[#38262e] mb-2 sm:mb-3 tracking-tight">
                {t.paymentAndDelivery}
              </h4>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-1.5 sm:gap-2 text-[10.5px] sm:text-[12px] font-medium text-[#38262e] max-w-full">
                <span className="bg-white border border-[#eedfe5] px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-2xs inline-flex items-center gap-1.5 truncate max-w-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] shrink-0" />
                  <span className="truncate">{t.mobileBanking}</span>
                </span>
                <span className="bg-white border border-[#eedfe5] px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-2xs inline-flex items-center gap-1.5 truncate max-w-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b775d] shrink-0" />
                  <span className="truncate">{t.cod}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Copyright Bar - Clears bottom navigation on mobile */}
      <div className={`border-t border-[#eedfe5] bg-white py-3.5 px-5 sm:px-6 lg:px-8 ${hasBottomNav ? 'pb-[92px] md:pb-3.5' : 'pb-3.5'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[11.5px] sm:text-[12px] text-[#7a6870] text-center sm:text-left">
          <p>© {new Date().getFullYear()} Pretty Corner. {t.allRightsReserved}</p>
          <p className="text-[#a4929a]">
            {t.yangonMyanmar}
          </p>
        </div>
      </div>
    </footer>
  );
}
