'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';
import { useStore } from '@/context/StoreContext';
import OrderingStepBar from '@/components/OrderingStepBar';
import SlideToConfirm from '@/components/SlideToConfirm';

if (typeof window !== 'undefined') {
  (window as any).QRCode = QRCode;
}

function PaymentPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, updatePaymentStatus, fetchOrderById, isMounted, t, language, cancelOrder, clearCart } = useStore();

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
  const [showSlideConfirmModal, setShowSlideConfirmModal] = useState(false);
  const [mockPaymentSuccess, setMockPaymentSuccess] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes (300s)

  // 02: State Caching - cache payment session in sessionStorage & localStorage
  const cachePaymentSession = useCallback(() => {
    if (typeof window !== 'undefined' && cleanId) {
      try {
        sessionStorage.setItem(
          `pretty_corner_mmpay_active_${cleanId}`,
          JSON.stringify({ active: true, orderId: cleanId, timestamp: Date.now() })
        );
      } catch {}
    }
  }, [cleanId]);

  const clearPaymentSession = useCallback(() => {
    if (typeof window !== 'undefined' && cleanId) {
      try {
        sessionStorage.removeItem(`pretty_corner_mmpay_active_${cleanId}`);
        const cachedTx = localStorage.getItem('mmpay_pending_tx');
        if (cachedTx) {
          const parsed = JSON.parse(cachedTx);
          if (parsed.payload?.orderId?.trim().toUpperCase() === cleanId) {
            localStorage.removeItem('mmpay_pending_tx');
          }
        }
      } catch {}
    }
  }, [cleanId]);

  const autoResumedRef = useRef(false);

  // 5-Minute MMQR Payment Countdown Timer
  useEffect(() => {
    if (!cleanId || activeOrder?.paymentStatus === 'paid' || activeOrder?.paymentStatus === 'cancelled' || activeOrder?.paymentStatus === 'expired') {
      return;
    }

    let expireAt = Date.now() + 300000;
    try {
      const cachedTx = localStorage.getItem('mmpay_pending_tx');
      if (cachedTx) {
        const p = JSON.parse(cachedTx);
        if (p.expireAt) expireAt = p.expireAt;
      } else if (activeOrder?.createdAt) {
        const createdMs = new Date(activeOrder.createdAt).getTime();
        if (!isNaN(createdMs)) {
          expireAt = createdMs + 300000;
        }
      }
    } catch {}

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expireAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        clearPaymentSession();
        updatePaymentStatus(cleanId, 'expired');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cleanId, activeOrder?.paymentStatus, activeOrder?.createdAt, clearPaymentSession, updatePaymentStatus]);

  // 02: State Caching - Auto-resume active QR and continuing countdown on page refresh
  useEffect(() => {
    if (typeof window === 'undefined' || !cleanId || activeOrder?.paymentStatus === 'paid' || activeOrder?.paymentStatus === 'cancelled') return;
    const pubKey = process.env.NEXT_PUBLIC_MMPAY_PUBLISHABLE_KEY;
    if (!pubKey || autoResumedRef.current) return;

    try {
      const cachedTx = localStorage.getItem('mmpay_pending_tx');
      if (cachedTx) {
        const parsed = JSON.parse(cachedTx);
        const isCurrentOrder = parsed.payload?.orderId?.trim().toUpperCase() === cleanId;
        const isStillValid = Date.now() < (parsed.expireAt || 0);

        if (isCurrentOrder && isStillValid) {
          autoResumedRef.current = true;
          void (async () => {
            try {
              (window as any).QRCode = QRCode;
              document.querySelectorAll('#mmpay-full-modal').forEach((el) => el.remove());

              const { MMPaySDK } = await import('mmpay-browser-sdk');
              const mmpay = new MMPaySDK(pubKey, {
                merchantName: 'Pretty Corner',
                environment: 'sandbox',
                design: {
                  mode: 'light',
                  color: '#b73d67',
                },
              });

              (mmpay as any).onCompleteCallback = (result: any) => {
                if (result.success) {
                  try { localStorage.removeItem('mmpay_pending_tx'); } catch {}
                  clearPaymentSession();
                  clearCart();
                  updatePaymentStatus(cleanId, 'paid');
                  router.push(`/order-confirmation?orderId=${cleanId}`);
                } else if (result.cancelled) {
                  try { localStorage.removeItem('mmpay_pending_tx'); } catch {}
                  clearPaymentSession();
                  cancelOrder(cleanId);
                } else if (result.expired) {
                  try { localStorage.removeItem('mmpay_pending_tx'); } catch {}
                  clearPaymentSession();
                  updatePaymentStatus(cleanId, 'expired');
                }
              };

              // Reinforce: sync visible timer and QR canvas immediately
              setTimeout(async () => {
                const timerEl = document.getElementById('mmpay-countdown-text');
                if (timerEl && parsed.expireAt) {
                  const remaining = Math.max(0, Math.floor((parsed.expireAt - Date.now()) / 1000));
                  const minutes = Math.floor(remaining / 60);
                  const seconds = remaining % 60;
                  timerEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
                const qrBox = document.getElementById('mmpayQrContainerBox');
                if (qrBox && parsed.apiResponse?.qr && !qrBox.querySelector('canvas') && !qrBox.querySelector('img')) {
                  qrBox.innerHTML = '';
                  const canvas = document.createElement('canvas');
                  qrBox.appendChild(canvas);
                  await QRCode.toCanvas(canvas, parsed.apiResponse.qr, {
                    width: 290,
                    margin: 1,
                    color: { dark: '#000000', light: '#ffffff' },
                    errorCorrectionLevel: 'M',
                  });
                }
              }, 100);
            } catch (err) {
              console.warn('Failed to auto-resume pending payment modal:', err);
            }
          })();
        } else if (isCurrentOrder && !isStillValid) {
          localStorage.removeItem('mmpay_pending_tx');
        }
      }
    } catch {}
  }, [cleanId, activeOrder?.paymentStatus, clearPaymentSession, updatePaymentStatus, router, cancelOrder]);

  // 01: Seamless Transitions - auto-detect payment upon returning from banking app & background polling
  useEffect(() => {
    if (!cleanId || activeOrder?.paymentStatus === 'paid' || activeOrder?.paymentStatus === 'cancelled') return;

    let isPolling = true;

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(cleanId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.paymentStatus === 'paid') {
            clearCart();
            updatePaymentStatus(cleanId, 'paid');
            clearPaymentSession();
            router.push(`/order-confirmation?orderId=${encodeURIComponent(cleanId)}`);
            return true;
          } else if (data.paymentStatus === 'cancelled') {
            cancelOrder(cleanId);
            clearPaymentSession();
            return true;
          }
        }
      } catch {}
      return false;
    };

    // Listen to tab visibility & window focus (when customer returns from mobile banking app)
    const onVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        void checkPaymentStatus();
      }
    };

    window.addEventListener('visibilitychange', onVisibilityOrFocus);
    window.addEventListener('focus', onVisibilityOrFocus);

    // Periodic gentle background poll every 3.5 seconds
    const interval = setInterval(async () => {
      if (!isPolling) return;
      const done = await checkPaymentStatus();
      if (done) {
        isPolling = false;
        clearInterval(interval);
      }
    }, 3500);

    return () => {
      isPolling = false;
      clearInterval(interval);
      window.removeEventListener('visibilitychange', onVisibilityOrFocus);
      window.removeEventListener('focus', onVisibilityOrFocus);
    };
  }, [cleanId, router, updatePaymentStatus, clearPaymentSession, activeOrder?.paymentStatus]);

  // 04: Duplicate Prevention - warning on accidental refresh during active payment initialization
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      let hasActivePending = false;
      if (typeof window !== 'undefined') {
        try {
          const tx = localStorage.getItem('mmpay_pending_tx');
          if (tx) {
            const p = JSON.parse(tx);
            if (p.payload?.orderId?.trim().toUpperCase() === cleanId && Date.now() < (p.expireAt || 0)) {
              hasActivePending = true;
            }
          }
        } catch {}
      }
      if (isInitializingPayment || showPaymentModal || hasActivePending) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cleanId, isInitializingPayment, showPaymentModal]);

  const handleOpenPaymentGateway = async () => {
    const pubKey = process.env.NEXT_PUBLIC_MMPAY_PUBLISHABLE_KEY;
    const targetId = activeOrder?.id || cleanId;
    const amountToPay = activeOrder?.total ?? 0;

    cachePaymentSession();

    if (pubKey && typeof window !== 'undefined') {
      try {
        setIsInitializingPayment(true);
        (window as any).QRCode = QRCode;
        document.querySelectorAll('#mmpay-full-modal').forEach((el) => el.remove());

        const { MMPaySDK } = await import('mmpay-browser-sdk');

        // Rule 02 & 03: Check if valid unexpired transaction instance exists to prevent duplicate request
        const cachedRaw = localStorage.getItem('mmpay_pending_tx');
        let activeCache: any = null;
        if (cachedRaw) {
          try {
            const parsed = JSON.parse(cachedRaw);
            if (
              parsed.payload?.orderId?.trim().toUpperCase() === targetId.trim().toUpperCase() &&
              Date.now() < (parsed.expireAt || 0)
            ) {
              activeCache = parsed;
            }
          } catch {}
        }

        const mmpay = new MMPaySDK(pubKey, {
          merchantName: 'Pretty Corner',
          environment: 'sandbox',
          design: {
            mode: 'light',
            color: '#b73d67',
          },
        });

        const handleSDKResult = (result: any) => {
          if (result.created) {
            // Save state to localStorage for seamless refresh recovery (Rule 02)
            try {
              const pendingPayload = (mmpay as any).pendingPaymentPayload;
              const pendingApiResponse = (mmpay as any).pendingApiResponse;
              const token = (mmpay as any).api?.getToken();
              if (pendingPayload && pendingApiResponse) {
                localStorage.setItem(
                  'mmpay_pending_tx',
                  JSON.stringify({
                    payload: pendingPayload,
                    apiResponse: pendingApiResponse,
                    expireAt: Date.now() + 300000,
                    token: token,
                    environment: (mmpay as any).environment || 'sandbox',
                  })
                );
              }
            } catch {}
          } else if (result.success) {
            try { localStorage.removeItem('mmpay_pending_tx'); } catch {}
            clearPaymentSession();
            clearCart();
            updatePaymentStatus(targetId, 'paid');
            router.push(`/order-confirmation?orderId=${targetId}`);
          } else if (result.cancelled) {
            try { localStorage.removeItem('mmpay_pending_tx'); } catch {}
            clearPaymentSession();
            cancelOrder(targetId);
          } else if (result.expired) {
            try { localStorage.removeItem('mmpay_pending_tx'); } catch {}
            clearPaymentSession();
            updatePaymentStatus(targetId, 'expired');
          } else if (result.failed) {
            setIsInitializingPayment(false);
            setShowPaymentModal(true);
          }
        };

        (mmpay as any).onCompleteCallback = handleSDKResult;

        if (activeCache) {
          // Constructor already auto-resumes cached modal. Sync display immediately:
          setTimeout(async () => {
            const timerEl = document.getElementById('mmpay-countdown-text');
            if (timerEl && activeCache.expireAt) {
              const remaining = Math.max(0, Math.floor((activeCache.expireAt - Date.now()) / 1000));
              const minutes = Math.floor(remaining / 60);
              const seconds = remaining % 60;
              timerEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            const qrBox = document.getElementById('mmpayQrContainerBox');
            if (qrBox && activeCache.apiResponse?.qr && !qrBox.querySelector('canvas') && !qrBox.querySelector('img')) {
              qrBox.innerHTML = '';
              const canvas = document.createElement('canvas');
              qrBox.appendChild(canvas);
              await QRCode.toCanvas(canvas, activeCache.apiResponse.qr, {
                width: 290,
                margin: 1,
                color: { dark: '#000000', light: '#ffffff' },
                errorCorrectionLevel: 'M',
              });
            }
          }, 100);
        } else {
          await mmpay.showPaymentModal(
            {
              orderId: targetId,
              amount: amountToPay,
              nonce: Date.now().toString(),
              callbackUrl: 'https://pretty-corner.vercel.app/api/payment/webhook',
            },
            handleSDKResult
          );

          // Safeguard: ensure created transaction is cached for continuous timer and refresh restoration
          try {
            const pendingPayload = (mmpay as any).pendingPaymentPayload;
            const pendingApiResponse = (mmpay as any).pendingApiResponse;
            const token = (mmpay as any).api?.getToken();
            if (pendingPayload && pendingApiResponse) {
              localStorage.setItem(
                'mmpay_pending_tx',
                JSON.stringify({
                  payload: pendingPayload,
                  apiResponse: pendingApiResponse,
                  expireAt: Date.now() + 300000,
                  token: token,
                  environment: (mmpay as any).environment || 'sandbox',
                })
              );
            }
          } catch {}
        }

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
    setShowPaymentModal(false);
    setShowSlideConfirmModal(true);
  };

  // 03: Transaction Control - Explicit cancellation handler
  const handleConfirmCancelOrder = () => {
    clearPaymentSession();
    cancelOrder(cleanId);
    clearCart();
    setShowCancelModal(false);
    router.push('/shop');
  };

  if (!isMounted || remoteLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#b73d67] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!cleanId && !activeOrder) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <h3 className="font-serif text-[22px] font-bold text-[#38262e] mb-2">
          {language === 'my' ? 'အမှာစာ မတွေ့ရှိပါ' : 'No Order Specified'}
        </h3>
        <p className="text-[13px] text-[#7a6870] mb-6">
          {language === 'my' ? 'ကျေးဇူးပြု၍ ပစ္စည်းများ ရွေးချယ်ပြီး အမှာစာ အသစ်ပြုလုပ်ပေးပါရန်။' : 'Please select products and checkout to initiate payment.'}
        </p>
        <Link href="/shop" className="inline-flex h-[44px] px-6 bg-[#b73d67] text-white rounded-lg items-center font-bold text-[14px] hover:bg-[#a33259] transition-colors">
          {t.startShopping}
        </Link>
      </div>
    );
  }

  // Handle explicitly cancelled order view
  if (activeOrder?.paymentStatus === 'cancelled') {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h3 className="font-serif text-[22px] font-bold text-[#38262e] mb-2">
          {language === 'my' ? 'အမှာစာ တောင်းဆိုမှု ပယ်ဖျက်ပြီးပါပြီ' : 'Order Request Cancelled'}
        </h3>
        <p className="text-[13px] text-[#7a6870] mb-6">
          {language === 'my'
            ? `အမှာစာနံပါတ် ${cleanId} ကို ပယ်ဖျက်ထားပါသည်။ ပစ္စည်းများ ပြန်လည်ရွေးချယ်ပြီး အသစ်မှာယူနိုင်ပါသည်။`
            : `Order #${cleanId} has been cancelled. You can edit your bag or start a new order.`}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              clearCart();
              router.push('/shop');
            }}
            className="w-full sm:w-auto inline-flex h-[44px] px-6 bg-[#b73d67] text-white rounded-lg items-center justify-center font-bold text-[14px] hover:bg-[#a33259] transition-colors cursor-pointer shadow-xs"
          >
            {language === 'my' ? 'ပစ္စည်းများ ကြည့်ရှုဝယ်ယူရန်' : 'Start New Order'}
          </button>
          <Link
            href="/bag"
            className="w-full sm:w-auto inline-flex h-[44px] px-6 bg-white border border-[#eedfe5] text-[#38262e] rounded-lg items-center justify-center font-bold text-[14px] hover:bg-[#faf7f8] transition-colors cursor-pointer"
          >
            {language === 'my' ? 'စျေးဝယ်အိတ် ပြင်ဆင်မည်' : 'Edit Bag'}
          </Link>
        </div>
      </div>
    );
  }

  // Handle expired order view (5-minute timer elapsed)
  if (activeOrder?.paymentStatus === 'expired') {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3 className="font-serif text-[22px] font-bold text-[#38262e] mb-2">
          {language === 'my' ? 'အချိန်ပြည့် သက်တမ်းကုန်ဆုံးပါပြီ' : 'Payment Time Expired'}
        </h3>
        <p className="text-[13px] text-[#7a6870] mb-6">
          {language === 'my'
            ? `၅ မိနစ်အတွင်း ငွေပေးချေမှု မပြီးမြောက်ခဲ့သဖြင့် အမှာစာနံပါတ် ${cleanId} ၏ သက်တမ်းကုန်ဆုံးသွားပါသည်။`
            : `The 5-minute payment window for order #${cleanId} has expired. Please place a new order.`}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              clearCart();
              router.push('/shop');
            }}
            className="w-full sm:w-auto inline-flex h-[44px] px-6 bg-[#b73d67] text-white rounded-lg items-center justify-center font-bold text-[14px] hover:bg-[#a33259] transition-colors cursor-pointer shadow-xs"
          >
            {language === 'my' ? 'ပစ္စည်းများ ပြန်လည်မှာယူရန်' : 'Start New Order'}
          </button>
          <Link
            href="/bag"
            className="w-full sm:w-auto inline-flex h-[44px] px-6 bg-white border border-[#eedfe5] text-[#38262e] rounded-lg items-center justify-center font-bold text-[14px] hover:bg-[#faf7f8] transition-colors cursor-pointer"
          >
            {language === 'my' ? 'စျေးဝယ်အိတ် ကြည့်ရှုမည်' : 'View Bag'}
          </Link>
        </div>
      </div>
    );
  }

  const currentId = activeOrder?.id || cleanId;
  const paymentMethod = activeOrder?.paymentMethod || 'MMQR';
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

          {/* 5-minute Countdown Timer */}
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-[12px] font-semibold">
            <svg className="w-3.5 h-3.5 animate-pulse text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              {language === 'my' ? 'ငွေပေးချေရန် ကျန်အချိန်:' : 'Time remaining:'}{' '}
              <span className="font-mono font-bold">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </span>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-[#eedfe5]/70 w-full flex items-center justify-center gap-1.5 text-[11px] text-[#7a6870]">
            <svg className="w-3.5 h-3.5 text-[#b73d67] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        {/* Slide to Confirm Button for fast mobile confirmation */}
        <button
          type="button"
          onClick={() => setShowSlideConfirmModal(true)}
          className="w-full h-[46px] bg-[#38262e] text-white rounded-[10px] font-bold text-[13px] mt-2.5 hover:bg-[#281b21] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>{language === 'my' ? 'ငွေပေးချေပြီးကြောင်း အတည်ပြုမည်' : 'Slide to Confirm Payment'}</span>
        </button>

        {/* 03: Transaction Control - Explicit Cancel Order Request Button */}
        <div className="w-full mt-3 flex items-center justify-center">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-[12px] text-[#7a6870] hover:text-red-700 underline font-medium transition-colors cursor-pointer py-1"
          >
            {language === 'my' ? 'ဤအမှာစာ တောင်းဆိုမှုကို ပယ်ဖျက်မည်' : 'Cancel this active order request'}
          </button>
        </div>

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

      {/* 03: Transaction Control - Confirmation Modal for Order Cancellation */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[360px] bg-white rounded-[20px] p-6 shadow-2xl flex flex-col text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="font-serif text-[20px] font-bold text-[#38262e] mb-2">
              {language === 'my' ? 'အမှာစာ ပယ်ဖျက်ရန် သေချာပါသလား?' : 'Cancel Active Order Request?'}
            </h3>
            <p className="text-[13px] text-[#7a6870] mb-5 leading-relaxed">
              {language === 'my'
                ? `အမှာစာ #${cleanId} ကို ပယ်ဖျက်ပြီး ပစ္စည်းများ ပြန်လည်ပြင်ဆင်နိုင်ရန် ပို့ဆောင်ပေးပါမည်။`
                : `This will safely cancel order #${cleanId} and allow you to edit your bag or start a new order.`}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirmCancelOrder}
                className="w-full h-[44px] bg-red-600 text-white rounded-[10px] font-bold text-[14px] hover:bg-red-700 transition-colors cursor-pointer"
              >
                {language === 'my' ? 'ဟုတ်ကဲ့၊ အမှာစာ ပယ်ဖျက်မည်' : 'Yes, Cancel Order Request'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full h-[40px] text-[13px] text-[#7a6870] hover:text-[#38262e] font-semibold"
              >
                {language === 'my' ? 'မပယ်ဖျက်တော့ပါ' : 'Keep Order & Return'}
              </button>
            </div>
          </div>
        </div>
      )}

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
              onClick={() => {
                setShowPaymentModal(false);
                clearPaymentSession();
              }}
              className="mt-3 text-[13px] text-[#7a6870] hover:text-[#38262e] font-medium disabled:opacity-50 cursor-pointer"
            >
              {language === 'my' ? 'မလုပ်တော့ပါ' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Mobile-first draggable confirmation modal for MMQR */}
      {showSlideConfirmModal && (
        <SlideToConfirm
          amount={totalAmount}
          currency="MMK"
          title="ORDER CONFIRMATION"
          subtitle="Total amount"
          promptText="Slide to confirm order"
          cancelText="Cancel Order"
          onConfirm={async () => {
            clearPaymentSession();
            clearCart();
            const targetId = activeOrder?.id || cleanId;
            updatePaymentStatus(targetId, 'paid');
            setShowSlideConfirmModal(false);
            router.push(`/order-confirmation?orderId=${encodeURIComponent(targetId)}`);
          }}
          onCancel={() => {
            clearPaymentSession();
            cancelOrder(cleanId);
            setShowSlideConfirmModal(false);
          }}
        />
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
