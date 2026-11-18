'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

interface CartBadgeProps {
  className?: string;
}

export default function CartBadge({ className }: CartBadgeProps) {
  const { cartCount, isMounted } = useStore();

  if (!isMounted || cartCount <= 0) {
    return null;
  }

  return (
    <span
      className={
        className ||
        'absolute -top-1 -right-2 bg-[#b73d67] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center'
      }
    >
      {cartCount}
    </span>
  );
}
