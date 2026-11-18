'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders } = useStore();

  const orderId = searchParams.get('orderId') || 'PC-261117-024';
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex flex-col min-h-full pb-12">
      <div className="bg-white md:bg-[#faf7f8] md:border md:border-[#eedfe5] md:rounded-2xl md:p-8 flex flex-col">
      {/* 1. Header (2:33) */}
      <header className="px-5 pt-4 pb-2 text-center border-b border-transparent">
        <h1 className="font-serif text-[29px] font-medium text-[#38262e]">
          Pretty Corner
        </h1>
      </header>

      {/* 2. Confirmation State (2:34) */}
      <section className="px-5 pt-4 flex flex-col items-center text-center">
        {/* Check disk */}
        <div className="w-[80px] h-[80px] rounded-full bg-[#fceef2] flex items-center justify-center text-[#b73d67] mb-3">
          <svg className="w-[36px] h-[36px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="font-serif text-[33px] font-medium leading-tight text-[#38262e]">
          A little joy is on its way.
        </h2>

        <p className="font-sans text-[14px] text-[#7a6870] mt-2 leading-relaxed max-w-[320px]">
          Thank you, {order.customerName}. Your payment is verified and we’ve received your order.
        </p>

        {/* Order reference card (2:390) */}
        <div className="w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-[10px] p-4 mt-6 flex items-center justify-between text-left">
          <div>
            <span className="block text-[10px] font-bold tracking-[1.2px] text-[#7a6870] uppercase">
              YOUR ORDER REFERENCE
            </span>
            <span className="block text-[19px] font-bold text-[#38262e] mt-0.5">
              {order.id}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 text-[#7a6870] hover:text-[#b73d67] transition-colors relative"
            title="Copy order reference"
          >
            {copied ? (
              <span className="text-[11px] font-bold text-[#3b775d]">Copied!</span>
            ) : (
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* 3. Order Details (2:35) */}
      <section className="px-5 pt-6 flex flex-col">
        <div className="flex justify-between items-center text-[13px] py-1">
          <span className="text-[#7a6870]">Payment</span>
          <span className="font-bold text-[#38262e]">
            Paid · {order.paymentMethod || 'MyanMyanPay'}
          </span>
        </div>

        <div className="flex justify-between items-center text-[13px] py-1">
          <span className="text-[#7a6870]">Order status</span>
          <span className="font-bold text-[#38262e]">
            Pending review
          </span>
        </div>

        <div className="my-3 border-t border-[#eedfe5]" />

        <h3 className="font-serif text-[24px] font-medium text-[#38262e] mb-3">
          Your beauty picks
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[13px]">
              <span className="text-[#7a6870]">
                {item.quantity} × {item.name} · {item.size}
              </span>
              <span className="font-bold text-[#38262e]">
                {(item.price * item.quantity).toLocaleString()} MMK
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#7a6870]">
              Delivery · {order.township.split(',')[0]}
            </span>
            <span className="font-bold text-[#38262e]">
              {order.deliveryFee.toLocaleString()} MMK
            </span>
          </div>
        </div>

        <div className="my-3 border-t border-[#eedfe5]" />

        <div className="flex justify-between items-center text-[17px] py-1">
          <span className="text-[#7a6870]">Total paid</span>
          <span className="font-bold text-[#38262e]">
            {order.total.toLocaleString()} MMK
          </span>
        </div>

        <div className="mt-4 pt-2">
          <p className="text-[13px] font-bold text-[#38262e]">
            Delivering to {order.customerName}
          </p>
          <p className="text-[12px] text-[#7a6870] mt-0.5">
            {order.deliveryAddress}
          </p>
        </div>
      </section>

      {/* 4. Help & Action Buttons (2:36) */}
      <section className="px-5 pt-8 flex flex-col gap-3">
        <Link
          href={`/order-tracking?orderId=${order.id}`}
          className="w-full h-[50px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#a33259] active:scale-[0.98] transition-all shadow-xs"
        >
          Track your order
        </Link>

        <p className="text-[11px] text-center text-[#7a6870]">
          Use your order reference and phone number.
        </p>

        <div className="text-center pt-2">
          <Link
            href="/shop"
            className="text-[13px] font-bold text-[#b73d67] hover:underline"
          >
            Back to shopping →
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="text-[12px] text-[#7a6870] hover:text-[#38262e] hover:underline"
          >
            Questions? We’re happy to help.
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7a6870]">Loading confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
