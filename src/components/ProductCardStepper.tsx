'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { findCatalogProduct, isProductOutOfStock } from '@/lib/cart/CartEngine';

interface ProductCardStepperProps {
  productId: string;
  sizeName?: string;
  className?: string;
  isOutOfStock?: boolean;
}

export default function ProductCardStepper({
  productId,
  sizeName,
  className,
  isOutOfStock,
}: ProductCardStepperProps) {
  const { getProductQuantity, incrementProduct, decrementProduct, products, isMounted, t } = useStore();

  const quantity = isMounted ? getProductQuantity(productId, sizeName) : 0;
  const catalogProduct = findCatalogProduct(products, productId);
  const outOfStock = Boolean(isOutOfStock ?? isProductOutOfStock(catalogProduct));

  if (quantity === 0) {
    if (outOfStock) {
      return (
        <button
          type="button"
          disabled
          aria-disabled="true"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={
            className ||
            'h-[28px] sm:h-[34px] px-2 sm:px-3 bg-[#f4eef0] text-[#8d7b83] border border-[#e6d7dd] rounded-[7px] sm:rounded-[8px] text-[10px] sm:text-[11.5px] font-bold flex items-center gap-1 cursor-not-allowed select-none min-w-[50px] sm:min-w-[70px] justify-center whitespace-nowrap'
          }
          aria-label={t.outOfStock}
        >
          <span>{t.soldOutBtn}</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          incrementProduct(productId, sizeName);
        }}
        className={
          className ||
          'h-[28px] sm:h-[34px] px-2 sm:px-3 bg-[#b73d67] hover:bg-[#a33259] text-white rounded-[7px] sm:rounded-[8px] text-[10.5px] sm:text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer select-none min-w-[50px] sm:min-w-[70px] justify-center'
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
          : 'h-[28px] sm:h-[34px] px-0.5 sm:px-1 bg-[#b73d67] text-white rounded-[7px] sm:rounded-[8px] flex items-center justify-between gap-0.5 sm:gap-1 shadow-xs transition-all animate-in zoom-in-95 duration-150 select-none'
      }
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          decrementProduct(productId, sizeName);
        }}
        className="w-5 h-5 sm:w-8 sm:h-8 rounded flex items-center justify-center hover:bg-black/15 active:scale-90 text-[12px] sm:text-[15px] font-bold cursor-pointer transition-transform"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="text-[10.5px] sm:text-[12px] font-bold min-w-[14px] sm:min-w-[18px] text-center px-0.5 pointer-events-none">
        {quantity}
      </span>
      <button
        type="button"
        disabled={outOfStock}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          incrementProduct(productId, sizeName);
        }}
        className="w-5 h-5 sm:w-8 sm:h-8 rounded flex items-center justify-center hover:bg-black/15 active:scale-90 text-[12px] sm:text-[15px] font-bold cursor-pointer transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
