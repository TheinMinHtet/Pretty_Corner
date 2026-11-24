'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useStore();

  return (
    <div
      className="inline-flex items-center p-0.5 rounded-full bg-[#fcf5f8] border border-[#eedfe5] shadow-[0_1px_4px_rgba(56,38,46,0.04)]"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-1.5 min-[360px]:px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9.5px] min-[360px]:text-[10.5px] sm:text-[11.5px] font-semibold rounded-full transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-[#b73d67] text-white shadow-2xs'
            : 'text-[#7a6870] hover:text-[#38262e]'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('my')}
        className={`px-1.5 min-[360px]:px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9.5px] min-[360px]:text-[10.5px] sm:text-[11.5px] font-semibold rounded-full transition-all cursor-pointer ${
          language === 'my'
            ? 'bg-[#b73d67] text-white shadow-2xs'
            : 'text-[#7a6870] hover:text-[#38262e]'
        }`}
      >
        မြန်မာ
      </button>
    </div>
  );
}
