'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function ShoppingBagPage() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal, cartTotal, selectedTownship, isMounted } = useStore();

  if (!isMounted) {
    return (
      <div className="w-full bg-white flex flex-col min-h-[60vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#b73d67] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12">
      {/* Breadcrumb & Heading - Consistent across mobile and desktop */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-4">
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-2 sm:mb-3">
          <Link href="/" className="hover:text-[#38262e]">Home</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">Beauty Bag</span>
        </div>

        <h1 className="font-serif text-[30px] sm:text-[38px] font-medium text-[#38262e]">
          Your beauty bag
        </h1>
        <p className="font-sans text-[13px] sm:text-[15px] text-[#7a6870] mt-1">
          {cart.length > 0
            ? `${cart.length} lovely ${cart.length === 1 ? 'find' : 'finds'} ready for doorstep delivery.`
            : 'Your beauty bag is currently empty.'}
        </p>
      </div>

      {/* Main Content Area - Responsive 2-Column Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {cart.length > 0 ? (
          <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
            {/* Left Column: Bag Line Items (col-span-12 on mobile, col-span-7 or 8 on desktop) */}
            <div className="md:col-span-7 lg:col-span-8 divide-y divide-[#eedfe5]">
              {cart.map((item) => (
                <div key={item.id} className="py-5 flex gap-4 sm:gap-6 items-center">
                  <div className="relative w-[104px] sm:w-[120px] h-[126px] sm:h-[140px] bg-[#f9f5f7] rounded-[10px] overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between h-[126px] sm:h-[140px] py-1">
                    <div>
                      <h3 className="font-sans text-[16px] sm:text-[18px] font-bold text-[#38262e] leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[12px] sm:text-[13px] text-[#7a6870] mt-0.5">
                        {item.size} · Standard packaging
                      </p>
                      <p className="text-[15px] sm:text-[16px] font-bold text-[#b73d67] mt-1.5">
                        {item.price.toLocaleString()} MMK
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity control */}
                      <div className="h-[36px] w-[108px] bg-white border border-[#eedfe5] rounded-[8px] flex items-center justify-between px-2.5 text-[#38262e]">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="px-1 text-[18px] font-medium hover:text-[#b73d67] cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-[14px] font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="px-1 text-[18px] font-medium hover:text-[#b73d67] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Trash removal */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-[#7a6870] hover:text-[#b73d67] hover:bg-[#fceef2] rounded-full transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary Card (sticky on desktop) */}
            <div className="md:col-span-5 lg:col-span-4 mt-6 md:mt-0">
              <div className="sticky top-28 bg-[#fcf9fa] p-6 lg:p-7 rounded-2xl border border-[#eedfe5]">
                <h2 className="font-serif text-[24px] sm:text-[28px] font-medium text-[#38262e] mb-4">
                  Order summary
                </h2>

                <div className="flex justify-between items-center text-[14px] text-[#7a6870] py-2">
                  <span>Subtotal</span>
                  <span className="text-[#38262e] font-medium">{cartSubtotal.toLocaleString()} MMK</span>
                </div>

                <div className="my-4 border-t border-[#eedfe5]" />

                <div className="flex justify-between items-center text-[18px] font-bold text-[#38262e]">
                  <span>Total</span>
                  <span className="text-[#b73d67]">{cartTotal.toLocaleString()} MMK</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full mt-6 h-[52px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] flex items-center justify-center hover:bg-[#a33259] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  Checkout
                </Link>

                <div className="text-center mt-4">
                  <Link href="/shop" className="text-[13px] font-bold text-[#b73d67] hover:underline">
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#fceef2] text-[#b73d67] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h2 className="font-serif text-[28px] text-[#38262e]">No beauty picks yet.</h2>
            <p className="text-[14px] text-[#7a6870] mt-2">
              Discover your next glow favorite from our curated skincare collection.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center justify-center px-8 h-[48px] bg-[#b73d67] text-white rounded-[10px] text-[14px] font-bold hover:bg-[#a33259] transition-all cursor-pointer"
            >
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
