'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { normalizeMyanmarDigits } from '@/lib/validation';

export default function OrderLookupPage() {
  const router = useRouter();
  const { getOrder, fetchOrderById, t, language } = useStore();

  const [orderRef, setOrderRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = normalizeMyanmarDigits(orderRef.trim());
    if (!cleanRef) {
      setLookupError(true);
      return;
    }

    setLoading(true);
    let order = getOrder(cleanRef);
    if (!order && fetchOrderById) {
      order = await fetchOrderById(cleanRef);
    }
    setLoading(false);

    if (!order) {
      setLookupError(true);
      return;
    }
    setLookupError(false);
    router.push(`/order-tracking?orderId=${order.id}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-5 md:py-10 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-[24px] sm:rounded-2xl p-4 min-[380px]:p-6 sm:p-8 flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4">
          <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">{t.navReceipt}</span>
        </div>

        {/* Page Details */}
        <div className="flex flex-col gap-5">
          <Link href="/shop" className="text-[12px] font-bold text-[#b73d67] hover:underline">
            {t.backToShop}
          </Link>

          <div>
            <h2 className={`font-serif font-medium text-[#38262e] leading-snug ${
              language === 'my'
                ? 'text-[19px] min-[380px]:text-[22px] sm:text-[27px]'
                : 'text-[24px] sm:text-[30px]'
            }`}>
              {t.findReceipt}
            </h2>
            <p className="text-[12.5px] min-[380px]:text-[13px] font-bold text-[#38262e] mt-2.5 sm:mt-3 leading-[1.82]">
              {t.findReceiptSubtitle}
            </p>
          </div>

          {/* Lookup Form */}
          <form onSubmit={handleLookup} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                {t.orderIdLabel}
              </label>
              <input
                type="text"
                required
                value={orderRef}
                onChange={(e) => {
                  setOrderRef(e.target.value);
                  setLookupError(false);
                }}
                placeholder={t.orderIdPlaceholder}
                className="w-full h-[48px] px-3.5 bg-white border border-[#eedfe5] rounded-[10px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none focus:border-[#b73d67] font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t.searchOrder
              )}
            </button>
          </form>

          {/* Validation Error Banner */}
          {lookupError && (
            <div className="bg-[#fceef2] border border-[#eedfe5] rounded-[10px] p-4 flex flex-col gap-1.5">
              <p className="text-[14px] font-bold text-[#38262e]">
                {t.orderNotFoundTitle}
              </p>
              <p className="text-[13px] text-[#7a6870] leading-relaxed">
                {t.orderNotFoundDesc}
              </p>
            </div>
          )}

          {/* Contact Pretty Corner Button */}
          <Link
            href="/contact"
            className="w-full h-[46px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#f6e1e8] transition-colors"
          >
            {t.questionsContact}
          </Link>
        </div>
      </div>
    </div>
  );
}
