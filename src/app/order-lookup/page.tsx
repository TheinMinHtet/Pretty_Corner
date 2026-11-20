'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function OrderLookupPage() {
  const router = useRouter();
  const { orders, getOrder, isMounted } = useStore();

  const [orderRef, setOrderRef] = useState('');
  const [lookupError, setLookupError] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = orderRef.trim();
    if (!cleanRef) {
      setLookupError(true);
      return;
    }

    const order = getOrder(cleanRef);
    if (!order) {
      setLookupError(true);
      return;
    }
    setLookupError(false);
    router.push(`/order-tracking?orderId=${order.id}`);
  };

  // Recent orders stored on this device
  const recentOrders = isMounted ? orders.slice(0, 4) : [];

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-5 md:py-10 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-6 sm:p-8 flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4">
          <Link href="/" className="hover:text-[#38262e]">Home</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">Find Receipt</span>
        </div>

        {/* Page Details */}
        <div className="flex flex-col gap-5">
          <Link href="/shop" className="text-[12px] font-bold text-[#b73d67] hover:underline">
            ← Back to shop
          </Link>

          <div>
            <h2 className="font-serif text-[30px] font-medium text-[#38262e]">
              Find your order receipt.
            </h2>
            <p className="text-[13px] text-[#7a6870] mt-1">
              Enter your Order ID to view your receipt anytime. No login or password required.
            </p>
          </div>

          {/* Lookup Form */}
          <form onSubmit={handleLookup} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                Order ID / Reference *
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
                className="w-full h-[48px] px-3.5 bg-white border border-[#eedfe5] rounded-[10px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none focus:border-[#b73d67] font-mono uppercase"
              />
              <p className="text-[12px] text-[#7a6870] mt-1.5">
                Simply enter the Order ID provided when you placed your order.
              </p>
            </div>

            <button
              type="submit"
              className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-xs cursor-pointer"
            >
              View Order Receipt
            </button>
          </form>

          {/* Recent Orders on this device */}
          {recentOrders.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-[#eedfe5] flex flex-col gap-2.5">
              <span className="text-[12px] font-bold text-[#38262e]">
                Recent orders on this device:
              </span>
              <div className="flex flex-col gap-2">
                {recentOrders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setOrderRef(o.id);
                      setLookupError(false);
                      router.push(`/order-tracking?orderId=${o.id}`);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#fceef2]/50 border border-[#eedfe5]/60 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-[13px] font-bold text-[#b73d67] group-hover:underline">
                        {o.id}
                      </span>
                      <span className="text-[11px] text-[#7a6870]">
                        {o.createdAt} · {o.items.length} item{o.items.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-[12px] font-bold text-[#38262e]">
                      {o.total.toLocaleString()} MMK →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {lookupError && (
            <div className="bg-[#fceef2] border border-[#eedfe5] rounded-[10px] p-4 flex flex-col gap-1.5">
              <p className="text-[14px] font-bold text-[#38262e]">
                We couldn’t find an order with that reference.
              </p>
              <p className="text-[13px] text-[#7a6870] leading-relaxed">
                Please double-check your Order ID (e.g. PC-261117-024) and try again.
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
