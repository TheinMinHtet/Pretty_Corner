'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function AboutPage() {
  const router = useRouter();
  const { t, language } = useStore();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">{t.aboutUs}</span>
      </div>

      <div className="flex flex-col gap-6">
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
          <h1 className={`font-serif font-medium text-[#38262e] leading-tight ${
            language === 'my'
              ? 'text-[25px] sm:text-[32px]'
              : 'text-[32px] sm:text-[42px]'
          }`}>
            {language === 'my' ? 'သင့်အလှအပအတွက် စိတ်ချရဆုံး ထောင့်စွန်းလေး' : 'A corner for your kind of beautiful.'}
          </h1>
          <p className="font-sans text-[15px] sm:text-[16px] text-[#7a6870] mt-2">
            {language === 'my' ? 'စိတ်တိုင်းကျ ရွေးချယ်ထားပြီး စနစ်တကျ ထုပ်ပိုးထားသော စစ်မှန်သည့် အလှအပနှင့် အသုံးအဆောင်များ' : 'Thoughtfully picked. Lovingly packed. Authentic beauty, without the fuss.'}
          </p>
        </div>

        <div className="bg-[#fceef2] rounded-2xl p-6 sm:p-8 border border-[#eedfe5]/60">
          <h2 className="font-serif text-[24px] sm:text-[28px] font-medium text-[#38262e]">
            {language === 'my' ? 'Pretty Corner ၏ ရည်ရွယ်ချက်' : 'Our Story'}
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#7a6870] leading-relaxed mt-3">
            {language === 'my'
              ? 'Pretty Corner ကို နေ့စဉ် အသားအရေထိန်းသိမ်းမှုနှင့် အလှအပဆိုင်ရာ အသုံးအဆောင်များကို လူတိုင်းလွယ်ကူစိတ်ချစွာ ဝယ်ယူရရှိစေရန် ရည်ရွယ်ပြီး တည်ထောင်ခဲ့ခြင်းဖြစ်ပါသည်။ ကျွန်ုပ်တို့သည် မြန်မာနိုင်ငံ၏ ရာသီဥတုနှင့် သင့်လျော်ပြီး အရည်အသွေး ၁၀၀% စစ်မှန်သော အလှကုန်၊ မိတ်ကပ်နှင့် စမတ်အသုံးအဆောင်များကိုသာ တိုက်ရိုက်ရွေးချယ်တင်သွင်းပါသည်။'
              : 'Pretty Corner was founded on a simple belief: daily skincare and beauty routines shouldn’t be overwhelming or out of reach. We hand-select 100% authentic, high-efficacy formulas tailored specifically for tropical climates and everyday glow.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-xl border border-[#eedfe5]">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">
              {language === 'my' ? '၁၀၀% စစ်မှန်မှု အာမခံ' : 'Authenticity Guaranteed'}
            </h3>
            <p className="text-[13px] text-[#7a6870] mt-2 leading-relaxed">
              {language === 'my'
                ? 'ကျွန်ုပ်တို့ထံရှိ ပစ္စည်းအားလုံးသည် တရားဝင်ကိုယ်စားလှယ်ကြီးများထံမှ တိုက်ရိုက်ရယူထားသော စစ်မှန်သည့် ပစ္စည်းများသာ ဖြစ်ပါသည်။'
                : 'Every single product in our catalog is directly sourced from certified brand distributors and genuine laboratories. No counterfeits, ever.'}
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-xl border border-[#eedfe5]">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </span>
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">
              {language === 'my' ? 'သေသပ်လှပသော ထုပ်ပိုးမှု' : 'Care in Every Parcel'}
            </h3>
            <p className="text-[13px] text-[#7a6870] mt-2 leading-relaxed">
              {language === 'my'
                ? 'ပို့ဆောင်မှုတိုင်းတွင် ပစ္စည်းများထိခိုက်မှုမရှိစေရန် သေချာစွာ စစ်ဆေးထုပ်ပိုးပြီး ရန်ကုန်မြို့တွင်းနှင့် မြန်မာတစ်နိုင်ငံလုံးသို့ ပို့ဆောင်ပေးပါသည်။'
                : 'Each delivery is cushioned with biodegradable wrap and prepared with love in Yangon, ensuring your skincare arrives fresh and pristine.'}
            </p>
          </div>

          <div className="bg-[#faf7f8] p-5 sm:p-6 rounded-xl border border-[#eedfe5]">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#b73d67] shadow-xs mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </span>
            <h3 className="font-serif text-[20px] font-medium text-[#38262e]">
              {language === 'my' ? 'လွယ်ကူရှင်းလင်းသော စျေးဝယ်စနစ်' : 'Seamless Experience'}
            </h3>
            <p className="text-[13px] text-[#7a6870] mt-2 leading-relaxed">
              {language === 'my'
                ? 'အကောင့်ဖွင့်စရာမလို၊ လျှို့ဝှက်နံပါတ် မှတ်စရာမလိုဘဲ မိမိကြိုက်နှစ်သက်ရာ ပစ္စည်းရွေးချယ်ပြီး လိပ်စာဖြည့်သွင်းရုံဖြင့် အလွယ်တကူ မှာယူနိုင်ပါသည်။'
                : 'You don’t need an account or password to treat yourself. Just choose your favorite finds, enter your delivery address, and we’ll take care of the rest.'}
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-[50px] px-8 bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all shadow-xs cursor-pointer"
          >
            {language === 'my' ? 'ပစ္စည်းများ ကြည့်ရှုဝယ်ယူမည်' : 'Explore the skincare collection'}
          </Link>
        </div>
      </div>
    </div>
  );
}
