'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import OrderingStepBar from '@/components/OrderingStepBar';

const SlideToConfirm = dynamic(() => import('@/components/SlideToConfirm'), { ssr: false });
import { validatePhoneNumber } from '@/lib/validation';
import { getAddressResolver } from '@/lib/location/MyanmarAddressResolver';
import { CheckoutMapSkeleton, CheckoutPageSkeleton } from '@/components/Skeletons';

const DeliveryMapPicker = dynamic(() => import('@/components/DeliveryMapPicker'), {
  ssr: false,
  loading: () => <CheckoutMapSkeleton />,
});

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartSubtotal,
    discount,
    cartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    lineItemsPricing,
    promoSubtotal,
    nonPromoSubtotal,
    createOrder,
    clearCart,
    isMounted,
    t,
    language,
    activePendingOrderId,
    cancelOrder,
    orders,
  } = useStore();

  const promoItemsCount = lineItemsPricing
    ? lineItemsPricing
        .filter((lp) => lp.discountAmount > 0)
        .reduce((sum, lp) => sum + lp.quantity, 0)
    : 0;

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [streetAddress, setStreetAddress] = useState('');
  const [landmarkNote, setLandmarkNote] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [pinCoords, setPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Mobile Banking' | 'Cash on Delivery'>('Mobile Banking');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  const [formAlert, setFormAlert] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodConfirmModal, setShowCodConfirmModal] = useState(false);

  // Ensure submitting state resets if customer navigates back to checkout
  useEffect(() => {
    setIsSubmitting(false);
  }, []);

  // Rule 04: Duplicate Prevention - warning on refresh while form is submitting
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting]);

  // Redirect to bag if cart is empty (only when not actively submitting an order)
  useEffect(() => {
    if (isMounted && cart.length === 0 && !isSubmitting) {
      router.push('/bag');
    }
  }, [isMounted, cart.length, isSubmitting, router]);

  const grandTotal = cartTotal;

  const handleMapLocationSelect = (
    coords: { lat: number; lng: number },
    address: string
  ) => {
    setPinCoords(coords);
    setStreetAddress(address);
    setAddressTouched(false);
    setGpsStatus('success');
    setGpsErrorMsg('');
  };

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    setGpsStatus('locating');
    setGpsErrorMsg('');

    try {
      const resolver = getAddressResolver();
      const fix = await resolver.resolveCurrentDeliveryLocation(language, 8000);
      setPinCoords(fix.coordinates);
      if (fix.accuracyMeters !== undefined) {
        setLocationAccuracy(fix.accuracyMeters);
      }
      setStreetAddress(fix.formattedAddress);
      setGpsStatus('success');
    } catch (err: unknown) {
      setGpsStatus('error');
      const resolver = getAddressResolver();
      setGpsErrorMsg(resolver.mapGeolocationError(err, language));
    } finally {
      setIsLocating(false);
    }
  };

  const processPlaceOrder = async (isCashOnDelivery: boolean) => {
    setIsSubmitting(true);
    setFormAlert(null);

    try {
      const newOrder = await createOrder({
        customerName: customerName.trim(),
        phone: phoneNumber.trim(),
        deliveryAddress: streetAddress.trim(),
        coordinates: pinCoords || { lat: 16.8302, lng: 96.1301 },
        landmarkNote: landmarkNote.trim(),
        items: cart,
        subtotal: cartSubtotal,
        discount,
        deliveryFee: 0,
        total: grandTotal,
        paymentMethod: isCashOnDelivery ? 'Cash on Delivery' : paymentMethod,
        paymentStatus: 'pending',
        fulfillmentStatus: isCashOnDelivery ? 'confirmed' : 'pending_review',
      });

      if (isCashOnDelivery) {
        clearCart();
        setShowCodConfirmModal(false);
        router.push(`/order-confirmation?orderId=${encodeURIComponent(newOrder.id)}`);
      } else {
        router.push(`/payment-pending?orderId=${encodeURIComponent(newOrder.id)}`);
      }
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setFormAlert(
        err?.message ||
        (language === 'my' ? 'အော်ဒါတင်ခြင်း မအောင်မြင်ပါ။ ထပ်မံကြိုးစားပေးပါ။' : 'Order placement failed. Please try again.')
      );
      setIsSubmitting(false);
      setShowCodConfirmModal(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const activeEl = typeof document !== 'undefined' ? (document.activeElement as HTMLElement) : null;
    if (activeEl?.getAttribute('data-no-submit') === 'true') {
      return;
    }
    setNameTouched(true);
    setPhoneTouched(true);
    setAddressTouched(true);

    if (!customerName.trim() || !phoneNumber.trim() || !streetAddress.trim()) {
      setFormAlert(language === 'my' ? 'ကျေးဇူးပြု၍ အမည်၊ ဖုန်းနံပါတ်နှင့် ပို့ဆောင်ရမည့်လိပ်စာတို့ကို ပြည့်စုံစွာ ဖြည့်စွက်ပေးပါ။' : 'Please fill in your name, phone number, and delivery address.');
      return;
    }
    const phoneCheck = validatePhoneNumber(phoneNumber);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.error || (language === 'my' ? 'မှန်ကန်သော ဖုန်းနံပါတ် ထည့်သွင်းပေးပါရန်' : 'Please enter a valid phone number.'));
      return;
    }

    const isCOD = paymentMethod === 'Cash on Delivery';
    if (isCOD) {
      // Trigger mobile-first slide to confirm UI
      setShowCodConfirmModal(true);
    } else {
      await processPlaceOrder(false);
    }
  };

  if (!isMounted) {
    return <CheckoutPageSkeleton />;
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12">
      {/* Breadcrumb & Heading */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870]">
            <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
            <span>/</span>
            <Link href="/bag" className="hover:text-[#38262e]">{t.bagTitle}</Link>
            <span>/</span>
            <span className="text-[#38262e] font-medium">{t.checkoutTitle}</span>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-[#b73d67] hover:text-[#8e294d] bg-[#fceef2] hover:bg-[#fadce6] px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs group shrink-0"
          >
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>{t.back}</span>
          </button>
        </div>

        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-center">
          <div className="md:col-span-7 lg:col-span-8">
            <h1 className={`font-serif font-medium text-[#38262e] ${
              language === 'my'
                ? 'text-[24px] sm:text-[30px]'
                : 'text-[30px] sm:text-[38px]'
            }`}>
              {t.checkoutTitle}
            </h1>
            <p className="font-sans text-[13px] sm:text-[15px] text-[#7a6870] mt-1">
              {t.checkoutSubtitle}
            </p>
          </div>

          {/* Unified Step Bar */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center items-center mt-3 md:mt-0">
            <OrderingStepBar currentStep={1} isCOD={paymentMethod === 'Cash on Delivery'} />
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <form
        onSubmit={handlePlaceOrder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLElement;
            if (target?.getAttribute('data-no-submit') === 'true') {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        }}
        noValidate
        className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2"
      >
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
          {/* Left Column: Delivery Form & Payment Methods */}
          <div className="md:col-span-7 lg:col-span-8 space-y-5 sm:space-y-6">
            {/* Step 1: Contact Details */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#eedfe5]">
              <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e] mb-4">
                {t.contactAndDelivery}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkout-name" className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    {t.fullName}
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                    placeholder={t.fullNamePlaceholder}
                    className={`w-full h-[46px] px-3.5 bg-white border rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none transition-colors ${
                      nameTouched && !customerName.trim()
                        ? 'border-[#b73d67] bg-[#fdf2f5]/20'
                        : 'border-[#eedfe5] focus:border-[#b73d67]'
                    }`}
                  />
                  {nameTouched && !customerName.trim() && (
                    <p className="text-[#b73d67] text-[11px] font-medium mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] shrink-0 inline-block" />
                      <span>{t.fullNameRequired}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    {t.phone}
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (phoneTouched) {
                        const check = validatePhoneNumber(e.target.value);
                        setPhoneError(check.isValid ? '' : (check.error || ''));
                      }
                    }}
                    onBlur={() => {
                      setPhoneTouched(true);
                      const check = validatePhoneNumber(phoneNumber);
                      setPhoneError(check.isValid ? '' : (check.error || ''));
                    }}
                    placeholder={t.phonePlaceholder}
                    className={`w-full h-[46px] px-3.5 bg-white border rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none transition-colors ${
                      phoneError
                        ? 'border-red-400 focus:border-red-500 bg-red-50/10'
                        : 'border-[#eedfe5] focus:border-[#b73d67]'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-[#b73d67] text-[11px] font-medium mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] shrink-0 inline-block" />
                      <span>{phoneError}</span>
                    </p>
                  )}
                </div>


                <div className="sm:col-span-2">
                  <label htmlFor="checkout-address" className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    {t.deliveryAddress}
                  </label>

                  <input
                    id="checkout-address"
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    onBlur={() => setAddressTouched(true)}
                    placeholder={t.streetAddressPlaceholder}
                    className={`w-full h-[46px] px-3.5 bg-white border rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none transition-colors ${
                      addressTouched && !streetAddress.trim()
                        ? 'border-[#b73d67] bg-[#fdf2f5]/20'
                        : 'border-[#eedfe5] focus:border-[#b73d67]'
                    }`}
                  />
                  {addressTouched && !streetAddress.trim() && (
                    <p className="text-[#b73d67] text-[11px] font-medium mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] shrink-0 inline-block" />
                      <span>{t.deliveryAddressRequired}</span>
                    </p>
                  )}

                  {/* Interactive Map & Search Engine Picker */}
                  <DeliveryMapPicker
                    coords={pinCoords}
                    onLocationSelect={handleMapLocationSelect}
                    language={language}
                    isLocatingGps={isLocating}
                    onLocateGps={handleUseCurrentLocation}
                  />

                  {gpsErrorMsg && (
                    <p className="text-[#b73d67] text-[11.5px] font-medium mt-1.5 flex items-center gap-1.5">
                      <span className="shrink-0">⚠</span>
                      <span>{gpsErrorMsg}</span>
                    </p>
                  )}
                  {gpsStatus === 'success' && !gpsErrorMsg && pinCoords && (
                    <p className="text-emerald-700 text-[11px] font-medium mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        {language === 'my'
                          ? `တည်နေရာ ရယူပြီးပါပြီ (${pinCoords.lat.toFixed(4)}, ${pinCoords.lng.toFixed(4)}${locationAccuracy ? ` · ±${locationAccuracy}m` : ''}) · အပေါ်တွင် လိပ်စာ ပြင်ဆင်နိုင်ပါသည်`
                          : `Pinned location active (${pinCoords.lat.toFixed(4)}, ${pinCoords.lng.toFixed(4)}${locationAccuracy ? ` · ±${locationAccuracy}m` : ''}) · You can edit the address above`}
                      </span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="checkout-landmark" className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    {t.landmarkNote}
                  </label>
                  <input
                    id="checkout-landmark"
                    type="text"
                    value={landmarkNote}
                    onChange={(e) => setLandmarkNote(e.target.value)}
                    placeholder={t.landmarkPlaceholder}
                    className="w-full h-[46px] px-3.5 bg-white border border-[#eedfe5] rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none focus:border-[#b73d67]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Selector */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
              <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e] mb-2">
                {t.paymentMethod}
              </h2>
              <p className="text-[13px] text-[#7a6870] mb-4">
                {t.choosePaymentMethod}
              </p>

              <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" role="radiogroup" aria-label={t.paymentMethod}>
                {/* 1. Mobile Banking */}
                <label
                  className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    paymentMethod === 'Mobile Banking'
                      ? 'bg-[#fceef2] border-[#b73d67] ring-1 ring-[#b73d67]'
                      : 'bg-white border-[#eedfe5] hover:border-[#b73d67]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Mobile Banking"
                      checked={paymentMethod === 'Mobile Banking'}
                      onChange={() => setPaymentMethod('Mobile Banking')}
                      className="w-4 h-4 text-[#b73d67] accent-[#b73d67] cursor-pointer shrink-0"
                    />
                    <span className={`text-[14px] sm:text-[15px] font-bold ${paymentMethod === 'Mobile Banking' ? 'text-[#b73d67]' : 'text-[#38262e]'}`}>
                      {t.mobileBanking}
                    </span>
                  </div>
                  <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#7a6870] bg-white px-2 py-0.5 rounded border border-[#eedfe5] shadow-2xs shrink-0 whitespace-nowrap">
                    MMQR
                  </span>
                </label>

                {/* 2. Cash on Delivery */}
                <label
                  className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-[#fceef2] border-[#b73d67] ring-1 ring-[#b73d67]'
                      : 'bg-white border-[#eedfe5] hover:border-[#b73d67]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="w-4 h-4 text-[#b73d67] accent-[#b73d67] cursor-pointer shrink-0"
                    />
                    <span className={`text-[14px] sm:text-[15px] font-bold ${paymentMethod === 'Cash on Delivery' ? 'text-[#b73d67]' : 'text-[#38262e]'}`}>
                      {t.cod}
                    </span>
                  </div>
                  <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#7a6870] bg-white px-2 py-0.5 rounded border border-[#eedfe5] shadow-2xs shrink-0 whitespace-nowrap">
                    COD
                  </span>
                </label>
              </fieldset>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary & Submit */}
          <div className="md:col-span-5 lg:col-span-4 mt-6 md:mt-0">
            <div className="sticky top-28 bg-[#fcf9fa] p-5 sm:p-6 lg:p-7 rounded-2xl border border-[#eedfe5]">
              <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e] mb-4">
                {t.reviewAndPay}
              </h2>

              {/* Items Miniature List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-[#eedfe5] mb-3.5 pr-3 custom-scrollbar">
                {cart.map((item) => {
                  const itemPricing = lineItemsPricing?.find((lp) => lp.itemId === item.id);
                  const isDiscounted = Boolean(itemPricing && itemPricing.discountAmount > 0);
                  const finalLineTotal = itemPricing ? itemPricing.finalTotal : (item.price * item.quantity);

                  return (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <div className="relative w-9 h-9 rounded bg-[#f9f5f7] overflow-hidden shrink-0">
                          <Image src={item.image} alt={item.name} fill sizes="36px" className="object-cover" />
                        </div>
                        <div className="truncate flex flex-col">
                          <div className="flex items-center">
                            <span className="font-medium text-[#38262e] truncate">{item.name}</span>
                            <span className="inline-flex items-center font-bold text-[#b73d67] bg-[#fceef2] border border-[#f5d9e3] px-1.5 py-0.2 rounded text-[10px] ml-2 shrink-0">
                              x{item.quantity}
                            </span>
                          </div>
                          {isDiscounted ? (
                            <span className="text-[10px] text-[#b73d67] font-semibold">
                              ✨ Promo applied (-{appliedPromo?.discountPercentage}%)
                            </span>
                          ) : (
                            appliedPromo && (
                              <span className="text-[10px] text-[#7a6870]">
                                Regular item
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-bold whitespace-nowrap text-[13.5px] ${isDiscounted ? 'text-[#b73d67]' : 'text-[#38262e]'}`}>
                          {finalLineTotal.toLocaleString()} MMK
                        </span>
                        {isDiscounted && (
                          <div className="text-[12px] text-[#7a6870] line-through">
                            {(item.price * item.quantity).toLocaleString()} MMK
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Box in Checkout */}
              <div className="bg-white p-3 rounded-xl border border-[#eedfe5] mb-3.5 shadow-2xs">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-[#fceef2] px-3 py-1.5 rounded-lg border border-[#f1d3df]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#b73d67] bg-white px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider">
                        {appliedPromo.code}
                      </span>
                      <span className="text-[12px] font-bold text-[#38262e]">
                        -{appliedPromo.discountPercentage}% OFF
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removePromoCode();
                        setPromoFeedback(null);
                      }}
                      className="text-[11px] font-bold text-[#b73d67] hover:underline cursor-pointer"
                    >
                      {t.remove}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder={t.promoPlaceholder}
                        className="flex-1 min-w-0 h-[36px] px-3 rounded-lg border border-[#eedfe5] text-[12.5px] sm:text-[13px] font-mono uppercase text-[#38262e] placeholder:text-[#a89aa0] focus:outline-none focus:border-[#b73d67] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!promoInput.trim()) return;
                          const res = applyPromoCode(promoInput.trim());
                          setPromoFeedback(res.message);
                          if (res.success) {
                            setPromoInput('');
                          }
                        }}
                        className="h-[36px] px-3.5 bg-[#38262e] hover:bg-[#b73d67] text-white text-[12px] font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        {t.apply}
                      </button>
                    </div>
                    {promoFeedback && (
                      <p className={`text-[11px] font-medium mt-1 ${appliedPromo ? 'text-emerald-700' : 'text-[#b73d67]'}`}>
                        {promoFeedback}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Sub Total, Discount, and Total */}
              <div className="border-t border-[#eedfe5] pt-3.5 space-y-2 text-[14px]">
                <div className="flex justify-between items-center text-[#7a6870]">
                  <span>
                    {t.subTotal} ({cartCount} {cartCount === 1 ? t.itemCountSingular : t.itemsCount})
                  </span>
                  <span className="font-semibold text-[#38262e]">{cartSubtotal.toLocaleString()} MMK</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="font-medium">
                      {language === 'my'
                        ? `လျှော့စျေး (${promoItemsCount} ခု)`
                        : `Promotion discount (${promoItemsCount} ${promoItemsCount === 1 ? t.itemCountSingular : t.itemsCount})`}
                    </span>
                    <span className="font-bold whitespace-nowrap">−{discount.toLocaleString()} MMK</span>
                  </div>
                )}

                <div className="border-t border-[#eedfe5] pt-2.5 flex justify-between items-center text-[18px] font-bold text-[#38262e]">
                  <span>{t.total}</span>
                  <span className="text-[#b73d67]">{grandTotal.toLocaleString()} MMK</span>
                </div>
              </div>

              {/* Notification around confirm button */}
              {formAlert && (
                <div className="mt-3.5 p-3 rounded-xl bg-[#fdf2f5] border border-[#f3ccd8] text-[#842a4b] text-[12px] flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#b73d67] shrink-0" />
                    <span className="font-medium leading-tight">{formAlert}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormAlert(null)}
                    className="w-5 h-5 rounded-full hover:bg-white/60 text-[#b73d67] flex items-center justify-center text-xs font-bold cursor-pointer shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${formAlert ? 'mt-3' : 'mt-5'} h-[50px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap disabled:opacity-75`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'my' ? 'လုပ်ဆောင်နေပါသည်...' : 'Processing...'}</span>
                  </>
                ) : (
                  paymentMethod === 'Cash on Delivery' ? t.confirmOrder : t.proceedToPayment
                )}
              </button>

              <p className="text-[11px] text-center text-[#7a6870] mt-3 leading-normal">
                {t.agreeTermsNotice}{' '}
                <Link href="/policies/terms" className="underline hover:text-[#38262e]">
                  {t.terms}
                </Link>{' '}
                {t.and}{' '}
                <Link href="/policies/privacy" className="underline hover:text-[#38262e]">
                  {t.privacyPolicy}
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile-first draggable confirmation modal for COD */}
      {showCodConfirmModal && (
        <SlideToConfirm
          amount={grandTotal}
          currency="MMK"
          title="ORDER CONFIRMATION"
          subtitle="Total amount (Cash on Delivery)"
          promptText="Slide to confirm order"
          cancelText="Cancel"
          isSubmitting={isSubmitting}
          onConfirm={async () => {
            await processPlaceOrder(true);
          }}
          onCancel={() => {
            setShowCodConfirmModal(false);
          }}
        />
      )}
    </div>
  );
}
