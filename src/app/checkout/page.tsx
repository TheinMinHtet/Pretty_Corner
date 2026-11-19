'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { MOCK_TOWNSHIPS } from '@/lib/mockData';
import OrderingStepBar from '@/components/OrderingStepBar';
import { validatePhoneNumber } from '@/lib/validation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartTotal, selectedTownship, setSelectedTownship, createOrder, isMounted } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [streetAddress, setStreetAddress] = useState('');
  const [landmarkNote, setLandmarkNote] = useState('');
  const [confirmedAddress, setConfirmedAddress] = useState(false);
  const [pinCoords, setPinCoords] = useState({ lat: 16.8302, lng: 96.1301 });
  const [paymentMethod, setPaymentMethod] = useState<'MyanMyanPay' | 'KBZPay' | 'WavePay'>('MyanMyanPay');
  const [mapSearch, setMapSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const deliveryFee = selectedTownship?.fee || 3000;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setPinCoords({ lat: 16.8295, lng: 96.1315 });
      setStreetAddress('Near Insein Road Junction, Kamayut');
      setIsLocating(false);
    }, 600);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim() || !streetAddress.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }
    const phoneCheck = validatePhoneNumber(phoneNumber);
    if (!phoneCheck.isValid) {
      setPhoneTouched(true);
      setPhoneError(phoneCheck.error || 'Please enter a valid phone number.');
      return;
    }
    if (!confirmedAddress) {
      alert('Please verify and confirm your delivery address.');
      return;
    }

    const newOrder = createOrder({
      customerName,
      phone: phoneNumber,
      township: selectedTownship.name,
      deliveryAddress: `${streetAddress}, ${selectedTownship.name}`,
      coordinates: pinCoords,
      landmarkNote,
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      paymentStatus: 'pending',
      fulfillmentStatus: 'pending_review',
    });

    router.push(`/payment-pending?orderId=${newOrder.id}`);
  };

  if (!isMounted) {
    return (
      <div className="w-full bg-white flex flex-col min-h-[60vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#b73d67] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12">
      {/* 1. Mobile Header (hidden on desktop) */}
      <header className="md:hidden px-5 pt-3.5 pb-4 border-b border-[#eedfe5]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 text-[#38262e] hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Back"
          >
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-serif text-[29px] font-medium text-[#38262e]">
            Checkout
          </h1>
        </div>

        <p className="font-sans text-[13px] text-[#7a6870] mt-1.5">
          A few details, then you’re glowing.
        </p>

        {/* Step indicator */}
        <div className="mt-3">
          <OrderingStepBar currentStep={1} />
        </div>
      </header>

      {/* 2. Desktop Breadcrumb & Heading (md and up) */}
      <div className="hidden md:block w-full max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center gap-2 text-[13px] text-[#7a6870] mb-3">
          <Link href="/" className="hover:text-[#38262e]">Home</Link>
          <span>/</span>
          <Link href="/bag" className="hover:text-[#38262e]">Beauty Bag</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">Checkout</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-[38px] font-medium text-[#38262e]">
              Checkout
            </h1>
            <p className="font-sans text-[15px] text-[#7a6870] mt-1">
              Fast, direct delivery across all Yangon townships.
            </p>
          </div>

          {/* Desktop Step Bar */}
          <div className="w-full md:w-auto shrink-0">
            <OrderingStepBar currentStep={1} />
          </div>
        </div>
      </div>

      {/* 3. Main Form Area - 2-Column Responsive Layout */}
      <form onSubmit={handlePlaceOrder} className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
          {/* Left Column: Delivery Form & Payment Methods (col-span-12 on mobile, col-span-7 or 8 on desktop) */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            {/* Step 1: Contact Details */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
              <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e] mb-4">
                1. Contact & delivery details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    Full name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Daw Su Su / Ma Thida"
                    className="w-full h-[46px] px-3.5 bg-white border border-[#eedfe5] rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none focus:border-[#b73d67]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    Phone number *
                  </label>
                  <input
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
                    placeholder="e.g. 09 765 432 100"
                    className={`w-full h-[46px] px-3.5 bg-white border rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none transition-colors ${
                      phoneError
                        ? 'border-red-400 focus:border-red-500 bg-red-50/10'
                        : 'border-[#eedfe5] focus:border-[#b73d67]'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-red-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                      <span>⚠</span>
                      <span>{phoneError}</span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    Township / city *
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTownship.name}
                      onChange={(e) => {
                        const match = MOCK_TOWNSHIPS.find((t) => t.name === e.target.value);
                        if (match) setSelectedTownship(match);
                      }}
                      className="w-full h-[46px] px-3.5 bg-white border border-[#eedfe5] rounded-[9px] text-[14px] text-[#38262e] outline-none appearance-none focus:border-[#b73d67] cursor-pointer"
                    >
                      {MOCK_TOWNSHIPS.map((township) => (
                        <option key={township.name} value={township.name}>
                          {township.name} · {township.fee.toLocaleString()} MMK delivery
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3.5 top-3.5 pointer-events-none text-[#7a6870] text-xs">⌄</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    Street & apartment details *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. No. 24, Insein Road, Building A, 3rd floor"
                    className="w-full h-[46px] px-3.5 bg-white border border-[#eedfe5] rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none focus:border-[#b73d67]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    Delivery landmark note (optional)
                  </label>
                  <input
                    type="text"
                    value={landmarkNote}
                    onChange={(e) => setLandmarkNote(e.target.value)}
                    placeholder="e.g. Near Hledan Centre · Please call on arrival"
                    className="w-full h-[46px] px-3.5 bg-white border border-[#eedfe5] rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none focus:border-[#b73d67]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Interactive Map Locator */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e]">
                  2. Pinpoint delivery location
                </h2>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="text-[12px] font-bold text-[#b73d67] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {isLocating ? 'Locating…' : 'Use GPS location'}
                </button>
              </div>

              {/* Map search input */}
              <div className="mb-3 bg-[#f7f4f5] h-[40px] rounded-[8px] flex items-center px-3 gap-2">
                <svg className="w-4 h-4 text-[#7a6870]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  placeholder="Search street or building in Yangon…"
                  className="bg-transparent text-[13px] text-[#38262e] placeholder-[#7a6870] outline-none w-full"
                />
              </div>

              {/* Interactive map simulation container */}
              <div className="relative w-full h-[220px] sm:h-[260px] bg-[#eef1ed] rounded-xl overflow-hidden border border-[#eedfe5]">
                {/* Simulated Street Grid */}
                <div className="absolute inset-0 opacity-40">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(#d1dbcd 1px, transparent 1px), linear-gradient(90deg, #d1dbcd 1px, transparent 1px)',
                    backgroundSize: '36px 36px'
                  }} />
                </div>

                {/* Major Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/70 -translate-y-1/2 flex items-center justify-center">
                  <span className="text-[9px] text-[#7a6870] tracking-wider uppercase font-bold">Insein Road</span>
                </div>
                <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white/70 flex items-center justify-center">
                  <span className="text-[9px] text-[#7a6870] tracking-wider uppercase font-bold rotate-90">Pyay Road</span>
                </div>

                {/* Pin marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
                  <div className="bg-[#b73d67] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap mb-1">
                    Deliver here
                  </div>
                  <div className="w-4 h-4 rounded-full bg-[#b73d67] ring-4 ring-white shadow-lg flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                {/* Coordinates badge */}
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-[#7a6870] font-mono">
                  Yangon: {pinCoords.lat.toFixed(4)}, {pinCoords.lng.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selector */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
              <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e] mb-2">
                3. Payment method
              </h2>
              <p className="text-[13px] text-[#7a6870] mb-4">
                Choose your preferred payment method. Verified securely in Yangon.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setPaymentMethod('MyanMyanPay')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'MyanMyanPay'
                      ? 'bg-[#fceef2] border-[#b73d67] ring-1 ring-[#b73d67]'
                      : 'bg-white border-[#eedfe5] hover:border-[#b73d67]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#b73d67]">
                      ● MyanMyanPay
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7a6870] mt-1.5">
                    Instant gateway & digital verification
                  </p>
                </div>

                <div
                  onClick={() => setPaymentMethod('KBZPay')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'KBZPay'
                      ? 'bg-[#fceef2] border-[#b73d67] ring-1 ring-[#b73d67]'
                      : 'bg-white border-[#eedfe5] hover:border-[#b73d67]'
                  }`}
                >
                  <span className="text-[14px] font-bold text-[#38262e]">
                    ○ KBZPay
                  </span>
                  <p className="text-[11px] text-[#7a6870] mt-1.5">
                    Direct QR or Mobile number transfer
                  </p>
                </div>

                <div
                  onClick={() => setPaymentMethod('WavePay')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'WavePay'
                      ? 'bg-[#fceef2] border-[#b73d67] ring-1 ring-[#b73d67]'
                      : 'bg-white border-[#eedfe5] hover:border-[#b73d67]'
                  }`}
                >
                  <span className="text-[14px] font-bold text-[#38262e]">
                    ○ WavePay
                  </span>
                  <p className="text-[11px] text-[#7a6870] mt-1.5">
                    Direct Wave Money Wallet transfer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary & Submit (col-span-12 on mobile, col-span-5 or 4 on desktop) */}
          <div className="md:col-span-5 lg:col-span-4 mt-6 md:mt-0">
            <div className="sticky top-28 bg-[#fcf9fa] p-6 lg:p-7 rounded-2xl border border-[#eedfe5]">
              <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e] mb-4">
                Review & pay
              </h2>

              {/* Items Miniature List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-[#eedfe5] mb-4 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      <div className="relative w-9 h-9 rounded bg-[#f9f5f7] overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-[#38262e] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#7a6870]">Qty: {item.quantity} · {item.size}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#38262e] shrink-0">
                      {(item.price * item.quantity).toLocaleString()} MMK
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#eedfe5] pt-3 space-y-2 text-[14px]">
                <div className="flex justify-between text-[#7a6870]">
                  <span>Subtotal</span>
                  <span className="text-[#38262e] font-medium">{cartSubtotal.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between text-[#7a6870]">
                  <span>Delivery ({selectedTownship.name.split(',')[0]})</span>
                  <span className="text-[#38262e] font-medium">{deliveryFee.toLocaleString()} MMK</span>
                </div>
              </div>

              <div className="my-4 border-t border-[#eedfe5]" />

              <div className="flex justify-between items-center text-[18px] font-bold text-[#38262e]">
                <span>Grand Total</span>
                <span className="text-[#b73d67]">{grandTotal.toLocaleString()} MMK</span>
              </div>

              {/* Address verification checkbox */}
              <label className="flex items-start gap-2.5 mt-5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={confirmedAddress}
                  onChange={(e) => setConfirmedAddress(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-[#b73d67] cursor-pointer"
                />
                <span className="text-[12px] text-[#38262e] leading-snug">
                  I’ve confirmed my Yangon address and landmark note.
                </span>
              </label>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                className="w-full mt-5 h-[52px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-sm cursor-pointer"
              >
                Place order · {grandTotal.toLocaleString()} MMK
              </button>

              <p className="text-[11px] text-center text-[#7a6870] mt-3 leading-normal">
                By placing an order, you agree to our{' '}
                <Link href="/policies/terms" className="underline hover:text-[#38262e]">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/policies/privacy" className="underline hover:text-[#38262e]">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
