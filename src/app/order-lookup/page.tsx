'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { validatePhoneNumber } from '@/lib/validation';

export default function OrderLookupPage() {
  const router = useRouter();
  const { getOrder } = useStore();

  const [orderRef, setOrderRef] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [lookupError, setLookupError] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderRef.trim()) {
      setLookupError(true);
      return;
    }
    const phoneCheck = validatePhoneNumber(phoneNumber);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.error || 'Please enter a valid phone number.');
      return;
    }
    setPhoneError('');

    const order = getOrder(orderRef.trim(), phoneNumber.trim());
    if (!order) {
      setLookupError(true);
      return;
    }
    setLookupError(false);
    router.push(`/order-tracking?orderId=${order.id}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-5 md:py-10 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-6 sm:p-8 flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4">
          <Link href="/" className="hover:text-[#38262e]">Home</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">Track Order</span>
        </div>

        {/* Page Details */}
        <div className="flex flex-col gap-5">
          <Link href="/shop" className="text-[12px] font-bold text-[#b73d67] hover:underline">
            Back to shop
          </Link>

          <div>
            <h2 className="font-serif text-[30px] font-medium text-[#38262e]">
              Find your order.
            </h2>
            <p className="text-[13px] text-[#7a6870] mt-1">
              Enter your order reference and phone number to check your delivery status.
            </p>
          </div>

          {/* Lookup Form */}
          <form onSubmit={handleLookup} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                Order reference *
              </label>
              <input
                type="text"
                required
                value={orderRef}
                onChange={(e) => {
                  setOrderRef(e.target.value);
                  setLookupError(false);
                }}
                placeholder="e.g. PC-261117-024"
                className="w-full h-[46px] px-3 bg-white border border-[#eedfe5] rounded-[10px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none focus:border-[#b73d67]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                Checkout phone number *
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setLookupError(false);
                  setPhoneError('');
                }}
                placeholder="e.g. 09 765 432 100"
                className={`w-full h-[46px] px-3 bg-white border rounded-[10px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none transition-colors ${
                  phoneError
                    ? 'border-red-400 focus:border-red-500 bg-red-50/10'
                    : 'border-[#eedfe5] focus:border-[#b73d67]'
                }`}
              />
              {phoneError && (
                <p className="text-red-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  <span>{phoneError}</span>
                </p>
              )}
            </div>

            <p className="text-[12px] text-[#7a6870] -mt-1">
              Use the phone number you entered during checkout.
            </p>

            <button
              type="submit"
              className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-xs cursor-pointer"
            >
              Track order
            </button>
          </form>

          {/* Validation Error Banner */}
          {lookupError && (
            <div className="bg-[#fceef2] border border-[#eedfe5] rounded-[10px] p-4 flex flex-col gap-1.5">
              <p className="text-[14px] font-bold text-[#38262e]">
                We couldn’t find an order with those details.
              </p>
              <p className="text-[13px] text-[#7a6870] leading-relaxed">
                Please double check your order reference and phone number, then try again.
              </p>
            </div>
          )}

          {/* Contact Pretty Corner Button */}
          <Link
            href="/contact"
            className="w-full h-[46px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#f6e1e8] transition-colors"
          >
            Questions? Contact Pretty Corner
          </Link>
        </div>
      </div>
    </div>
  );
}
