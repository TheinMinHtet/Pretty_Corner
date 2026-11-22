'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function NotFound() {
  const { t, language } = useStore();

  const isBurmese = language === 'my';

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-lg bg-[#faf7f8] border border-[#eedfe5] rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 text-center shadow-xs flex flex-col items-center">
        {/* Soft Badge */}
        <span className="inline-block text-[11px] sm:text-[12px] font-bold tracking-[2px] text-[#b73d67] uppercase bg-white/80 px-3.5 py-1 rounded-full border border-[#f1d3df] shadow-2xs mb-4">
          404 · Error
        </span>

        {/* Serif Heading */}
        <h1
          className={`font-serif font-medium text-[#38262e] tracking-tight ${
            isBurmese
              ? 'text-[28px] sm:text-[34px]'
              : 'text-[36px] sm:text-[44px]'
          }`}
        >
          {isBurmese ? 'စာမျက်နှာ ရှာမတွေ့ပါ' : 'Page Not Found'}
        </h1>

        <p className="text-[14px] sm:text-[15px] text-[#7a6870] mt-3 max-w-sm leading-relaxed">
          {isBurmese
            ? 'သင်ရှာဖွေနေသော စာမျက်နှာသည် ရွှေ့ပြောင်းသွားခြင်း သို့မဟုတ် မရှိတော့ခြင်း ဖြစ်နိုင်ပါသည်။'
            : 'The page you are looking for might have been moved, renamed, or is temporarily unavailable.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-8">
          <Link
            href="/shop"
            className="w-full sm:w-auto h-[48px] px-7 bg-[#b73d67] hover:bg-[#a33259] text-white rounded-[12px] font-bold text-[14px] flex items-center justify-center transition-all shadow-xs active:scale-[0.98]"
          >
            {isBurmese ? 'ပစ္စည်းများ ကြည့်ရှုမည်' : 'Explore Shop'}
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto h-[48px] px-6 bg-white hover:bg-[#f6eff2] text-[#38262e] border border-[#eedfe5] rounded-[12px] font-bold text-[14px] flex items-center justify-center transition-all shadow-2xs active:scale-[0.98]"
          >
            {t.navHome || (isBurmese ? 'ပင်မစာမျက်နှာ' : 'Home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
