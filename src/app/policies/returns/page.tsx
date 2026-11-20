'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReturnsPolicyPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb - Consistent across mobile and desktop */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">Home</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">Return & Refund Policy</span>
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
            Return & Refund Policy
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#7a6870] mt-1.5">
            Our commitment to your satisfaction and complete skincare safety.
          </p>
        </div>

        <div className="space-y-4 text-[14px] text-[#514149] leading-relaxed">
          <div className="bg-[#fceef2] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]/60">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">7-Day Damaged or Defective Return</h3>
            <p className="mt-2 text-[#7a6870]">
              If your product arrives damaged, leaking, or defective, contact us within 7 days of delivery with your order reference and a photo. We will immediately dispatch a fresh replacement or issue a full refund.
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Hygiene & Sealed Conditions</h3>
            <p className="mt-2 text-[#7a6870]">
              Due to personal care and cosmetic hygiene standards, opened or used bottles, jars, and contact lens vials cannot be returned unless confirmed defective.
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">Refund Timeline</h3>
            <p className="mt-2 text-[#7a6870]">
              Approved refunds are processed back to your original payment channel (Mobile Banking or bank account) within 24 to 48 hours.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-[50px] px-8 bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all shadow-xs"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
