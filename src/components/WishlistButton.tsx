'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  svgClassName?: string;
  iconClassName?: string;
}

export default function WishlistButton({
  productId,
  className,
  svgClassName,
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist, isMounted } = useStore();
  const wishlisted = isMounted && isWishlisted(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={
        className ||
        'absolute top-2.5 right-2.5 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform cursor-pointer'
      }
      aria-label="Save product"
    >
      <svg
        className={
          svgClassName ||
          `w-4 h-4 transition-colors ${
            wishlisted ? 'fill-[#b73d67] text-[#b73d67]' : 'text-[#7a6870] fill-none'
          }`
        }
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
