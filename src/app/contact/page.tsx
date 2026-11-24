'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function HelpAndContactPage() {
  const router = useRouter();
  const { t, language } = useStore();

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">{t.helpAndContact}</span>
      </div>

      {/* Main Help Content */}
      <div className="md:grid md:grid-cols-12 md:gap-10 items-start">
        {/* Left Column: Direct Contact & Order Tracking */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-4 sm:gap-5">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] font-semibold text-[#b73d67] hover:text-[#8e294d] bg-[#fceef2] hover:bg-[#fadce6] px-3.5 py-1.5 rounded-full transition-all w-fit cursor-pointer shadow-2xs group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>{t.back}</span>
          </button>

          <div>
            <h1 className="font-serif font-medium text-[#38262e] text-[24px] min-[380px]:text-[28px] sm:text-[36px] leading-[1.25]">
              {language === 'my' ? 'အမြဲတမ်း အဆင်သင့်ရှိသော အကူအညီ' : 'A little help, always.'}
            </h1>
          </div>

          {/* Order Help Banner */}
          <div className="bg-[#fceef2] rounded-xl p-4 sm:p-6 flex flex-col gap-3 border border-[#eedfe5]/50">
            <h3 className="font-serif text-[19px] min-[380px]:text-[22px] sm:text-[24px] font-medium text-[#38262e] leading-snug">
              {language === 'my' ? 'အမှာစာအမှတ် (Order ID) အဆင်သင့်ထားရှိပါ' : 'Have your reference ready.'}
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#7a6870] leading-relaxed">
              {language === 'my'
                ? 'အမှာစာ သို့မဟုတ် ငွေပေးချေမှုဆိုင်ရာ မေးမြန်းစုံစမ်းလိုပါက အမှာစာအမှတ် (ဥပမာ - PC-261117-024) ကို ပြောပြပေးပါ။'
                : 'For order or payment questions, please include your order reference code (e.g. PC-261117-024).'}
            </p>

            {/* Security Warning Notice */}
            <div className="flex items-start sm:items-center gap-2.5 bg-white/90 border border-[#eedfe5] text-[#b73d67] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-[10px] text-[12px] sm:text-[13px] font-semibold shadow-xs">
              <svg className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>
                {language === 'my'
                  ? 'ဘဏ်စကားဝှက် သို့မဟုတ် OTP နံပါတ်များကို ကျွန်ုပ်တို့ဘက်မှ ဘယ်တော့မှ မတောင်းဆိုပါ။'
                  : 'We never ask for banking passwords or OTP codes.'}
              </span>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-[#faf7f8] rounded-xl p-4 sm:p-6 border border-[#eedfe5]">
            <h3 className="font-serif text-[19px] min-[380px]:text-[22px] sm:text-[24px] font-medium text-[#38262e] mb-2 leading-snug">
              {language === 'my' ? 'တိုက်ရိုက်ဆက်သွယ်ရန်' : 'Direct Contact'}
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#7a6870] leading-relaxed mb-4">
              {language === 'my'
                ? 'ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုအဖွဲ့သည် အသားအရေဆွေးနွေးတိုင်ပင်ခြင်း၊ အမှာစာအခြေအနေနှင့် ပို့ဆောင်ရေးမေးခွန်းများအတွက် နေ့စဉ်အဆင်သင့်ရှိပါသည်။'
                : 'Our customer care team is available daily for skincare consultations, order updates, and delivery questions in Yangon.'}
            </p>
            <div className="space-y-3 text-[13px] sm:text-[14px] text-[#38262e]">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs shrink-0 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[10.5px] sm:text-[11px] text-[#7a6870] uppercase font-bold">{language === 'my' ? 'ဖုန်းဟော့လိုင်း' : 'Hotline Phone'}</p>
                  <p className="font-semibold">09 765 432 100</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs shrink-0 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[10.5px] sm:text-[11px] text-[#7a6870] uppercase font-bold">Viber & Telegram</p>
                  <p className="font-semibold">@prettycorner_mm</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs shrink-0 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[10.5px] sm:text-[11px] text-[#7a6870] uppercase font-bold">{language === 'my' ? 'ဝန်ဆောင်မှုပေးချိန်' : 'Operating Hours'}</p>
                  <p className="font-semibold text-[12px] min-[360px]:text-[13px] sm:text-[14px] leading-snug break-words">
                    {language === 'my' ? 'တနင်္လာ မှ တနင်္ဂနွေ · နံနက် ၉:၀၀ မှ ည ၈:၀၀ အထိ' : 'Monday – Sunday · 9:00 AM – 8:00 PM'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Helpful Information Links Directory */}
        <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-3 mt-8 md:mt-0">
          <h2 className="font-serif text-[24px] sm:text-[28px] font-medium text-[#38262e] mb-1">
            {language === 'my' ? 'သိကောင်းစရာ အချက်အလက်များ' : 'Helpful information'}
          </h2>

          <Link
            href="/about"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>{t.aboutUs}</span>
          </Link>

          <Link
            href="/faq"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>{t.faqs}</span>
          </Link>

          <Link
            href="/policies/privacy"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>{t.privacyPolicy}</span>
          </Link>

          <Link
            href="/policies/terms"
            className="w-full h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-5 flex items-center justify-between text-[#38262e] font-bold text-[14px] transition-colors"
          >
            <span>{t.termsAndConditions}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
