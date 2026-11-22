'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import OrderingStepBar from '@/components/OrderingStepBar';

function PaymentPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, updatePaymentStatus, fetchOrderById, isMounted, t, language } = useStore();

  const orderId = searchParams.get('orderId') || '';
  const cleanId = orderId.trim().toUpperCase();
  const localOrder = cleanId ? orders.find((o) => o.id.trim().toUpperCase() === cleanId) : undefined;

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

  const activeOrder = localOrder || remoteOrder;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mockPaymentSuccess, setMockPaymentSuccess] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  const handleOpenPaymentGateway = async () => {
    const pubKey = process.env.NEXT_PUBLIC_MMPAY_PUBLISHABLE_KEY;
    const targetId = activeOrder?.id || cleanId;
    const amountToPay = activeOrder?.total ?? 0;

    if (pubKey && typeof window !== 'undefined') {
      try {
        setIsInitializingPayment(true);
        const { MMPaySDK } = await import('mmpay-browser-sdk');
        const mmpay = new MMPaySDK(pubKey, {
          merchantName: 'Pretty Corner',
          environment: 'sandbox',
          design: {
            mode: 'light',
            color: '#b73d67',
          },
        });

        await mmpay.showPaymentModal(
          {
            orderId: targetId,
            amount: amountToPay,
            nonce: Date.now().toString(),
            callbackUrl: 'https://pretty-corner.vercel.app/api/payment/webhook',
          },
          (result) => {
            if (result.success) {
              updatePaymentStatus(targetId, 'paid');
              router.push(`/order-confirmation?orderId=${targetId}`);
            }
          }
        );
        setIsInitializingPayment(false);
        return;
      } catch (err) {
        console.warn('MyanMyanPay SDK modal failed, using standard modal:', err);
        setIsInitializingPayment(false);
      }
    }

    // Fallback if keys are not set yet or SDK modal is bypassed
    setShowPaymentModal(true);
  };

  const handleConfirmGatewayPayment = () => {
    setMockPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      const targetId = activeOrder?.id || cleanId;
      updatePaymentStatus(targetId, 'paid');
      router.push(`/order-confirmation?orderId=${targetId}`);
    }, 1000);
  };

  if (!isMounted || remoteLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#b73d67] border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentId = activeOrder?.id || cleanId;
  const paymentMethod = activeOrder?.paymentMethod || 'Mobile Banking';
  const totalAmount = activeOrder?.total ?? 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-5 md:py-8 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-6 sm:p-8 flex flex-col">
        {/* Step indicator */}
        <div className="mb-4">
          <OrderingStepBar currentStep={2} />
        </div>

        {/* Payment Instructions */}
        <section className="pt-4 flex flex-col items-center text-center">
        {/* Lock disk */}
        <div className="w-[72px] h-[72px] rounded-full bg-[#fceef2] flex items-center justify-center text-[#b73d67] mb-4">
          <svg className="w-[28px] h-[28px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        <h2 className={`font-serif font-medium leading-tight text-[#38262e] ${
          language === 'my'
            ? 'text-[25px] sm:text-[29px]'
            : 'text-[34px]'
        }`}>
          {t.oneLastStep}
        </h2>

        <p className="font-sans text-[14px] text-[#7a6870] mt-2 leading-relaxed">
          {t.completePaymentSecurely}<br />{paymentMethod || 'MMQR'}.
        </p>

        {/* Provider Payment Card */}
        <div className="w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-[12px] p-5 mt-5 flex flex-col items-center">
          <span className="font-sans text-[21px] font-bold text-[#38262e]">
            {paymentMethod || 'Mobile Banking'}
          </span>
          <span className="text-[10px] font-bold tracking-[1.5px] text-[#7a6870] uppercase mt-3">
            {t.totalToPay}
          </span>
          <span className="font-sans text-[30px] font-bold text-[#b73d67] mt-1">
            {totalAmount.toLocaleString()} MMK
          </span>
          <span className="text-[12px] text-[#7a6870] mt-1.5 font-medium">
            {t.orderRef}: {currentId}
          </span>
        </div>

        {/* Open Secure Payment Page CTA */}
        <button
          onClick={handleOpenPaymentGateway}
          disabled={isInitializingPayment}
          className="w-full h-[50px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] mt-4 hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-75"
        >
          {isInitializingPayment ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Connecting to MyanMyanPay...</span>
            </>
          ) : (
            t.openPaymentPage
          )}
        </button>

        {/* Help & Recovery */}
        <div className="w-full pt-5 border-t border-[#eedfe5]/70 flex flex-col items-center text-center mt-6">
          <p className="text-[12px] text-[#7a6870] leading-relaxed">
            {t.needHelpPayment} <span className="font-mono font-bold text-[#38262e]">{currentId}</span>.
          </p>
          <Link
            href="/contact"
            className="text-[12px] font-bold text-[#b73d67] hover:underline mt-1.5 inline-block"
          >
            {t.questionsContact}
          </Link>
        </div>
      </section>

      {/* Payment Gateway Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-[20px] p-6 shadow-2xl flex flex-col text-center">
            <div className="w-12 h-12 rounded-full bg-[#fceef2] text-[#b73d67] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="inline-block mx-auto mb-1 px-2.5 py-0.5 bg-[#fceef2] text-[#b73d67] text-[11px] font-bold rounded-full uppercase tracking-wider">
              MyanMyanPay Sandbox
            </div>
            <h3 className="font-serif text-[22px] font-bold text-[#38262e] mb-1">
              MMQR Payment
            </h3>
            <p className="text-[13px] text-[#7a6870] mb-3">
              {language === 'my'
                ? 'KBZPay, WavePay, AYA Pay သို့မဟုတ် CB Pay ဖြင့် ပေးချေနိုင်ပါသည်။'
                : 'Supports KBZPay, WavePay, AYA Pay, CB Pay and any MMQR app.'}
            </p>

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-2 py-1 bg-[#002f6c]/10 text-[#002f6c] text-[11px] font-bold rounded">KBZPay</span>
              <span className="px-2 py-1 bg-[#fcd116]/30 text-[#856404] text-[11px] font-bold rounded">WavePay</span>
              <span className="px-2 py-1 bg-[#ed1b24]/10 text-[#ed1b24] text-[11px] font-bold rounded">AYA Pay</span>
              <span className="px-2 py-1 bg-[#005ba4]/10 text-[#005ba4] text-[11px] font-bold rounded">CB Pay</span>
            </div>

            <div className="bg-[#faf7f8] rounded-xl p-3 mb-5 border border-[#eedfe5]">
              <span className="text-[11px] text-[#7a6870] block">
                {language === 'my' ? 'လွှဲပြောင်းရမည့်ငွေ' : 'Amount to transfer'}
              </span>
              <span className="font-bold text-[20px] text-[#b73d67]">
                {totalAmount.toLocaleString()} MMK
              </span>
            </div>

            {mockPaymentSuccess ? (
              <div className="h-[46px] bg-emerald-50 text-emerald-700 font-bold text-[14px] rounded-[10px] flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-in zoom-in-75 duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t.paymentAuthorized}
              </div>
            ) : (
              <button
                onClick={handleConfirmGatewayPayment}
                className="w-full h-[46px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all flex items-center justify-center shadow-xs cursor-pointer"
              >
                {language === 'my' ? 'ငွေပေးချေပြီးပြီ (Simulate)' : 'Simulate Successful Payment'}
              </button>
            )}

            <button
              disabled={mockPaymentSuccess}
              onClick={() => setShowPaymentModal(false)}
              className="mt-3 text-[13px] text-[#7a6870] hover:text-[#38262e] font-medium disabled:opacity-50"
            >
              {language === 'my' ? 'မလုပ်တော့ပါ' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7a6870]">Loading payment status...</div>}>
      <PaymentPendingContent />
    </Suspense>
  );
}
