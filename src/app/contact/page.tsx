'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HelpAndContactPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb - Consistent across mobile and desktop */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">Home</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">Help & Contact</span>
      </div>

      {/* 3. Main Help Content - 2-Column on Tablet/Desktop */}
      <div className="md:grid md:grid-cols-12 md:gap-10 items-start">
        {/* Left Column: Direct Contact & Order Tracking (md:col-span-6 lg:col-span-7 space-y-6) */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-5">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#b73d67] hover:text-[#8e294d] bg-[#fceef2] hover:bg-[#fadce6] px-3.5 py-1.5 rounded-full transition-all w-fit cursor-pointer shadow-2xs group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <div>
            <h1 className="font-serif text-[30px] sm:text-[38px] font-medium text-[#38262e]">
              A little help, always.
            </h1>
          </div>

          {/* Track existing order CTA */}
          <Link
            href="/order-lookup"
            className="w-full h-[52px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] flex items-center justify-center hover:bg-[#a33259] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            Track an existing order
          </Link>

          {/* Order Help Banner */}
          <div className="bg-[#fceef2] rounded-xl p-5 sm:p-6 flex flex-col gap-2 border border-[#eedfe5]/50">
            <h3 className="font-serif text-[22px] sm:text-[24px] font-medium text-[#38262e]">
              Have your reference ready.
            </h3>
            <p className="text-[14px] text-[#7a6870] leading-relaxed">
              For order or payment questions, please include your order reference code (e.g. PC-261117-024). We never ask for banking passwords or OTP codes.
            </p>
          </div>

          {/* Contact Details Card */}
          <div className="bg-[#faf7f8] rounded-xl p-5 sm:p-6 border border-[#eedfe5]">
            <h3 className="font-serif text-[22px] sm:text-[24px] font-medium text-[#38262e] mb-2">
              Direct Contact
            </h3>
            <p className="text-[14px] text-[#7a6870] leading-relaxed mb-4">
              Our customer care team is available daily for skincare consultations, order updates, and delivery questions in Yangon.
            </p>
            <div className="space-y-3 text-[14px] text-[#38262e]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs">
                  📞
                </span>
                <div>
                  <p className="text-[11px] text-[#7a6870] uppercase font-bold">Hotline Phone</p>
                  <p className="font-semibold">09 765 432 100</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs">
                  💬
                </span>
                <div>
                  <p className="text-[11px] text-[#7a6870] uppercase font-bold">Viber & Telegram</p>
                  <p className="font-semibold">@prettycorner_mm</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs">
                  🕒
                </span>
                <div>
                  <p className="text-[11px] text-[#7a6870] uppercase font-bold">Operating Hours</p>
                  <p className="font-semibold">Monday – Sunday · 9:00 AM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Helpful Information Links Directory (md:col-span-6 lg:col-span-5) */}
        <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-3 mt-8 md:mt-0">
          <h2 className="font-serif text-[24px] sm:text-[28px] font-medium text-[#38262e] mb-1">
            Helpful information
          </h2>

          <Link
            href="/about"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>About us</span>
          </Link>

          <Link
            href="/faq"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>Frequently asked questions</span>
          </Link>

          <Link
            href="/policies/shipping"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>Shipping & Yangon Townships</span>
          </Link>

          <Link
            href="/policies/returns"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>Return & Refund policy</span>
          </Link>

          <Link
            href="/policies/privacy"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>Privacy policy</span>
          </Link>

          <Link
            href="/policies/terms"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>Terms and conditions</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
