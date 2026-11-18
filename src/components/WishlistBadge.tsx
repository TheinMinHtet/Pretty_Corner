'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function WishlistBadge({ className }: { className?: string }) {
  const { wishlist, isMounted } = useStore();

  if (!isMounted || wishlist.length <= 0) {
    return null;
  }

  return (
    <span
      className={
        className ||
        'absolute top-1 right-1 bg-[#b73d67] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center'
      }
    >
      {wishlist.length}
    </span>
  );
}
