'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function GuestOrderLookupPage() {
  const router = useRouter();
  const { getOrder } = useStore();

  const [orderRef, setOrderRef] = useState('PC-261117-024');
  const [phoneNumber, setPhoneNumber] = useState('09 765 432 100');
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [lookupError, setLookupError] = useState(false);

  const handleContinueVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const order = getOrder(orderRef, phoneNumber);
    if (!order) {
      setLookupError(true);
      return;
    }
    setLookupError(false);
    setShowOtpSection(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const order = getOrder(orderRef, phoneNumber);
    if (order) {
      router.push(`/order-tracking?orderId=${order.id}`);
    } else {
      setLookupError(true);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-4 md:py-10 flex flex-col min-h-full pb-12">
      <div className="bg-white md:bg-[#faf7f8] md:border md:border-[#eedfe5] md:rounded-2xl md:p-8 flex flex-col">
      {/* 1. Header (35:637) */}
      <header className="px-5 pt-4 pb-2 text-center border-b border-transparent">
        <h1 className="font-serif text-[29px] font-medium text-[#38262e]">
          Pretty Corner
        </h1>
      </header>

      {/* 2. Page Details (35:639) */}
      <div className="px-5 pt-3 flex flex-col gap-5">
        <Link href="/shop" className="text-[12px] font-bold text-[#b73d67] hover:underline">
          ‹ Back to shop
        </Link>

        <div>
          <h2 className="font-serif text-[30px] font-medium text-[#38262e]">
            Find your order.
          </h2>
          <p className="text-[13px] text-[#7a6870] mt-1">
            No account needed. Keep your order reference handy.
          </p>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleContinueVerification} className="flex flex-col gap-4">
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
              className="w-full h-[46px] px-3 bg-white border border-[#eedfe5] rounded-[10px] text-[14px] text-[#38262e] outline-none focus:border-[#b73d67]"
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
              }}
              placeholder="e.g. 09 765 432 100"
              className="w-full h-[46px] px-3 bg-white border border-[#eedfe5] rounded-[10px] text-[14px] text-[#38262e] outline-none focus:border-[#b73d67]"
            />
          </div>

          <p className="text-[12px] text-[#7a6870] -mt-1">
            Use the phone number you entered at checkout.
          </p>

          {!showOtpSection && (
            <button
              type="submit"
              className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-xs"
            >
              Continue to verification
            </button>
          )}
        </form>

        {/* Phone Verification Section (35:1258) */}
        {showOtpSection && (
          <form onSubmit={handleVerifyOtp} className="bg-[#f9f5f7] border border-[#eedfe5] rounded-[10px] p-4 flex flex-col gap-3 animate-in fade-in">
            <h3 className="font-serif text-[21px] font-medium text-[#38262e]">
              Verify it’s you
            </h3>
            <p className="text-[13px] text-[#7a6870] leading-relaxed">
              We’ve sent a demo verification code to your checkout phone ({phoneNumber}).
            </p>

            <div>
              <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                Verification code
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit code (e.g. 123456)"
                className="w-full h-[46px] px-3 bg-white border border-[#eedfe5] rounded-[10px] text-[14px] text-[#38262e] outline-none focus:border-[#b73d67]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all flex items-center justify-center shadow-xs"
            >
              Verify & view order
            </button>

            <button
              type="button"
              onClick={() => alert('Demo verification code is: 123456')}
              className="text-[12px] font-bold text-[#b73d67] hover:underline text-left mt-1"
            >
              Resend code when available
            </button>
          </form>
        )}

        {/* Validation Error Banner (35:1268) */}
        {lookupError && (
          <div className="bg-[#fceef2] border border-[#eedfe5] rounded-[10px] p-4 flex flex-col gap-1.5">
            <p className="text-[14px] font-bold text-[#38262e]">
              We couldn’t verify those details.
            </p>
            <p className="text-[13px] text-[#7a6870] leading-relaxed">
              Check your reference and phone number, then try again. No customer or order details are shown before verification.
            </p>
          </div>
        )}

        {/* Contact Pretty Corner Button (35:1271) */}
        <Link
          href="/contact"
          className="w-full h-[46px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#f6e1e8] transition-colors"
        >
          Contact Pretty Corner
        </Link>
      </div>
      </div>
    </div>
  );
}
