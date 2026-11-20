'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import OrderingStepBar from '@/components/OrderingStepBar';

function PaymentPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, updatePaymentStatus } = useStore();

  const orderId = searchParams.get('orderId') || 'PC-261117-024';
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mockPaymentSuccess, setMockPaymentSuccess] = useState(false);

  const handleSimulatePaymentGateway = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmGatewayPayment = () => {
    setMockPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      updatePaymentStatus(order.id, 'paid');
      router.push(`/order-confirmation?orderId=${order.id}`);
    }, 1000);
  };

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

        <h2 className="font-serif text-[34px] font-medium leading-tight text-[#38262e]">
          One last little step.
        </h2>

        <p className="font-sans text-[14px] text-[#7a6870] mt-2 leading-relaxed">
          Complete your payment securely<br />with {order.paymentMethod || 'MyanMyanPay'}.
        </p>

        {/* Provider Payment Card (2:365) */}
        <div className="w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-[12px] p-5 mt-5 flex flex-col items-center">
          <span className="font-sans text-[21px] font-bold text-[#38262e]">
            {order.paymentMethod || 'MyanMyanPay'}
          </span>
          <span className="text-[10px] font-bold tracking-[1.5px] text-[#7a6870] uppercase mt-3">
            TOTAL TO PAY
          </span>
          <span className="font-sans text-[30px] font-bold text-[#b73d67] mt-1">
            {order.total.toLocaleString()} MMK
          </span>
          <span className="text-[12px] text-[#7a6870] mt-1.5 font-medium">
            Order {order.id}
          </span>
        </div>

        {/* Open Secure Payment Page CTA (2:370) */}
        <button
          onClick={handleSimulatePaymentGateway}
          className="w-full h-[50px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] mt-4 hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-xs cursor-pointer"
        >
          Open secure payment page ↗
        </button>

        {/* Help & Recovery */}
        <div className="w-full pt-5 border-t border-[#eedfe5]/70 flex flex-col items-center text-center mt-6">
          <p className="text-[12px] text-[#7a6870] leading-relaxed">
            Need help or page didn’t open? Contact us with order reference <span className="font-mono font-bold text-[#38262e]">{order.id}</span>.
          </p>
          <Link
            href="/contact"
            className="text-[12px] font-bold text-[#b73d67] hover:underline mt-1.5 inline-block"
          >
            Need help? Contact Pretty Corner
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
            <h4 className="font-serif text-[22px] font-medium text-[#38262e]">
              MyanMyanPay Gateway
            </h4>
            <p className="text-[12px] text-[#7a6870] mt-1">
              Simulating secured checkout for {order.id}
            </p>
            <div className="my-4 bg-[#f9f5f7] p-3 rounded-[10px] text-left text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#7a6870]">Merchant:</span>
                <span className="font-bold text-[#38262e]">Pretty Corner</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a6870]">Amount:</span>
                <span className="font-bold text-[#b73d67]">{order.total.toLocaleString()} MMK</span>
              </div>
            </div>

            {mockPaymentSuccess ? (
              <div className="text-[13px] font-bold text-[#3b775d] py-3">
                ✓ Payment Authorized Successfully!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConfirmGatewayPayment}
                  className="w-full h-[46px] bg-[#3b775d] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#2f614a]"
                >
                  Confirm & Pay {order.total.toLocaleString()} MMK
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full h-[40px] text-[#7a6870] text-[13px] hover:text-[#38262e]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7a6870]">Loading payment...</div>}>
      <PaymentPendingContent />
    </Suspense>
  );
}
