'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

function OrderReceiptContent() {
  const searchParams = useSearchParams();
  const { orders, isMounted } = useStore();

  const orderId = searchParams.get('orderId') || 'PC-261117-024';
  const cleanId = orderId.trim().toUpperCase();
  const order = orders.find((o) => o.id.trim().toUpperCase() === cleanId);

  if (!isMounted) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#b73d67] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-5 md:py-10 flex flex-col min-h-full pb-12">
        <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#fceef2] flex items-center justify-center text-[#b73d67] mb-4">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h2 className="font-serif text-[26px] sm:text-[30px] font-medium text-[#38262e] mb-2">
            Receipt Not Found
          </h2>
          <p className="text-[13px] text-[#7a6870] max-w-sm mb-6">
            We couldn’t find an order receipt matching <span className="font-mono font-bold text-[#38262e]">{orderId}</span>. Please verify your Order ID and try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/order-lookup"
              className="flex-1 h-[46px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#a33259] transition-all cursor-pointer"
            >
              Search by Order ID
            </Link>
            <Link
              href="/shop"
              className="flex-1 h-[46px] bg-white border border-[#eedfe5] text-[#38262e] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#faf7f8] transition-colors cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCOD = order.paymentMethod === 'Cash on Delivery';

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-5 md:py-10 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-6 sm:p-8 flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4">
          <Link href="/" className="hover:text-[#38262e]">Home</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">Order Receipt</span>
        </div>

        {/* Page Details Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/shop" className="text-[12px] font-bold text-[#b73d67] hover:underline">
              ← Back to shop
            </Link>
            <span className="text-[11px] font-bold text-[#7a6870] uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-[#eedfe5]">
              Official Receipt
            </span>
          </div>

          <div>
            <h2 className="font-serif text-[28px] sm:text-[32px] font-medium text-[#38262e]">
              Order Receipt &amp; Summary
            </h2>
            <p className="text-[13px] text-[#7a6870] mt-1 font-medium">
              Order ID: <strong className="text-[#38262e] font-mono">{order.id}</strong> · {order.createdAt}
            </p>
          </div>

          {/* Payment & Status Overview Card */}
          <div className="bg-white rounded-xl p-4 border border-[#eedfe5] flex flex-col gap-2.5 shadow-2xs">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#7a6870]">Payment Method</span>
              <span className="font-bold text-[#38262e]">
                {order.paymentMethod || 'Mobile Banking'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#7a6870]">Payment Status</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                isCOD
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {isCOD ? 'Cash on Delivery (Pay on arrival)' : 'Payment Verified'}
              </span>
            </div>
          </div>

          {/* Itemized Beauty Picks Summary */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#eedfe5] shadow-2xs">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e] mb-3">
              Items Ordered
            </h3>

            <div className="space-y-2.5 text-[13px] text-[#38262e] divide-y divide-[#eedfe5]/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pt-2 first:pt-0">
                  <div className="flex items-center">
                    <span className="font-medium text-[#38262e]">{item.name}</span>
                    <span className="inline-flex items-center font-bold text-[#b73d67] bg-[#fceef2] border border-[#f5d9e3] px-1.5 py-0.5 rounded text-[11px] ml-2 shrink-0">
                      x{item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-[#38262e]">
                    {(item.price * item.quantity).toLocaleString()} MMK
                  </span>
                </div>
              ))}
            </div>

            <div className="my-3.5 border-t border-[#eedfe5]" />

            <div className="space-y-1.5 text-[14px]">
              {order.discount && order.discount > 0 ? (
                <>
                  <div className="flex justify-between font-normal text-[13px] text-[#7a6870]">
                    <span>Sub Total</span>
                    <span>{order.subtotal.toLocaleString()} MMK</span>
                  </div>
                  <div className="flex justify-between font-normal text-[13px] text-[#7a6870]">
                    <span>Discount</span>
                    <span className="text-[#b73d67]">-{order.discount.toLocaleString()} MMK</span>
                  </div>
                </>
              ) : null}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between font-normal text-[13px] text-[#7a6870]">
                  <span>Delivery</span>
                  <span>{order.deliveryFee.toLocaleString()} MMK</span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-[16px] font-bold text-[#38262e]">
                <span>{isCOD ? 'Total to Pay on Delivery' : 'Total Paid'}</span>
                <span className="text-[#b73d67]">{order.total.toLocaleString()} MMK</span>
              </div>
            </div>
          </div>

          {/* Delivery Recipient Details */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#eedfe5] shadow-2xs text-[13px] text-[#7a6870]">
            <h4 className="font-serif text-[18px] font-medium text-[#38262e] mb-2">
              Delivery Details
            </h4>
            <div className="space-y-1">
              <p><strong className="text-[#38262e]">Recipient:</strong> {order.customerName}</p>
              <p><strong className="text-[#38262e]">Phone:</strong> {order.phone}</p>
              <p><strong className="text-[#38262e]">Address:</strong> {order.deliveryAddress}</p>
              {order.landmarkNote && (
                <p><strong className="text-[#38262e]">Note:</strong> {order.landmarkNote}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-2">
            <Link
              href="/shop"
              className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all flex items-center justify-center shadow-xs cursor-pointer"
            >
              Continue Shopping
            </Link>

            <Link
              href="/contact"
              className="w-full h-[46px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#f6e1e8] transition-colors cursor-pointer"
            >
              Get Help With This Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7a6870]">Loading order receipt...</div>}>
      <OrderReceiptContent />
    </Suspense>
  );
}
