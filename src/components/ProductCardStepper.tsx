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
  const { getProductQuantity, incrementProduct, decrementProduct, isMounted } = useStore();

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
          'h-[30px] sm:h-[32px] px-3 bg-[#b73d67]/80 hover:bg-[#b73d67] text-white rounded-[7px] text-[11px] sm:text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer select-none'
        }
        aria-label="Add product to bag"
      >
        <span>+ Add</span>
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
          : 'h-[30px] sm:h-[32px] px-1 bg-[#b73d67]/85 text-white rounded-[7px] flex items-center justify-between gap-1.5 shadow-xs transition-all animate-in zoom-in-95 duration-150 select-none'
      }
    >
      <button
        type="button"
        onClick={() => decrementProduct(productId, sizeName)}
        className="w-5 h-5 rounded flex items-center justify-center hover:bg-black/15 active:scale-90 text-[14px] font-bold cursor-pointer transition-transform"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="text-[12px] font-bold min-w-[16px] text-center px-0.5">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => incrementProduct(productId, sizeName)}
        className="w-5 h-5 rounded flex items-center justify-center hover:bg-black/15 active:scale-90 text-[14px] font-bold cursor-pointer transition-transform"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
