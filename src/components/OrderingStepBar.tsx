'use client';

import React from 'react';

interface OrderingStepBarProps {
  currentStep: 1 | 2 | 3;
  isCOD?: boolean;
}

const THREE_STEPS = [
  { step: 1, label: 'Delivery' },
  { step: 2, label: 'Payment' },
  { step: 3, label: 'Confirmation' },
];

const TWO_STEPS = [
  { step: 1, label: 'Delivery' },
  { step: 2, label: 'Confirmation' },
];

export default function OrderingStepBar({ currentStep, isCOD = false }: OrderingStepBarProps) {
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
    <div className="w-full py-2">
      {/* Unified Responsive Step Bar */}
      <div className={`relative flex items-center justify-between mx-auto px-2 ${isCOD ? 'max-w-[280px] sm:max-w-xs' : 'max-w-sm sm:max-w-md'}`}>
        {/* Track Line behind steps */}
        <div className="absolute left-6 right-6 sm:left-8 sm:right-8 top-1/2 -translate-y-1/2 h-[2px] bg-[#eedfe5] z-0">
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

          return (
            <div key={s.step} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-[12px] transition-all select-none ${
                  isCurrent
                    ? 'bg-[#b73d67] text-white font-bold shadow-sm ring-4 ring-[#b73d67]/15 scale-105'
                    : isCompleted
                    ? 'bg-[#fceef2] text-[#b73d67] font-semibold border border-[#eedfe5]'
                    : 'bg-white text-[#7a6870] font-medium border border-[#eedfe5]'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5 text-[#b73d67]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-[10px] sm:text-[11px] opacity-80">{s.step}.</span>
                )}
                <span>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
