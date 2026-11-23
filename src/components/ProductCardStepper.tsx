'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

interface ProductCardStepperProps {
  productId: string;
  sizeName?: string;
  className?: string;
}

export default function ProductCardStepper({
  productId,
  sizeName,
  className,
}: ProductCardStepperProps) {
  const { getProductQuantity, incrementProduct, decrementProduct, isMounted, t } = useStore();

  const quantity = isMounted ? getProductQuantity(productId, sizeName) : 0;

  if (quantity === 0) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          incrementProduct(productId, sizeName);
        }}
        className={
          className ||
          'h-[30px] sm:h-[34px] px-2.5 sm:px-3 bg-[#b73d67] hover:bg-[#a33259] text-white rounded-[7px] sm:rounded-[8px] text-[11px] sm:text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer select-none min-w-[56px] sm:min-w-[70px] justify-center'
        }
        aria-label="Add product to bag"
      >
        <span>{t.addBtn}</span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={
        className
          ? `${className} flex items-center justify-between`
          : 'h-[30px] sm:h-[34px] px-0.5 sm:px-1 bg-[#b73d67] text-white rounded-[7px] sm:rounded-[8px] flex items-center justify-between gap-0.5 sm:gap-1 shadow-xs transition-all animate-in zoom-in-95 duration-150 select-none'
      }
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          decrementProduct(productId, sizeName);
        }}
        className="w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center hover:bg-black/15 active:scale-90 text-[13px] sm:text-[15px] font-bold cursor-pointer transition-transform"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="text-[11px] sm:text-[12px] font-bold min-w-[16px] sm:min-w-[18px] text-center px-0.5 pointer-events-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          incrementProduct(productId, sizeName);
        }}
        className="w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center hover:bg-black/15 active:scale-90 text-[13px] sm:text-[15px] font-bold cursor-pointer transition-transform"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
