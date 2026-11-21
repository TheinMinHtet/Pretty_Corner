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

  const orderId = searchParams.get('orderId') || 'PC-261117-024';
  const cleanId = orderId.trim().toUpperCase();
  const localOrder = orders.find((o) => o.id.trim().toUpperCase() === cleanId) || orders[0];

  const [remoteOrder, setRemoteOrder] = useState<typeof localOrder | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);

  useEffect(() => {
    if (!localOrder && cleanId && fetchOrderById) {
      setRemoteLoading(true);
      fetchOrderById(cleanId)
        .then((res) => {
          if (res) setRemoteOrder(res);
          setRemoteLoading(false);
        })
        .catch(() => setRemoteLoading(false));
    }
  }, [localOrder, cleanId, fetchOrderById]);

  const activeOrder = localOrder || remoteOrder;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mockPaymentSuccess, setMockPaymentSuccess] = useState(false);

  const handleSimulatePaymentGateway = () => {
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
          {t.completePaymentSecurely}<br />{paymentMethod || 'KBZPay, WavePay'}.
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
          onClick={handleSimulatePaymentGateway}
          className="w-full h-[50px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] mt-4 hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-xs cursor-pointer"
        >
          {t.openPaymentPage}
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
          <div className="w-full max-w-[360px] bg-white rounded-[20px] p-6 shadow-2xl flex flex-col text-center">
            <div className="w-12 h-12 rounded-full bg-[#fceef2] text-[#b73d67] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3 className="font-serif text-[22px] font-bold text-[#38262e] mb-1">
              {paymentMethod || 'Mobile Banking'}
            </h3>
            <p className="text-[13px] text-[#7a6870] mb-4">
              {language === 'my'
                ? 'ငွေပေးချေမှုပုံစံတူစနစ် ဖြစ်ပါသည်။ စမ်းသပ်ရန် အောက်ပါခလုတ်ကို နှိပ်ပါ။'
                : 'Demo Payment Gateway. Click below to simulate completing the transfer.'}
            </p>
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
                <svg className="w-5 h-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t.paymentAuthorized}
              </div>
            ) : (
              <button
                onClick={handleConfirmGatewayPayment}
                className="w-full h-[46px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all flex items-center justify-center shadow-xs cursor-pointer"
              >
                {language === 'my' ? 'ငွေပေးချေပြီးပြီ' : 'Simulate Successful Payment'}
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
