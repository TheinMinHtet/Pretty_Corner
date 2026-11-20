'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Do I need an account to place an order?',
    a: 'No account needed! Pretty Corner offers a complete guest shopping experience. All you need is your name, phone number, and delivery address.',
  },
  {
    q: 'How long does delivery take in Yangon?',
    a: 'Orders placed in Yangon townships (Kamayut, Bahan, Sanchaung, etc.) are typically delivered within 24 to 48 hours.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Mobile Banking and Cash on Delivery. All payments are verified securely.',
  },
  {
    q: 'How can I check my order receipt without logging in?',
    a: 'Visit our "Order Receipt" page anytime with your Order ID (e.g. PC-261117-024). No login or account is required.',
  },
  {
    q: 'Are all products authentic?',
    a: 'Yes, 100% authentic. We partner directly with authorized distributors and manufacturers. Every product has batch codes verified before shipment.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer an immediate replacement or full refund for damaged, defective, or incorrect items reported within 48 hours of doorstep delivery.',
  },
];

export default function FaqPage() {
  const router = useRouter();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb - Consistent across mobile and desktop */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">Home</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">Frequently Asked Questions</span>
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
            Frequently Asked Questions
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#7a6870] mt-1.5">
            Quick answers about guest shopping, Yangon township delivery, and payment verification.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#eedfe5] mt-4 bg-white rounded-2xl border border-[#eedfe5] px-6 py-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center text-left gap-4 cursor-pointer"
                >
                  <span className="text-[15px] sm:text-[16px] font-bold text-[#38262e]">
                    {faq.q}
                  </span>
                  <span className="text-[20px] text-[#b73d67] font-semibold shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="text-[14px] text-[#7a6870] leading-relaxed mt-2.5 pr-4 animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#fceef2] rounded-2xl p-6 text-center mt-4 border border-[#eedfe5]/50">
          <p className="font-serif text-[22px] text-[#38262e]">Still have questions?</p>
          <p className="text-[13px] text-[#7a6870] mt-1">Our customer care team is available daily 9:00 AM – 8:00 PM.</p>
          <Link
            href="/contact"
            className="inline-block mt-3 px-6 py-2.5 bg-[#b73d67] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#a33259] transition-colors"
          >
            Chat with Pretty Corner
          </Link>
        </div>
      </div>
    </div>
  );
}
