'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ShippingPolicyPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-10 flex flex-col min-h-full pb-12">
      {/* 1. Mobile Header (hidden on desktop) */}
      <header className="md:hidden px-5 pt-4 pb-2 text-center border-b border-transparent">
        <h1 className="font-serif text-[29px] font-medium text-[#38262e]">
          Pretty Corner
        </h1>
      </header>

      {/* 2. Desktop Breadcrumb (md and up) */}
      <div className="hidden md:flex items-center gap-2 text-[13px] text-[#7a6870] mb-6">
        <Link href="/" className="hover:text-[#38262e]">Home</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">Shipping & Delivery Policy</span>
      </div>

      <div className="flex flex-col gap-5">
        <button
          onClick={() => router.back()}
          className="text-[12px] font-bold text-[#b73d67] hover:underline text-left cursor-pointer md:hidden"
        >
          ‹ Back
        </button>

        <div>
          <h1 className="font-serif text-[32px] sm:text-[40px] font-medium text-[#38262e] leading-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#7a6870] mt-1.5">
            Reliable, gentle doorstep delivery across Yangon and Myanmar.
          </p>
        </div>

        <div className="space-y-4 text-[14px] text-[#514149] leading-relaxed">
          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Yangon Delivery Rates</h3>
            <p className="mt-2 text-[#7a6870]">
              Standard inner Yangon delivery (Kamayut, Bahan, Sanchaung, Hledan) is 3,000 MMK. Outer townships range from 3,500 to 4,000 MMK. Free delivery applies for orders over 100,000 MMK.
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Regional & Highway Express</h3>
            <p className="mt-2 text-[#7a6870]">
              For deliveries outside Yangon (Mandalay, Naypyidaw, Taunggyi, Mawlamyine), parcels are dispatched via trusted highway gate express delivery (5,000 MMK flat rate).
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Delivery Windows</h3>
            <p className="mt-2 text-[#7a6870]">
              Orders placed before 2:00 PM are packaged the same day. Deliveries take place Monday through Saturday between 10:00 AM and 6:00 PM. Our couriers call in advance before arrival.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-[50px] px-8 bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all shadow-xs"
          >
            Continue shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
