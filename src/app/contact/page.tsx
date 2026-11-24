'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function HelpAndContactPage() {
  const router = useRouter();
  const { t, language } = useStore();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">{t.helpAndContact}</span>
      </div>

      {/* Main Help Content */}
      <div className="md:grid md:grid-cols-12 md:gap-10 items-start">
        {/* Left Column: Direct Contact & Order Tracking */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-5">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#b73d67] hover:text-[#8e294d] bg-[#fceef2] hover:bg-[#fadce6] px-3.5 py-1.5 rounded-full transition-all w-fit cursor-pointer shadow-2xs group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>{t.back}</span>
          </button>

          <div>
            <h1 className={`font-serif font-medium text-[#38262e] leading-snug ${
              language === 'my'
                ? 'text-[20px] min-[380px]:text-[24px] sm:text-[30px]'
                : 'text-[26px] sm:text-[38px]'
            }`}>
              {language === 'my' ? 'မည်သည့်အကူအညီမဆို မေးမြန်းနိုင်ပါသည်' : 'A little help, always.'}
            </h1>
          </div>

          {/* Find existing order receipt CTA */}
          <Link
            href="/order-lookup"
            className="w-full h-[48px] sm:h-[52px] bg-[#b73d67] text-white rounded-[12px] font-bold text-[14px] sm:text-[15px] flex items-center justify-center hover:bg-[#a33259] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            {t.searchOrder}
          </Link>

          {/* Order Help Banner */}
          <div className="bg-[#fceef2] rounded-[24px] sm:rounded-xl p-4 min-[380px]:p-5 sm:p-6 flex flex-col gap-2.5 sm:gap-3 border border-[#eedfe5]/60">
            <h3 className="font-serif text-[17px] min-[380px]:text-[19px] sm:text-[22px] font-medium leading-[1.48] text-[#38262e]">
              {language === 'my' ? 'အမှာစာ စုံစမ်းရန် အမှတ် (Order ID) ကို အသုံးပြုပါ' : 'Have your reference ready.'}
            </h3>
            <p className="text-[12.5px] min-[380px]:text-[13px] sm:text-[14px] text-[#7a6870] leading-[1.82] mt-1 sm:mt-1.5">
              {language === 'my'
                ? 'အမှာစာ သို့မဟုတ် ငွေပေးချေမှုဆိုင်ရာ မေးမြန်းလိုပါက အမှာစာအမှတ် (ဥပမာ - PC-261117-024) ကို ပြောပြပေးပါ။ ဘဏ်စကားဝှက် သို့မဟုတ် OTP နံပါတ်များကို Pretty Corner ဘက်မှ ဘယ်တော့မှ မတောင်းဆိုပါ။'
                : 'For order or payment questions, please include your order reference code (e.g. PC-261117-024). We never ask for banking passwords or OTP codes.'}
            </p>
          </div>

          {/* Contact Details Card */}
          <div className="bg-[#faf7f8] rounded-[24px] sm:rounded-xl p-4 min-[380px]:p-5 sm:p-6 border border-[#eedfe5]">
            <h3 className="font-serif text-[17px] min-[380px]:text-[19px] sm:text-[22px] font-medium leading-[1.48] text-[#38262e] mb-2 sm:mb-2.5">
              {language === 'my' ? 'တိုက်ရိုက်ဆက်သွယ်ရန်' : 'Direct Contact'}
            </h3>
            <p className="text-[12.5px] min-[380px]:text-[13px] sm:text-[14px] text-[#7a6870] leading-[1.82] mb-4 sm:mb-5">
              {language === 'my'
                ? 'ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုအဖွဲ့သည် အသားအရေဆွေးနွေးတိုင်ပင်ခြင်း၊ အမှာစာအခြေအနေနှင့် ပို့ဆောင်ရေးမေးခွန်းများအတွက် နေ့စဉ်အဆင်သင့်ရှိပါသည်။'
                : 'Our customer care team is available daily for skincare consultations, order updates, and delivery questions in Yangon.'}
            </p>
            <div className="space-y-3 text-[13px] sm:text-[14px] text-[#38262e]">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs border border-[#eedfe5]/60 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[10.5px] sm:text-[11px] text-[#7a6870] font-bold">{language === 'my' ? 'ဖုန်းဟော့လိုင်း' : 'Hotline Phone'}</p>
                  <p className="font-semibold text-[13px] sm:text-[14px]">09 765 432 100</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs border border-[#eedfe5]/60 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[10.5px] sm:text-[11px] text-[#7a6870] font-bold">Viber & Telegram</p>
                  <p className="font-semibold text-[13px] sm:text-[14px]">@prettycorner_mm</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs border border-[#eedfe5]/60 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <div>
                  <p className="text-[10.5px] sm:text-[11px] text-[#7a6870] font-bold">{language === 'my' ? 'ဝန်ဆောင်မှုပေးချိန်' : 'Operating Hours'}</p>
                  <p className="font-semibold text-[12.5px] sm:text-[13.5px]">{language === 'my' ? 'တနင်္လာ မှ တနင်္ဂနွေ · နံနက် ၉:၀၀ မှ ည ၈:၀၀ အထိ' : 'Monday – Sunday · 9:00 AM – 8:00 PM'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Helpful Information Links Directory */}
        <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-3 mt-6 md:mt-0">
          <h2 className="font-serif text-[18px] min-[380px]:text-[20px] sm:text-[24px] font-medium text-[#38262e] mb-1 leading-snug">
            {language === 'my' ? 'သိကောင်းစရာ အချက်အလက်များ' : 'Helpful information'}
          </h2>

          <Link
            href="/about"
            className="w-full h-[48px] sm:h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-4 sm:px-5 flex items-center justify-between text-[#38262e] font-bold text-[13px] sm:text-[14px] transition-colors"
          >
            <span>{t.aboutUs}</span>
            <span className="text-[#a89aa0]">→</span>
          </Link>

          <Link
            href="/faq"
            className="w-full h-[48px] sm:h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-4 sm:px-5 flex items-center justify-between text-[#38262e] font-bold text-[13px] sm:text-[14px] transition-colors"
          >
            <span>{t.faqs}</span>
            <span className="text-[#a89aa0]">→</span>
          </Link>

          <Link
            href="/policies/privacy"
            className="w-full h-[48px] sm:h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-4 sm:px-5 flex items-center justify-between text-[#38262e] font-bold text-[13px] sm:text-[14px] transition-colors"
          >
            <span>{t.privacyPolicy}</span>
            <span className="text-[#a89aa0]">→</span>
          </Link>

          <Link
            href="/policies/terms"
            className="w-full h-[48px] sm:h-[52px] bg-[#f9f5f7] hover:bg-[#fceef2] rounded-xl px-4 sm:px-5 flex items-center justify-between text-[#38262e] font-bold text-[13px] sm:text-[14px] transition-colors"
          >
            <span>{t.termsAndConditions}</span>
            <span className="text-[#a89aa0]">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
