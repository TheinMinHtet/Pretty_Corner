'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

interface OrderingStepBarProps {
  currentStep: 1 | 2 | 3;
  isCOD?: boolean;
  orderId?: string;
}

export default function OrderingStepBar({ currentStep, isCOD = false, orderId }: OrderingStepBarProps) {
  const { t, language } = useStore();

  const deliveryShortLabel = language === 'my' ? 'ပို့ဆောင်' : t.stepDelivery;
  const paymentShortLabel = language === 'my' ? 'ငွေချေ' : t.stepPayment;
  const confirmMobileLabel = language === 'my' ? 'အတည်ပြု' : 'Confirm';
  const confirmFullLabel = t.stepConfirmation;

  const THREE_STEPS = [
    {
      step: 1,
      label: t.stepDelivery,
      shortLabel: deliveryShortLabel,
      getHref: () => '/checkout',
    },
    {
      step: 2,
      label: t.stepPayment,
      shortLabel: paymentShortLabel,
      getHref: () => (orderId ? `/payment-pending?orderId=${encodeURIComponent(orderId)}` : '/checkout'),
    },
    {
      step: 3,
      label: confirmFullLabel,
      shortLabel: confirmMobileLabel,
      getHref: () => (orderId ? `/order-confirmation?orderId=${encodeURIComponent(orderId)}` : '#'),
    },
  ];

  const TWO_STEPS = [
    {
      step: 1,
      label: t.stepDelivery,
      shortLabel: deliveryShortLabel,
      getHref: () => '/checkout',
    },
    {
      step: 2,
      label: confirmFullLabel,
      shortLabel: confirmMobileLabel,
      getHref: () => (orderId ? `/order-confirmation?orderId=${encodeURIComponent(orderId)}` : '#'),
    },
  ];

  const steps = isCOD ? TWO_STEPS : THREE_STEPS;
  const activeStep = isCOD && currentStep >= 2 ? 2 : currentStep;

  // Track progress calculation
  const progressWidth = isCOD
    ? activeStep === 1
      ? '0%'
      : '100%'
    : activeStep === 1
    ? '0%'
    : activeStep === 2
    ? '50%'
    : '100%';

  return (
    <div className="w-full py-1">
      {/* Unified Responsive Step Bar */}
      <div
        className={`relative flex items-center justify-between mx-auto px-0.5 sm:px-2 ${
          isCOD
            ? 'w-full max-w-[260px] sm:max-w-none sm:w-[300px]'
            : 'w-full max-w-[340px] sm:max-w-none sm:w-[390px] md:w-[410px]'
        }`}
      >
        {/* Track Line behind steps */}
        <div className="absolute left-3 right-3 sm:left-6 sm:right-6 top-1/2 -translate-y-1/2 h-[2px] bg-[#eedfe5] z-0">
          <div
            className="h-full bg-[#b73d67] transition-all duration-300"
            style={{
              width: progressWidth,
            }}
          />
        </div>

        {steps.map((s) => {
          const isCompleted = s.step < activeStep;
          const isCurrent = s.step === activeStep;
          const pillClasses = `flex items-center gap-0.5 min-[360px]:gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[9px] min-[360px]:text-[10px] sm:text-[11.5px] transition-all select-none whitespace-nowrap ${
            isCurrent
              ? 'bg-[#b73d67] text-white font-bold shadow-xs ring-1 sm:ring-2 ring-[#b73d67]/20 z-10'
              : isCompleted
              ? 'bg-[#fceef2] text-[#b73d67] font-semibold border border-[#eedfe5] hover:bg-[#f8dde5] cursor-pointer'
              : 'bg-white text-[#7a6870] font-medium border border-[#eedfe5]'
          }`;

          const content = (
            <>
              {isCompleted ? (
                <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#b73d67] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="text-[8.5px] min-[360px]:text-[9.5px] sm:text-[11px] opacity-80 shrink-0">{s.step}.</span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.shortLabel}</span>
            </>
          );

          return (
            <div key={s.step} className="relative z-10 flex flex-col items-center shrink-0">
              {isCompleted ? (
                <Link href={s.getHref()} className={pillClasses} title={`Go back to ${s.label}`}>
                  {content}
                </Link>
              ) : (
                <div className={pillClasses}>
                  {content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
