'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import OrderingStepBar from '@/components/OrderingStepBar';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, clearCart, t, language } = useStore();

  const orderId = searchParams.get('orderId') || 'PC-261117-024';
  const order = orders.find((o) => o.id === orderId) || orders[0];
  const isCOD = order.paymentMethod === 'Cash on Delivery';

  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Ensure cart is cleared upon reaching confirmed order view
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const formattedDate = order.createdAt || new Date().toLocaleString();
    
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
    ctx.fillText(`Date: ${formattedDate}`, 60, y + 26);
    ctx.fillText(`Payment: ${order.paymentMethod || 'Mobile Banking'} (${t.paymentVerified})`, 60, y + 50);

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
    if ((order.discount && order.discount > 0) || order.deliveryFee > 0) {
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

      if (order.deliveryFee > 0) {
        y += 26;
        ctx.textAlign = 'left';
        ctx.fillText(t.delivery, 60, y);
        ctx.textAlign = 'right';
        ctx.fillText(`${order.deliveryFee.toLocaleString()} MMK`, canvas.width - 60, y);
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

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-5 md:py-8 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-6 sm:p-8 flex flex-col">
        {/* Step Bar */}
        <div className="mb-4 print:hidden">
          <OrderingStepBar currentStep={isCOD ? 2 : 3} isCOD={isCOD} />
        </div>

        {/* Confirmation State */}
        <section className="pt-2 flex flex-col items-center text-center">
        {/* Check disk */}
        <div className="w-[80px] h-[80px] rounded-full bg-[#fceef2] flex items-center justify-center text-[#b73d67] mb-3">
          <svg className="w-[36px] h-[36px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className={`font-serif font-medium leading-tight text-[#38262e] ${
          language === 'my'
            ? 'text-[24px] sm:text-[28px]'
            : 'text-[33px]'
        }`}>
          {t.orderConfirmedJoy}
        </h2>

        <p className="font-sans text-[14px] text-[#7a6870] mt-2 leading-relaxed max-w-[340px]">
          {order.paymentMethod === 'Cash on Delivery'
            ? (language === 'my'
                ? `ကျေးဇူးတင်ပါသည် ${order.customerName}။ သင့်အမှာစာ အတည်ပြုပြီးပါပြီ။ ပစ္စည်းရောက်ရှိချိန်တွင် ငွေအဆင်သင့် ထားရှိပေးပါခင်ဗျာ။`
                : `Thank you, ${order.customerName}. Your order is confirmed! Please have cash ready when our courier arrives.`)
            : (language === 'my'
                ? `ကျေးဇူးတင်ပါသည် ${order.customerName}။ ငွေပေးချေမှု အတည်ပြုပြီးဖြစ်၍ အမှာစာကို လက်ခံရရှိထားပါပြီ။`
                : `Thank you, ${order.customerName}. Your payment is verified and we’ve received your order.`)}
        </p>

        {/* Order reference card */}
        <div className="w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-[10px] p-4 mt-6 flex items-center justify-between text-left">
          <div>
            <span className="block text-[10px] font-bold tracking-[1.2px] text-[#7a6870] uppercase">
              {t.yourOrderRef}
            </span>
            <span className="block text-[19px] font-bold text-[#38262e] mt-0.5">
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
      </section>

      {/* 3. Order Details */}
      <section className="px-5 pt-6 flex flex-col">
        <div className="flex justify-between items-center text-[13px] py-1">
          <span className="text-[#7a6870]">{t.paymentMethod}</span>
          <span className="font-bold text-[#38262e]">
            {order.paymentMethod === 'Cash on Delivery'
              ? (language === 'my' ? 'ပစ္စည်းရောက်မှ ငွေချေမည် (COD)' : 'Cash on Delivery · Pay on arrival')
              : (language === 'my' ? `ငွေပေးချေပြီး · ${order.paymentMethod || 'မိုဘိုင်းဘဏ်'}` : `Paid · ${order.paymentMethod || 'Mobile Banking'}`)}
          </span>
        </div>

        <div className="flex justify-between items-center text-[13px] py-1">
          <span className="text-[#7a6870]">{t.orderStatus}</span>
          <span className="font-bold text-[#38262e]">
            {t.pendingReview}
          </span>
        </div>

        <div className="my-3 border-t border-[#eedfe5]" />

        <h3 className="font-serif text-[24px] font-medium text-[#38262e] mb-3">
          {t.yourBeautyPicks}
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[13px]">
              <span className="text-[#38262e] font-medium flex items-center">
                <span>{item.name}</span>
                <span className="inline-flex items-center font-bold text-[#b73d67] bg-[#fceef2] border border-[#f5d9e3] px-1.5 py-0.5 rounded text-[11px] ml-2 shrink-0">
                  x{item.quantity}
                </span>
              </span>
              <span className="font-bold text-[#38262e]">
                {(item.price * item.quantity).toLocaleString()} MMK
              </span>
            </div>
          ))}

          {order.discount && order.discount > 0 ? (
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#7a6870]">
                {t.discount}
              </span>
              <span className="font-bold text-[#b73d67]">
                -{order.discount.toLocaleString()} MMK
              </span>
            </div>
          ) : null}

          {order.deliveryFee > 0 && (
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#7a6870]">
                {t.delivery}
              </span>
              <span className="font-bold text-[#38262e]">
                {order.deliveryFee.toLocaleString()} MMK
              </span>
            </div>
          )}
        </div>

        <div className="my-3 border-t border-[#eedfe5]" />

        <div className="flex justify-between items-center text-[17px] py-1">
          <span className="text-[#7a6870]">
            {order.paymentMethod === 'Cash on Delivery'
              ? (language === 'my' ? 'ပေးချေရမည့် စုစုပေါင်း' : 'Total to pay')
              : (language === 'my' ? 'ပေးချေပြီး စုစုပေါင်း' : 'Total paid')}
          </span>
          <span className="font-bold text-[#38262e]">
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

        <p className="text-[11px] text-center text-[#7a6870]">
          {t.saveOrderIdHint}
        </p>

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
    <Suspense fallback={<div className="p-8 text-center text-[#7a6870]">Loading confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
