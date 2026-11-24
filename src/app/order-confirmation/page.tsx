'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import OrderingStepBar from '@/components/OrderingStepBar';
import { formatOrderDate } from '@/lib/order/OrderLifecycleService';
import { OrderCardSkeleton } from '@/components/Skeletons';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, clearCart, t, language, fetchOrderById, isMounted } = useStore();

  const orderId = searchParams.get('orderId') || 'PC-261117-024';
  const cleanId = orderId.trim().toUpperCase();
  const localOrder = orders.find((o) => o.id.trim().toUpperCase() === cleanId);

  const [remoteOrder, setRemoteOrder] = useState<typeof localOrder | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(!localOrder && Boolean(cleanId));

  useEffect(() => {
    let active = true;
    if (!localOrder && cleanId && fetchOrderById) {
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
  }, [localOrder, cleanId, fetchOrderById]);

  const order = localOrder || remoteOrder;
  const isCOD = order?.paymentMethod === 'Cash on Delivery';

  // Automatically clear cart when order confirmation is reached
  useEffect(() => {
    if (order && order.paymentStatus !== 'cancelled') {
      clearCart();
    }
  }, [order?.id, order?.paymentStatus, clearCart]);

  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Live status synchronization: poll while paymentStatus is pending
  useEffect(() => {
    if (!cleanId || !order || order.paymentStatus === 'paid' || order.paymentStatus === 'cancelled' || isCOD) {
      return;
    }

    let active = true;
    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(cleanId)}`);
        if (res.ok) {
          const data = await res.json();
          if (active && data.paymentStatus && data.paymentStatus !== order.paymentStatus) {
            if (fetchOrderById) {
              const fresh = await fetchOrderById(cleanId);
              if (active && fresh) setRemoteOrder(fresh);
            }
          }
        }
      } catch {}
    };

    const interval = setInterval(pollStatus, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [cleanId, order, isCOD, fetchOrderById]);

  const handleCopy = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    if (!order) return;
    const formattedDate = formatOrderDate(order.createdAt);
    
    // Draw an elegant, high-res canvas image for the receipt (JPEG)
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000 + (order.items.length * 40);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Header band
    ctx.fillStyle = '#fceef2';
    ctx.fillRect(0, 0, canvas.width, 140);

    // Brand Name
    ctx.fillStyle = '#38262e';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Pretty Corner', canvas.width / 2, 60);

    // Tagline
    ctx.fillStyle = '#7a6870';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(t.brandSlogan.toUpperCase(), canvas.width / 2, 90);

    ctx.fillStyle = '#b73d67';
    ctx.font = '14px sans-serif';
    ctx.fillText(t.officialReceipt, canvas.width / 2, 115);

    // Order Info block
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38262e';
    ctx.font = 'bold 16px sans-serif';
    let y = 180;

    ctx.fillText(`${t.orderRef}: ${order.id}`, 60, y);
    ctx.fillStyle = '#7a6870';
    ctx.font = '14px sans-serif';
    const isPaid = order.paymentStatus === 'paid';
    const isCancelled = order.paymentStatus === 'cancelled';
    const isCODOrder = order.paymentMethod === 'Cash on Delivery';
    const paymentLabel = isCODOrder ? 'Cash on Delivery' : 'MMQR';
    const paymentStatusText = isCancelled
      ? (language === 'my' ? 'ပယ်ဖျက်ပြီး' : 'Cancelled')
      : isPaid
      ? t.paymentVerified
      : isCODOrder
      ? (language === 'my' ? 'ပစ္စည်းရောက်မှ ငွေချေမည်' : 'Pay on arrival')
      : (language === 'my' ? 'ငွေပေးချေရန်ကျန်' : 'Awaiting Payment');
    ctx.fillText(`Payment: ${paymentLabel} (${paymentStatusText})`, 60, y + 50);

    // Divider
    y += 85;
    ctx.strokeStyle = '#eedfe5';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(canvas.width - 60, y);
    ctx.stroke();

    // Customer details
    y += 30;
    ctx.fillStyle = '#38262e';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`${t.deliveringTo}:`, 60, y);
    ctx.fillStyle = '#7a6870';
    ctx.font = '14px sans-serif';
    ctx.fillText(`${order.customerName} · ${order.phone}`, 60, y + 24);
    ctx.fillText(`${order.deliveryAddress}`, 60, y + 46);

    // Divider
    y += 75;
    ctx.strokeStyle = '#eedfe5';
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(canvas.width - 60, y);
    ctx.stroke();

    // Items header
    y += 35;
    ctx.fillStyle = '#38262e';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(t.itemsOrdered, 60, y);
    ctx.textAlign = 'right';
    ctx.fillText('MMK', canvas.width - 60, y);

    // Items list
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#514149';
    order.items.forEach((item) => {
      y += 34;
      ctx.textAlign = 'left';
      ctx.fillText(`${item.name}  x${item.quantity}`, 60, y);
      ctx.textAlign = 'right';
      ctx.fillText(`${(item.price * item.quantity).toLocaleString()} MMK`, canvas.width - 60, y);
    });

    // Divider
    y += 35;
    ctx.strokeStyle = '#eedfe5';
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(canvas.width - 60, y);
    ctx.stroke();

    // Subtotal & Delivery
    y += 30;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#7a6870';
    const deliveryFee = order.deliveryFee || 0;
    if ((order.discount && order.discount > 0) || deliveryFee > 0) {
      ctx.fillText(t.subTotal, 60, y);
      ctx.textAlign = 'right';
      ctx.fillText(`${(order.subtotal || order.total).toLocaleString()} MMK`, canvas.width - 60, y);

      if (order.discount && order.discount > 0) {
        y += 26;
        ctx.textAlign = 'left';
        ctx.fillText(t.discount, 60, y);
        ctx.textAlign = 'right';
        ctx.fillText(`-${order.discount.toLocaleString()} MMK`, canvas.width - 60, y);
      }

      if (deliveryFee > 0) {
        y += 26;
        ctx.textAlign = 'left';
        ctx.fillText(t.delivery, 60, y);
        ctx.textAlign = 'right';
        ctx.fillText(`${deliveryFee.toLocaleString()} MMK`, canvas.width - 60, y);
      }
    }

    // Divider
    y += 25;
    ctx.strokeStyle = '#eedfe5';
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(canvas.width - 60, y);
    ctx.stroke();

    // Total
    y += 35;
    ctx.textAlign = 'left';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#38262e';
    ctx.fillText(order.paymentMethod === 'Cash on Delivery' ? (language === 'my' ? 'ပစ္စည်းရောက်မှ ပေးချေရမည့်ငွေ' : 'Total to Pay on Delivery') : t.total, 60, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#b73d67';
    ctx.fillText(`${order.total.toLocaleString()} MMK`, canvas.width - 60, y);

    // Footer note
    y += 60;
    ctx.textAlign = 'center';
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#7a6870';
    ctx.fillText(language === 'my' ? 'Pretty Corner ကို ရွေးချယ်အားပေးသည့်အတွက် အထူးကျေးဇူးတင်ရှိပါသည်!' : 'Thank you for choosing Pretty Corner!', canvas.width / 2, y);
    ctx.fillText(`${t.doorstepDelivery} · ${t.yangonMyanmar}`, canvas.width / 2, y + 20);

    // Export to JPEG
    const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = jpegUrl;
    link.download = `Receipt-${order.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  if (!isMounted || remoteLoading) {
    return <OrderCardSkeleton wide />;
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

  return (
    <div className="w-full max-w-2xl mx-auto px-2.5 sm:px-6 py-4 md:py-8 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-[24px] sm:rounded-2xl p-3 min-[360px]:p-4 sm:p-8 flex flex-col">
        {/* Step Bar */}
        <div className="mb-4 print:hidden">
          <OrderingStepBar currentStep={isCOD ? 2 : 3} isCOD={isCOD} orderId={order.id} />
        </div>

        {/* Confirmation State */}
        <section className="pt-2 flex flex-col items-center text-center">
        {/* Check disk */}
        <div className="w-[80px] h-[80px] rounded-full bg-[#fceef2] flex items-center justify-center text-[#b73d67] mb-3">
          <svg className="w-[36px] h-[36px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className={`font-serif font-medium leading-[1.45] text-[#38262e] ${
          language === 'my'
            ? 'text-[18px] min-[380px]:text-[21px] sm:text-[26px]'
            : 'text-[24px] sm:text-[32px]'
        }`}>
          {t.orderConfirmedJoy}
        </h2>

        <p className="font-sans text-[12.5px] min-[380px]:text-[13px] sm:text-[14px] text-[#7a6870] mt-3 sm:mt-3.5 leading-[1.82] max-w-[360px]">
          {order.paymentStatus === 'cancelled'
            ? (language === 'my'
                ? `ဤအမှာစာ (${order.id}) ကို ပယ်ဖျက်ထားပါသည်။ ပစ္စည်းများ ပြန်လည်ရွေးချယ်ပြီး အသစ်မှာယူနိုင်ပါသည်။`
                : `Order #${order.id} has been cancelled. You can edit your bag or start a new order.`)
            : order.paymentMethod === 'Cash on Delivery'
            ? (language === 'my'
                ? `ကျေးဇူးတင်ပါသည် ${order.customerName}။ သင့်အမှာစာ အတည်ပြုပြီးပါပြီ။ ပစ္စည်းရောက်ရှိချိန်တွင် ငွေအဆင်သင့် ထားရှိပေးပါခင်ဗျာ။`
                : `Thank you, ${order.customerName}. Your order is confirmed! Please have cash ready when our courier arrives.`)
            : order.paymentStatus === 'paid'
            ? (language === 'my'
                ? `ကျေးဇူးတင်ပါသည် ${order.customerName}။ ငွေပေးချေမှု အတည်ပြုပြီးဖြစ်၍ အမှာစာကို လက်ခံရရှိထားပါပြီ။`
                : `Thank you, ${order.customerName}. Your payment is verified and we’ve received your order.`)
            : (language === 'my'
                ? `သင့်အမှာစာကို စာရင်းသွင်းထားပြီးဖြစ်ပါသည်။ MMQR ဖြင့် ငွေပေးချေရန် စောင့်ဆိုင်းနေပါသည်။`
                : `Your order has been registered. Awaiting MMQR payment completion.`)}
        </p>

        {/* Order reference card */}
        <div className="w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-[12px] p-4 mt-6 flex flex-col gap-2.5 shadow-xs text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold tracking-[1.2px] text-[#7a6870] uppercase">
                {t.yourOrderRef}
              </span>
              <span className="block text-[20px] font-mono font-bold text-[#38262e] mt-0.5 select-all">
                {order.id}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="p-2 text-[#7a6870] hover:text-[#b73d67] transition-colors relative cursor-pointer"
              title="Copy order reference"
            >
              {copied ? (
                <span className="text-[11px] font-bold text-[#3b775d]">{t.copied}</span>
              ) : (
                <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-[#eedfe5]/70 flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#b73d67]">
            <svg className="w-4 h-4 text-[#b73d67] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>
              {language === 'my'
                ? 'အမှာစာအခြေအနေနှင့် ပြေစာစစ်ဆေးရန် ဤ Order ID ကို သိမ်းဆည်းထားပေးပါ။'
                : 'Please save this Order ID to check your order status & receipt.'}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Order Details */}
      <section className="px-1 min-[360px]:px-3 sm:px-5 pt-5 sm:pt-6 flex flex-col">
        <div className="flex justify-between items-center text-[12.5px] sm:text-[13px] py-1 gap-2">
          <span className="text-[#7a6870] shrink-0">{t.paymentMethodLabel}</span>
          <span className="font-bold text-[#38262e] text-right">
            {order.paymentMethod === 'Cash on Delivery'
              ? (language === 'my' ? 'ပစ္စည်းရောက်မှငွေချေ' : 'Cash on Delivery')
              : order.paymentStatus === 'cancelled'
              ? (language === 'my' ? 'ပယ်ဖျက်ပြီး · MMQR' : 'Cancelled · MMQR')
              : order.paymentStatus === 'paid'
              ? (language === 'my' ? 'ငွေပေးချေပြီး · MMQR' : 'Paid · MMQR')
              : (language === 'my' ? 'ငွေမချေရသေးပါ · MMQR' : 'Unpaid · MMQR')}
          </span>
        </div>

        <div className="flex justify-between items-center text-[12.5px] sm:text-[13px] py-1 gap-2">
          <span className="text-[#7a6870] shrink-0">{t.orderStatus}</span>
          <span className={`font-bold flex items-center gap-1.5 text-right ${
            order.paymentStatus === 'cancelled'
              ? 'text-gray-600'
              : order.paymentStatus === 'paid' || isCOD
              ? 'text-emerald-700'
              : 'text-amber-700'
          }`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              order.paymentStatus === 'cancelled'
                ? 'bg-gray-400'
                : order.paymentStatus === 'paid' || isCOD
                ? 'bg-emerald-500'
                : 'bg-amber-500'
            }`} />
            {order.paymentStatus === 'cancelled'
              ? (language === 'my' ? 'အမှာစာ ပယ်ဖျက်ပြီး' : 'Cancelled')
              : order.paymentStatus === 'paid'
              ? (language === 'my' ? 'အတည်ပြုပြီး (ပြင်ဆင်နေပါသည်)' : 'Confirmed · Processing')
              : isCOD
              ? (language === 'my' ? 'အတည်ပြုပြီး (COD)' : 'Confirmed · COD')
              : (language === 'my' ? 'ငွေပေးချေမှု စောင့်ဆိုင်းဆဲ' : 'Awaiting Payment')}
          </span>
        </div>

        {/* If unpaid MMQR and NOT cancelled, show button to pay now */}
        {!isCOD && order.paymentStatus !== 'paid' && order.paymentStatus !== 'cancelled' && (
          <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <span className="text-[12.5px] text-amber-900 font-medium">
              {language === 'my' ? 'ငွေပေးချေမှု မပြီးမြောက်သေးပါ။' : 'Payment has not been completed yet.'}
            </span>
            <Link
              href={`/payment-pending?orderId=${encodeURIComponent(order.id)}`}
              className="px-3.5 py-1.5 bg-[#b73d67] text-white text-[12px] font-bold rounded-lg hover:bg-[#a33259] transition-colors shrink-0 shadow-2xs"
            >
              {language === 'my' ? 'ငွေပေးချေရန်' : 'Pay Now'}
            </Link>
          </div>
        )}

        {/* If order is explicitly cancelled */}
        {order.paymentStatus === 'cancelled' && (
          <div className="mt-3 p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3">
            <span className="text-[12.5px] text-gray-700 font-medium">
              {language === 'my' ? 'ဤအမှာစာကို ပယ်ဖျက်ထားပါသည်။' : 'This order has been cancelled.'}
            </span>
            <button
              type="button"
              onClick={() => {
                clearCart();
                router.push('/shop');
              }}
              className="px-3.5 py-1.5 bg-[#b73d67] text-white text-[12px] font-bold rounded-lg hover:bg-[#a33259] transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              {language === 'my' ? 'ပစ္စည်းများ ကြည့်ရှုဝယ်ယူရန်' : 'Start New Order'}
            </button>
          </div>
        )}

        <div className="my-3 border-t border-[#eedfe5]" />

        <h3 className="font-serif text-[24px] font-medium text-[#38262e] mb-3">
          {t.yourBeautyPicks}
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-3 text-[13px] py-1 border-b border-[#eedfe5]/40 last:border-0">
              <div className="flex-1 min-w-0 pr-2">
                <div className="text-[#38262e] font-medium leading-snug">
                  {item.name}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#7a6870]">
                  <span>Qty:</span>
                  <span className="font-bold text-[#b73d67] bg-[#fceef2] border border-[#f5d9e3] px-1.5 py-0.5 rounded">
                    x{item.quantity}
                  </span>
                  {item.size && (
                    <span className="text-[10.5px] text-[#7a6870] font-normal">
                      ({item.size})
                    </span>
                  )}
                </div>
              </div>
              <div className="font-bold text-[#38262e] text-right shrink-0 whitespace-nowrap pt-0.5">
                {(item.price * item.quantity).toLocaleString()} MMK
              </div>
            </div>
          ))}

          {order.discount && order.discount > 0 ? (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#7a6870]">
                  {t.discount}
                </span>
                <span className="font-bold text-[#b73d67]">
                  -{order.discount.toLocaleString()} MMK
                </span>
              </div>
            </div>
          ) : null}

          {order.deliveryFee && order.deliveryFee > 0 ? (
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#7a6870]">
                {t.delivery}
              </span>
              <span className="font-bold text-[#38262e]">
                {order.deliveryFee.toLocaleString()} MMK
              </span>
            </div>
          ) : null}
        </div>

        <div className="my-3 border-t border-[#eedfe5]" />

        <div className="flex items-baseline justify-between text-[15px] sm:text-[17px] py-1 gap-2">
          <span className="text-[#7a6870] shrink min-w-0">
            {order.paymentMethod === 'Cash on Delivery'
              ? (language === 'my' ? 'ပေးချေရမည့် စုစုပေါင်း' : 'Total to pay')
              : (language === 'my' ? 'ပေးချေပြီး စုစုပေါင်း' : 'Total paid')}
          </span>
          <span className="font-bold text-[#38262e] shrink-0 whitespace-nowrap">
            {order.total.toLocaleString()} MMK
          </span>
        </div>

        <div className="mt-4 pt-2">
          <p className="text-[13px] font-bold text-[#38262e]">
            {t.deliveringTo} {order.customerName}
          </p>
          <p className="text-[12px] text-[#7a6870] mt-0.5">
            {order.deliveryAddress}
          </p>
        </div>

        {/* Receipt Action Card (Download JPEG) */}
        <div className="mt-6 pt-5 border-t border-[#eedfe5] flex items-center justify-center print:hidden">
          <button
            onClick={handleDownloadReceipt}
            className="w-full sm:w-auto h-[46px] px-8 bg-[#b73d67] hover:bg-[#a33259] active:scale-[0.98] text-white rounded-[10px] font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{downloaded ? t.receiptDownloaded : t.downloadReceipt}</span>
          </button>
        </div>
      </section>

      {/* 4. Help & Action Buttons */}
      <section className="px-5 pt-8 flex flex-col gap-3 print:hidden">
        <Link
          href={`/order-tracking?orderId=${order.id}`}
          className="w-full h-[50px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#a33259] active:scale-[0.98] transition-all shadow-xs"
        >
          {t.viewOrderReceipt}
        </Link>

        <div className="text-center pt-2">
          <Link
            href="/shop"
            className="text-[13px] font-bold text-[#b73d67] hover:underline"
          >
            {t.backToShopping}
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="text-[12px] text-[#7a6870] hover:text-[#38262e] hover:underline"
          >
            {t.questionsHelp}
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderCardSkeleton wide />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
