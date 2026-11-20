'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb - Consistent across mobile and desktop */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">Home</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">About Us</span>
      </div>

      <div className="flex flex-col gap-6">
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
          <h1 className="font-serif text-[32px] sm:text-[42px] font-medium text-[#38262e] leading-tight">
            A corner for your kind of beautiful.
          </h1>
          <p className="font-sans text-[15px] sm:text-[16px] text-[#7a6870] mt-2">
            Thoughtfully picked. Lovingly packed. Authentic beauty, without the fuss.
          </p>
        </div>

        <div className="bg-[#fceef2] rounded-2xl p-6 sm:p-8 border border-[#eedfe5]/60">
          <h2 className="font-serif text-[24px] sm:text-[28px] font-medium text-[#38262e]">
            Our Story
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#7a6870] leading-relaxed mt-3">
            Pretty Corner was founded on a simple belief: daily skincare and beauty routines shouldn’t be overwhelming or out of reach. We hand-select 100% authentic, high-efficacy formulas tailored specifically for tropical climates and everyday glow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-xl border border-[#eedfe5]">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-xs mb-3">
              ✨
            </span>
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Authenticity Guaranteed</h3>
            <p className="text-[13px] text-[#7a6870] mt-2 leading-relaxed">
              Every single product in our catalog is directly sourced from certified brand distributors and genuine laboratories. No counterfeits, ever.
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-xl border border-[#eedfe5]">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-xs mb-3">
              📦
            </span>
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Care in Every Parcel</h3>
            <p className="text-[13px] text-[#7a6870] mt-2 leading-relaxed">
              Each delivery is cushioned with biodegradable wrap and prepared with love in Yangon, ensuring your skincare arrives fresh and pristine.
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-xl border border-[#eedfe5]">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-xs mb-3">
              🛍️
            </span>
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Seamless Experience</h3>
            <p className="text-[13px] text-[#7a6870] mt-2 leading-relaxed">
              You don’t need an account or password to treat yourself. Just choose your favorite finds, enter your delivery address, and we’ll take care of the rest.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-[50px] px-8 bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all shadow-xs cursor-pointer"
          >
            Explore the skincare collection
          </Link>
        </div>
      </div>
    </div>
  );
}
