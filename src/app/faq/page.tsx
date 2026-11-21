'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqPage() {
  const router = useRouter();
  const { t, language } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const FAQS_EN: FaqItem[] = [
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

  const FAQS_MY: FaqItem[] = [
    {
      q: 'အမှာစာတင်ရန် အကောင့်ဖွင့်ထားဖို့ လိုပါသလား။',
      a: 'အကောင့်ဖွင့်စရာမလိုပါ! Pretty Corner တွင် အကောင့်မရှိဘဲ လွတ်လပ်စွာ စျေးဝယ်နိုင်ပါသည်။ လက်ခံသူအမည်၊ ဖုန်းနံပါတ်နှင့် ပို့ဆောင်ရမည့် လိပ်စာသာ လိုအပ်ပါသည်။',
    },
    {
      q: 'ရန်ကုန်မြို့တွင်း ပို့ဆောင်ချိန် ဘယ်လောက်ကြာပါသလဲ။',
      a: 'ရန်ကုန်မြို့နယ်များ (ကမာရွတ်၊ ဗဟန်း၊ စမ်းချောင်း အစရှိသည်) အတွက် မှာယူပြီး ၂၄ နာရီမှ ၄၈ နာရီအတွင်း အိမ်ရောက်ပို့ဆောင်ပေးပါသည်။',
    },
    {
      q: 'ဘယ်လိုငွေပေးချေမှုစနစ်တွေကို လက်ခံပါသလဲ။',
      a: 'KBZPay, WavePay စသည့် မိုဘိုင်းဘဏ်များဖြင့် ငွေလွှဲပေးချေမှုနှင့် အိမ်ရောက်မှငွေချေစနစ် (Cash on Delivery) နှစ်မျိုးလုံး ရရှိနိုင်ပါသည်။',
    },
    {
      q: 'အကောင့်မရှိဘဲ အမှာစာပြေစာကို ဘယ်လိုပြန်ကြည့်နိုင်မလဲ။',
      a: 'အမှာစာတင်ချိန်တွင် ရရှိထားသော အမှာစာအမှတ် (Order ID ဥပမာ - PC-261117-024) ဖြင့် ကျွန်ုပ်တို့၏ "ပြေစာကြည့်ရန်" စာမျက်နှာတွင် အချိန်မရွေး ပြန်လည်ကြည့်ရှုနိုင်ပါသည်။',
    },
    {
      q: 'ပစ္စည်းအားလုံး စစ်မှန်မှုရှိပါသလား။',
      a: '၁၀၀% စစ်မှန်ပါသည်။ တရားဝင်တင်သွင်းသော ကိုယ်စားလှယ်ကြီးများထံမှသာ တိုက်ရိုက်ရယူထားပြီး ပစ္စည်းအားလုံးကို စနစ်တကျ စစ်ဆေးထားပါသည်။',
    },
    {
      q: 'ပစ္စည်းချို့ယွင်းပျက်စီးပါက ဘယ်လိုလဲလှယ်ပေးပါသလဲ။',
      a: 'ပစ္စည်းရောက်ရှိပြီး ၄၈ နာရီအတွင်း ချို့ယွင်းပျက်စီးမှု သို့မဟုတ် မှားယွင်းမှုရှိပါက ချက်ချင်း အသစ်လဲလှယ်ပေးခြင်း သို့မဟုတ် ငွေအပြည့်အဝ ပြန်လည်အမ်းပေးခြင်း ဆောင်ရွက်ပေးပါသည်။',
    },
  ];

  const faqs = language === 'my' ? FAQS_MY : FAQS_EN;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10 flex flex-col min-h-full pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium">{t.faqs}</span>
      </div>

      <div className="flex flex-col gap-5">
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
              ? 'text-[25px] sm:text-[31px]'
              : 'text-[32px] sm:text-[40px]'
          }`}>
            {t.faqs}
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#7a6870] mt-1.5">
            {language === 'my'
              ? 'လွယ်ကူရှင်းလင်းစွာ စျေးဝယ်ယူမှု၊ ရန်ကုန်မြို့တွင်း ပို့ဆောင်ရေးနှင့် ငွေပေးချေမှုဆိုင်ရာ သိကောင်းစရာများ'
              : 'Quick answers about guest shopping, Yangon township delivery, and payment verification.'}
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#eedfe5] mt-4 bg-white rounded-2xl border border-[#eedfe5] px-6 py-2">
          {faqs.map((faq, idx) => {
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
          <p className="font-serif text-[22px] text-[#38262e]">
            {language === 'my' ? 'သိရှိလိုသည်များ ကျန်ရှိပါသေးသလား။' : 'Still have questions?'}
          </p>
          <p className="text-[13px] text-[#7a6870] mt-1">
            {language === 'my' ? 'ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုအဖွဲ့သည် နေ့စဉ် နံနက် ၉:၀၀ မှ ည ၈:၀၀ အထိ အဆင်သင့်ရှိပါသည်။' : 'Our customer care team is available daily 9:00 AM – 8:00 PM.'}
          </p>
          <Link
            href="/contact"
            className="inline-block mt-3 px-6 py-2.5 bg-[#b73d67] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#a33259] transition-colors"
          >
            {language === 'my' ? 'Pretty Corner နှင့် ဆက်သွယ်ပြောဆိုမည်' : 'Chat with Pretty Corner'}
          </Link>
        </div>
      </div>
    </div>
  );
}
