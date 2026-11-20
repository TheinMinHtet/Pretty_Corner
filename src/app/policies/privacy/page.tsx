'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb - Consistent across mobile and desktop */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">Home</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">Privacy Policy</span>
      </div>

      <div className="flex flex-col gap-5">
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
          <h1 className="font-serif text-[32px] sm:text-[40px] font-medium text-[#38262e] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#7a6870] mt-1.5">
            How we protect and responsibly handle your delivery details.
          </p>
        </div>

        <div className="space-y-4 text-[14px] text-[#514149] leading-relaxed">
          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Guest Information Only</h3>
            <p className="mt-2 text-[#7a6870]">
              We only collect the minimum details necessary to complete your delivery: your recipient name, phone number, and physical doorstep address. No unwanted account creation required.
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">No Unsolicited Marketing</h3>
            <p className="mt-2 text-[#7a6870]">
              Your phone number is used exclusively for dispatch notifications, driver calls on arrival, and order tracking lookups. We never sell or share your data with third parties.
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Payment Data Safety</h3>
            <p className="mt-2 text-[#7a6870]">
              Payment transactions are secured through certified payment channels (Mobile Banking, Cash on Delivery). Pretty Corner never stores your banking credentials or PINs.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-[50px] px-8 bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all shadow-xs"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
