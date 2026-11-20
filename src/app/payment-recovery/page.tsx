'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentRecoveryPage() {
  const router = useRouter();
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCheckStatus = () => {
    setCheckingStatus(true);
    setTimeout(() => {
      setCheckingStatus(false);
      setStatusMessage('Order PC-261117-020: Transaction was declined by provider. You can safely try again.');
    }, 1000);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-5 md:py-10 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-6 sm:p-8 flex flex-col">
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-4">
          <Link href="/" className="hover:text-[#38262e]">Home</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">Payment Recovery</span>
        </div>

        {/* Page Details */}
        <div className="flex flex-col gap-5">
          <button
            onClick={() => router.back()}
            className="text-[12px] font-bold text-[#b73d67] hover:underline text-left cursor-pointer"
          >
            Back
          </button>

        <div>
          <h2 className="font-serif text-[30px] font-medium text-[#38262e]">
            Let’s sort your payment.
          </h2>
          <p className="text-[13px] text-[#7a6870] mt-1 font-medium">
            Payment recovery states · MyanMyanPay
          </p>
        </div>

        {/* Failed Payment State Card (35:1294) */}
        <div className="bg-[#fceef2] rounded-[10px] p-5 flex flex-col gap-3">
          <h3 className="font-serif text-[24px] font-medium text-[#38262e]">
            Payment unsuccessful
          </h3>
          <p className="text-[13px] font-bold text-[#38262e]">
            PC-261117-020 · 31,000 MMK
          </p>
          <p className="text-[14px] text-[#7a6870] leading-relaxed">
            We couldn’t confirm a successful payment. Check the latest status before starting another attempt.
          </p>

          {statusMessage && (
            <div className="bg-white p-3 rounded-[8px] text-[12px] text-[#38262e] border border-[#eedfe5]">
              {statusMessage}
            </div>
          )}

          <button
            onClick={handleCheckStatus}
            disabled={checkingStatus}
            className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all flex items-center justify-center shadow-xs mt-1"
          >
            {checkingStatus ? 'Checking provider records...' : 'Check latest status'}
          </button>

          <Link
            href="/checkout"
            className="w-full h-[46px] bg-white border border-[#eedfe5] text-[#b73d67] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#fcf9fa] transition-colors"
          >
            Retry after failure is confirmed
          </Link>
        </div>

        {/* Expired Payment State Card (35:1302) */}
        <div className="bg-[#f9f5f7] rounded-[10px] p-5 flex flex-col gap-3">
          <h3 className="font-serif text-[24px] font-medium text-[#38262e]">
            Payment link expired
          </h3>
          <p className="text-[14px] text-[#7a6870] leading-relaxed">
            Your order has not been marked paid. We’ll recheck prices and available stock before offering a new payment request.
          </p>

          <Link
            href="/bag"
            className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-all flex items-center justify-center shadow-xs"
          >
            Review order & try again
          </Link>
        </div>

        {/* Already Charged? Section (35:1307) */}
        <div className="pt-2">
          <h3 className="font-serif text-[22px] font-medium text-[#38262e]">
            Already charged?
          </h3>
          <p className="text-[14px] text-[#7a6870] leading-relaxed mt-2">
            Don’t pay again while a transaction is unresolved. Contact Pretty Corner with your order reference so the payment can be checked.
          </p>
          <Link
            href="/contact"
            className="w-full mt-4 h-[46px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] flex items-center justify-center hover:bg-[#f6e1e8] transition-colors"
          >
            Get payment help
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
