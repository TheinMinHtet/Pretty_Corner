'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function CartAvailabilityBanner() {
  const { cartAdjustments, dismissCartAdjustments, t } = useStore();

  if (!cartAdjustments || cartAdjustments.length === 0) {
    return null;
  }

  return (
    <div
      role="status"
      className="mb-4 sm:mb-5 p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 shadow-2xs flex items-start justify-between gap-3 animate-in fade-in duration-200"
    >
      <div className="space-y-1">
        <p className="text-[13px] sm:text-[14px] font-bold text-amber-950">
          {t.cartAvailabilityBannerTitle}
        </p>
        <ul className="space-y-0.5 text-[12px] text-amber-900/90">
          {cartAdjustments.map((adj) => (
            <li key={adj.itemId}>
              <span className="font-semibold">{adj.name}</span>:{' '}
              {t.cartQtyAdjustedDetail
                .replace('{from}', String(adj.previousQuantity))
                .replace('{to}', String(adj.newQuantity))
                .replace('{stock}', String(adj.availableStock))}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={dismissCartAdjustments}
        aria-label="Dismiss notice"
        className="w-6 h-6 rounded-full hover:bg-amber-200/60 text-amber-900 flex items-center justify-center text-xs font-bold cursor-pointer shrink-0 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
