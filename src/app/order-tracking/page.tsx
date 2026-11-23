'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { formatOrderDate } from '@/lib/order/OrderLifecycleService';

function OrderReceiptContent() {
  const searchParams = useSearchParams();
  const { orders, isMounted, t, language, fetchOrderById } = useStore();

  const orderId = searchParams.get('orderId') || 'PC-261117-024';
  const cleanId = orderId.trim().toUpperCase();
  const order = orders.find((o) => o.id.trim().toUpperCase() === cleanId);

  const [remoteLoading, setRemoteLoading] = React.useState(!order && Boolean(cleanId));
  const [remoteOrder, setRemoteOrder] = React.useState<typeof order | null>(null);

  React.useEffect(() => {
    let active = true;
    if (!order && cleanId && fetchOrderById) {
      fetchOrderById(cleanId)
        .then((res) => {
          if (active && res) setRemoteOrder(res);
        })
        .finally(() => {
          if (active) setRemoteLoading(false);
        });
    }
    return () => {
      active = false;
    };
  }, [order, cleanId, fetchOrderById]);

  const activeOrder = order || remoteOrder;

  if (!isMounted || remoteLoading) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#b73d67] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!activeOrder) {
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
            {t.orderNotFoundTitle}
          </h2>
          <p className="text-[13px] text-[#7a6870] max-w-sm mb-6">
            {t.orderNotFoundDesc} (<span className="font-mono font-bold text-[#38262e]">{orderId}</span>)
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/order-lookup"
              className="flex-1 h-[46px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#a33259] transition-all cursor-pointer"
            >
              {t.searchByOrderId}
            </Link>
            <Link
              href="/shop"
              className="flex-1 h-[46px] bg-white border border-[#eedfe5] text-[#38262e] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#faf7f8] transition-colors cursor-pointer"
            >
              {t.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCOD = activeOrder.paymentMethod === 'Cash on Delivery';

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-5 md:py-10 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-6 sm:p-8 flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4">
          <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">{t.navReceipt}</span>
        </div>

        {/* Page Details Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Link href="/shop" className="text-[12px] font-bold text-[#b73d67] hover:underline shrink-0 whitespace-nowrap">
              {t.backToShop}
            </Link>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#7a6870] uppercase tracking-wider bg-white px-2.5 py-0.5 sm:py-1 rounded-full border border-[#eedfe5] shrink-0 whitespace-nowrap">
              <span className="hidden sm:inline">{t.officialReceipt}</span>
              <span className="sm:hidden">{language === 'my' ? 'အရောင်းပြေစာ' : 'Official Receipt'}</span>
            </span>
          </div>

          <div>
            <h2 className="font-serif text-[26px] sm:text-[32px] font-medium text-[#38262e]">
              {language === 'my' ? 'အမှာစာပြေစာနှင့် ကုန်ကျငွေ' : 'Order Receipt & Summary'}
            </h2>
            <div className="text-[12px] sm:text-[13px] text-[#7a6870] mt-1 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{t.orderRef}: <strong className="text-[#38262e] font-mono">{activeOrder.id}</strong></span>
              {activeOrder.createdAt && (
                <>
                  <span className="text-[#eedfe5]">•</span>
                  <span className="text-[#7a6870] text-[11px] sm:text-[12px] font-normal">{formatOrderDate(activeOrder.createdAt)}</span>
                </>
              )}
            </div>
          </div>

          {/* Payment & Status Overview Card */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#eedfe5] flex flex-col gap-2.5 shadow-2xs">
            <div className="flex justify-between items-center text-[12.5px] sm:text-[13px]">
              <span className="text-[#7a6870]">{t.paymentMethodLabel}</span>
              <span className="font-bold text-[#38262e] text-right">
                {activeOrder.paymentMethod === 'Cash on Delivery'
                  ? (language === 'my' ? 'ပစ္စည်းရောက်မှငွေချေ' : 'Cash on Delivery')
                  : 'MMQR'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[12.5px] sm:text-[13px]">
              <span className="text-[#7a6870]">{t.orderStatus}</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] text-right ${
                activeOrder.paymentStatus === 'cancelled'
                  ? 'bg-gray-100 text-gray-700 border border-gray-200'
                  : isCOD
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : activeOrder.paymentStatus === 'paid'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {activeOrder.paymentStatus === 'cancelled'
                  ? (language === 'my' ? 'အမှာစာ ပယ်ဖျက်ပြီး' : 'Cancelled')
                  : isCOD
                  ? (language === 'my' ? 'အတည်ပြုပြီး (COD)' : 'Confirmed (COD)')
                  : activeOrder.paymentStatus === 'paid'
                  ? (language === 'my' ? 'ငွေပေးချေမှု အတည်ပြုပြီး' : 'Payment Verified')
                  : (language === 'my' ? 'ငွေပေးချေရန်ကျန်' : 'Awaiting Payment')}
              </span>
            </div>
          </div>

          {/* Itemized Beauty Picks Summary */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#eedfe5] shadow-2xs">
            <h3 className="font-serif text-[20px] font-medium text-[#38262e] mb-3">
              {t.itemsOrdered}
            </h3>

            <div className="space-y-2.5 text-[13px] text-[#38262e] divide-y divide-[#eedfe5]/60">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 pt-2 first:pt-0">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-medium text-[#38262e] leading-snug">{item.name}</div>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#7a6870]">
                      <span>Qty:</span>
                      <span className="font-bold text-[#b73d67] bg-[#fceef2] border border-[#f5d9e3] px-1.5 py-0.5 rounded">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-[#38262e] text-right shrink-0 whitespace-nowrap pt-0.5">
                    {(item.price * item.quantity).toLocaleString()} MMK
                  </div>
                </div>
              ))}
            </div>

            <div className="my-3.5 border-t border-[#eedfe5]" />

            <div className="space-y-1.5 text-[14px]">
              {activeOrder.discount && activeOrder.discount > 0 ? (
                <>
                  <div className="flex justify-between font-normal text-[13px] text-[#7a6870]">
                    <span>{t.subTotal}</span>
                    <span>{activeOrder.subtotal.toLocaleString()} MMK</span>
                  </div>
                  <div className="flex justify-between font-normal text-[13px] text-[#7a6870]">
                    <span>{t.discount}</span>
                    <span className="text-[#b73d67]">-{activeOrder.discount.toLocaleString()} MMK</span>
                  </div>
                </>
              ) : null}
              {activeOrder.deliveryFee && activeOrder.deliveryFee > 0 ? (
                <div className="flex justify-between font-normal text-[13px] text-[#7a6870]">
                  <span>{t.delivery}</span>
                  <span>{activeOrder.deliveryFee.toLocaleString()} MMK</span>
                </div>
              ) : null}
              <div className="flex items-baseline justify-between pt-1.5 text-[14px] sm:text-[16px] font-bold text-[#38262e] gap-2">
                <span className="shrink min-w-0">
                  {isCOD ? (language === 'my' ? 'စုစုပေါင်း (COD)' : 'Total (Pay on Delivery)') : t.total}
                </span>
                <span className="text-[#b73d67] shrink-0 whitespace-nowrap">
                  {activeOrder.total.toLocaleString()} MMK
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Recipient Details */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#eedfe5] shadow-2xs text-[13px] text-[#7a6870]">
            <h4 className="font-serif text-[18px] font-medium text-[#38262e] mb-2">
              {t.deliveryDetails}
            </h4>
            <div className="space-y-1">
              <p><strong className="text-[#38262e]">{t.recipient}:</strong> {activeOrder.customerName}</p>
              <p><strong className="text-[#38262e]">{t.phone.replace(' *', '')}:</strong> {activeOrder.phone}</p>
              <p><strong className="text-[#38262e]">{t.address}:</strong> {activeOrder.deliveryAddress}</p>
              {activeOrder.landmarkNote && (
                <p><strong className="text-[#38262e]">{t.note}:</strong> {activeOrder.landmarkNote}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-2">
            {!isCOD && activeOrder.paymentStatus !== 'paid' && activeOrder.paymentStatus !== 'cancelled' && (
              <Link
                href={`/payment-pending?orderId=${encodeURIComponent(activeOrder.id)}`}
                className="w-full h-[50px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>{language === 'my' ? 'MMQR ဖြင့် ငွေပေးချေမည်' : 'Pay Now with MMQR'}</span>
              </Link>
            )}

            <Link
              href="/shop"
              className={`w-full h-[48px] ${
                !isCOD && activeOrder.paymentStatus !== 'paid' && activeOrder.paymentStatus !== 'cancelled'
                  ? 'bg-white border border-[#eedfe5] text-[#38262e] hover:bg-[#faf7f8]'
                  : 'bg-[#b73d67] text-white hover:bg-[#a33259]'
              } rounded-[10px] font-bold text-[14px] transition-all flex items-center justify-center shadow-xs cursor-pointer`}
            >
              {t.continueShopping}
            </Link>

            <Link
              href="/contact"
              className="w-full h-[46px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#f6e1e8] transition-colors cursor-pointer"
            >
              {t.getHelpWithOrder}
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
