'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const { orders } = useStore();

  const orderId = searchParams.get('orderId') || 'PC-261117-024';
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [refreshedTime, setRefreshedTime] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-4 md:py-10 flex flex-col min-h-full pb-12">
      <div className="bg-white md:bg-[#faf7f8] md:border md:border-[#eedfe5] md:rounded-2xl md:p-8 flex flex-col">
      {/* 1. Header (35:641) */}
      <header className="px-5 pt-4 pb-2 text-center border-b border-transparent">
        <h1 className="font-serif text-[29px] font-medium text-[#38262e]">
          Pretty Corner
        </h1>
      </header>

      {/* 2. Page Details (35:643) */}
      <div className="px-5 pt-3 flex flex-col gap-4">
        <Link href="/shop" className="text-[12px] font-bold text-[#b73d67] hover:underline">
          ‹ Back to shop
        </Link>

        <div>
          <h2 className="font-serif text-[30px] font-medium text-[#38262e]">
            Your order, at a glance.
          </h2>
          <p className="text-[13px] text-[#7a6870] mt-1 font-medium">
            {order.id} · Order Tracking
          </p>
        </div>

        {/* Separate Statuses Banner (35:1276) */}
        <div className="bg-[#fceef2] rounded-[10px] p-4 flex flex-col gap-2">
          <p className="text-[14px] font-bold text-[#38262e]">
            Payment · <span className="capitalize">{order.paymentStatus}</span>
          </p>
          <p className="text-[14px] font-bold text-[#b73d67]">
            Fulfillment ·{' '}
            {order.fulfillmentStatus === 'pending_review'
              ? 'Pending review'
              : order.fulfillmentStatus}
          </p>
          <p className="text-[13px] text-[#7a6870] leading-relaxed">
            We’ve received your order. The shop will review it next.
          </p>
        </div>

        {/* Order Progress Timeline (35:1280) */}
        <div className="bg-[#f9f5f7] rounded-[10px] p-4 flex flex-col gap-2.5">
          <div className="space-y-2 text-[14px] text-[#38262e]">
            <div className="flex items-start gap-2.5">
              <span className="text-[#3b775d] text-[16px] leading-none mt-0.5">●</span>
              <div>
                <p className="font-bold text-[#38262e]">Order received</p>
                <p className="text-[12px] text-[#7a6870]">{order.createdAt}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-[#7a6870]">
              <span className="text-[16px] leading-none">○</span>
              <p>Confirmed</p>
            </div>

            <div className="flex items-center gap-2.5 text-[#7a6870]">
              <span className="text-[16px] leading-none">○</span>
              <p>Processing</p>
            </div>

            <div className="flex items-center gap-2.5 text-[#7a6870]">
              <span className="text-[16px] leading-none">○</span>
              <p>Shipped</p>
            </div>

            <div className="flex items-center gap-2.5 text-[#7a6870]">
              <span className="text-[16px] leading-none">○</span>
              <p>Delivered</p>
            </div>
          </div>

          <p className="text-[12px] text-[#7a6870] pt-1">
            Future steps have not been completed yet.
          </p>
        </div>

        {/* Beauty picks itemized summary (35:1283) */}
        <div className="mt-1">
          <h3 className="font-serif text-[23px] font-medium text-[#38262e] mb-2">
            Your beauty picks
          </h3>

          <div className="space-y-2 text-[13px] text-[#38262e]">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.quantity} × {item.name} · {item.size}</span>
                <span className="font-bold">{(item.price * item.quantity).toLocaleString()} MMK</span>
              </div>
            ))}
          </div>

          <div className="my-3 border-t border-[#eedfe5]" />

          <div className="space-y-1 text-[14px] font-bold text-[#38262e]">
            <div className="flex justify-between font-normal text-[13px] text-[#7a6870]">
              <span>Delivery</span>
              <span>{order.deliveryFee.toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Total paid</span>
              <span>{order.total.toLocaleString()} MMK</span>
            </div>
          </div>

          <div className="mt-3 text-[13px] text-[#7a6870]">
            <p className="font-medium text-[#38262e]">Delivery to {order.customerName}</p>
            <p>{order.deliveryAddress}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all flex items-center justify-center shadow-xs"
          >
            {isRefreshing ? 'Refreshing status...' : `Refresh order status (${refreshedTime})`}
          </button>

          <Link
            href="/contact"
            className="w-full h-[46px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#f6e1e8] transition-colors"
          >
            Get help with this order
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7a6870]">Loading order tracking...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
