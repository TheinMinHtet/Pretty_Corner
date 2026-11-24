'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';
import { useStore } from '@/context/StoreContext';
import OrderingStepBar from '@/components/OrderingStepBar';
import { OrderCardSkeleton } from '@/components/Skeletons';

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

  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  // 02: State Caching - Auto-resume active QR on page refresh
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
                document.querySelectorAll('.mmpay-toggle-container').forEach((el) => el.remove());
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
      if (isInitializingPayment || hasActivePending) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cleanId, isInitializingPayment]);

  const handleOpenPaymentGateway = async () => {
    setPaymentError(null);
    const pubKey = process.env.NEXT_PUBLIC_MMPAY_PUBLISHABLE_KEY;
    const rawTargetId = activeOrder?.id || cleanId;
    const targetId = rawTargetId.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '');
    const amountToPay = Math.round(activeOrder?.total ?? 0);

    if (!amountToPay || amountToPay <= 0) {
      setPaymentError(
        language === 'my'
          ? 'အမှာစာငွေပမာဏ ရှာမတွေ့သေးပါ။ စာမျက်နှာကို ပြန်လည်ဖွင့်ပေးပါ သို့မဟုတ် ဆိုင်သို့ တိုက်ရိုက် ဆက်သွယ်ပေးပါ။'
          : 'Order amount is not available. Please refresh the page or contact our team directly.'
      );
      return;
    }

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
            setPaymentError(
              language === 'my'
                ? 'ငွေပေးချေမှု ချိတ်ဆက်၍ မရသေးပါ။ ဆိုင်သို့ တိုက်ရိုက် ဆက်သွယ်ပေးပါရန် မေတ္တာရပ်ခံပါသည်။'
                : 'Unable to connect to payment gateway. Please contact our support team.'
            );
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
          const siteOrigin =
            typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
              ? window.location.origin
              : (process.env.NEXT_PUBLIC_SITE_URL || 'https://prettycornershopmm.com');
          const webhookCallbackUrl = `${siteOrigin}/api/payment/webhook`;

          await mmpay.showPaymentModal(
            {
              orderId: targetId,
              amount: amountToPay,
              nonce: Date.now().toString(),
              callbackUrl: webhookCallbackUrl,
            },
            handleSDKResult
          );

          setTimeout(() => {
            document.querySelectorAll('.mmpay-toggle-container').forEach((el) => el.remove());
          }, 50);

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
      } catch (err: any) {
        console.warn('MyanMyanPay SDK modal failed:', err);
        setIsInitializingPayment(false);
        setPaymentError(
          err?.message ||
          (language === 'my'
            ? 'ငွေပေးချေမှု ချိတ်ဆက်၍ မရသေးပါ။ ဆိုင်သို့ တိုက်ရိုက် ဆက်သွယ်ပေးပါရန် မေတ္တာရပ်ခံပါသည်။'
            : 'Unable to connect to payment gateway. Please contact our support team.')
        );
      }
    } else {
      setPaymentError(
        language === 'my'
          ? 'ငွေပေးချေမှုစနစ် မရရှိနိုင်သေးပါ။ ဆိုင်သို့ တိုက်ရိုက် ဆက်သွယ်ပေးပါရန် မေတ္တာရပ်ခံပါသည်။'
          : 'Payment system is not available right now. Please contact our support team.'
      );
    }
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
    return <OrderCardSkeleton wide />;
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
    <div className="w-full max-w-2xl mx-auto px-2.5 sm:px-6 py-4 md:py-8 flex flex-col min-h-full pb-12">
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-[24px] sm:rounded-2xl p-3 min-[360px]:p-4 sm:p-8 flex flex-col">
        {/* Step indicator */}
        <div className="mb-4">
          <OrderingStepBar currentStep={2} orderId={cleanId} />
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

        <h2 className={`font-serif font-medium leading-[1.45] text-[#38262e] ${
          language === 'my'
            ? 'text-[19px] min-[380px]:text-[22px] sm:text-[28px]'
            : 'text-[24px] sm:text-[34px]'
        }`}>
          {t.oneLastStep}
        </h2>

        {/* Provider Payment Card */}
        <div className="w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-[14px] p-5 mt-5 flex flex-col items-center shadow-xs">
          <span className="font-sans text-[21px] font-bold text-[#38262e]">
            {paymentMethod || 'Mobile Banking'}
          </span>
          <span className="text-[10px] font-bold tracking-[1.5px] text-[#7a6870] uppercase mt-3">
            {t.totalToPay}
          </span>
          <span className="font-sans text-[30px] font-bold text-[#b73d67] mt-1">
            {totalAmount.toLocaleString()} MMK
          </span>

          {/* Highlighted Order Reference Banner */}
          <div className="w-full mt-4 bg-white border border-[#eedfe5] rounded-[10px] p-3 text-center shadow-xs">
            <span className="block text-[11px] font-bold tracking-wider text-[#7a6870] uppercase">
              {t.orderRef}
            </span>
            <span className="block text-[18px] sm:text-[20px] font-mono font-bold text-[#38262e] tracking-tight mt-0.5 select-all">
              {currentId}
            </span>
            <div className="mt-2 pt-2 border-t border-[#eedfe5]/70 flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#b73d67]">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        {/* Payment Error / Help Assist Card */}
        {paymentError && (
          <div className="w-full mt-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-left animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-rose-900">
                  {language === 'my' ? 'ငွေပေးချေမှု ချိတ်ဆက်ရာတွင် အဆင်မပြေဖြစ်နေပါသည်' : 'Payment gateway assistance'}
                </p>
                <p className="text-[12px] text-rose-700 mt-1 leading-relaxed">
                  {paymentError}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/contact?orderId=${encodeURIComponent(currentId)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#b73d67] text-white text-[12px] font-bold rounded-lg hover:bg-[#a33259] transition-colors shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <span>{language === 'my' ? 'ဆိုင်သို့ တိုက်ရိုက် ဆက်သွယ်မည်' : 'Contact Us'}</span>
                  </Link>
                  <a
                    href="tel:09967638888"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-300 text-rose-900 text-[12px] font-bold rounded-lg hover:bg-rose-100 transition-colors shadow-2xs"
                  >
                    <span>09 967 638 888</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

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
            href={`/contact?orderId=${encodeURIComponent(currentId)}`}
            className="text-[12px] font-bold text-[#b73d67] hover:underline mt-1.5 inline-block"
          >
            {t.questionsContact}
          </Link>
        </div>
      </section>

      {/* 03: Transaction Control - Confirmation Modal for Order Cancellation */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-[360px] my-auto bg-white rounded-[20px] p-5 sm:p-6 shadow-2xl flex flex-col text-center max-h-[calc(100dvh-32px)] overflow-y-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 shrink-0">
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
                className="w-full h-[40px] text-[13px] text-[#7a6870] hover:text-[#38262e] font-semibold cursor-pointer"
              >
                {language === 'my' ? 'မပယ်ဖျက်တော့ပါ' : 'Keep Order & Return'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<OrderCardSkeleton wide />}>
      <PaymentPendingContent />
    </Suspense>
  );
}
