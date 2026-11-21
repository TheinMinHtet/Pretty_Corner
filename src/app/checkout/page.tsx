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
  const { cart, cartSubtotal, cartTotal, selectedTownship, setSelectedTownship, createOrder, clearCart, isMounted } = useStore();

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

  const deliveryFee = 0;
  const grandTotal = cartSubtotal;

  const handleUseCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('GPS location is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsStatus('locating');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setPinCoords({ lat: latitude, lng: longitude });
        setLocationAccuracy(Math.round(accuracy));
        setGpsStatus('success');
        setIsLocating(false);

        // Real reverse geocoding to auto-fill delivery address (unconditionally overwrites)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'Accept-Language': 'en,my',
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const buildingOrRoad = [
                addr.house_number,
                addr.building,
                addr.road || addr.street || addr.pedestrian || addr.footway,
              ]
                .filter(Boolean)
                .join(' ');

              const area = addr.quarter || addr.neighbourhood || addr.suburb || addr.residential || addr.village;
              const township = addr.township || addr.city_district || addr.district || addr.municipality;
              const city = addr.city || addr.town || 'Yangon';

              const parts = [buildingOrRoad, area, township, city].filter(Boolean);
              const formatted = parts.length > 0 ? parts.join(', ') : (data.display_name?.split(',').slice(0, 4).join(', ') || '');

              if (formatted) {
                setStreetAddress(formatted);
                if (township) {
                  const match = MOCK_TOWNSHIPS.find(
                    (t) => t.name.toLowerCase() === township.toLowerCase() || formatted.toLowerCase().includes(t.name.toLowerCase())
                  );
                  if (match) setSelectedTownship(match);
                }
              } else {
                setStreetAddress(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
              }
            } else if (data && data.display_name) {
              setStreetAddress(data.display_name.split(',').slice(0, 4).join(', '));
            } else {
              setStreetAddress(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
            }
          } else {
            setStreetAddress(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          }
        } catch {
          setStreetAddress(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
      },
      (err) => {
        setIsLocating(false);
        setGpsStatus('error');
        if (err.code === 1) {
          setGpsErrorMsg('Location permission was denied. Please allow location permissions in your browser.');
        } else if (err.code === 2) {
          setGpsErrorMsg('GPS position unavailable. Please ensure GPS/Location is turned on.');
        } else if (err.code === 3) {
          setGpsErrorMsg('GPS request timed out. Please click again.');
        } else {
          setGpsErrorMsg('Could not detect location. Please enter delivery address manually.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const activeEl = typeof document !== 'undefined' ? (document.activeElement as HTMLElement) : null;
    if (activeEl?.getAttribute('data-no-submit') === 'true') {
      return;
    }
    setNameTouched(true);
    setPhoneTouched(true);
    setAddressTouched(true);

    if (!customerName.trim() || !phoneNumber.trim() || !streetAddress.trim()) {
      setFormAlert('Please fill in your name, phone number, and delivery address.');
      return;
    }
    const phoneCheck = validatePhoneNumber(phoneNumber);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.error || 'Please enter a valid phone number.');
      return;
    }

    const isCOD = paymentMethod === 'Cash on Delivery';

    const newOrder = createOrder({
      customerName,
      phone: phoneNumber,
      township: selectedTownship?.name || 'Yangon',
      deliveryAddress: streetAddress.trim().toLowerCase().includes('yangon')
        ? streetAddress.trim()
        : `${streetAddress.trim()}, Yangon`,
      coordinates: pinCoords || { lat: 16.8302, lng: 96.1301 },
      landmarkNote,
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      paymentStatus: isCOD ? 'pending' : 'pending',
      fulfillmentStatus: isCOD ? 'confirmed' : 'pending_review',
    });

    if (isCOD) {
      clearCart();
      router.push(`/order-confirmation?orderId=${newOrder.id}`);
    } else {
      router.push(`/payment-pending?orderId=${newOrder.id}`);
    }
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
      {/* Breadcrumb & Heading - Unified across mobile and desktop */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-4">
        <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870]">
            <Link href="/" className="hover:text-[#38262e]">Home</Link>
            <span>/</span>
            <Link href="/bag" className="hover:text-[#38262e]">Beauty Bag</Link>
            <span>/</span>
            <span className="text-[#38262e] font-medium">Checkout</span>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-[#b73d67] hover:text-[#8e294d] bg-[#fceef2] hover:bg-[#fadce6] px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs group shrink-0"
          >
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-center">
          <div className="md:col-span-7 lg:col-span-8">
            <h1 className="font-serif text-[30px] sm:text-[38px] font-medium text-[#38262e]">
              Checkout
            </h1>
            <p className="font-sans text-[13px] sm:text-[15px] text-[#7a6870] mt-1">
              Fast, direct delivery across all townships.
            </p>
          </div>

          {/* Unified Step Bar - Centered evenly over the Review & Pay column */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center items-center mt-3 md:mt-0">
            <OrderingStepBar currentStep={1} isCOD={paymentMethod === 'Cash on Delivery'} />
          </div>
        </div>
      </div>

      {/* Main Form Area - 2-Column Responsive Layout */}
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
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2"
      >
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
          {/* Left Column: Delivery Form & Payment Methods */}
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
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                    placeholder="e.g. Daw Su Su / Ma Thida"
                    className={`w-full h-[46px] px-3.5 bg-white border rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none transition-colors ${
                      nameTouched && !customerName.trim()
                        ? 'border-[#b73d67] bg-[#fdf2f5]/20'
                        : 'border-[#eedfe5] focus:border-[#b73d67]'
                    }`}
                  />
                  {nameTouched && !customerName.trim() && (
                    <p className="text-[#b73d67] text-[11px] font-medium mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] shrink-0 inline-block" />
                      <span>Full name is required</span>
                    </p>
                  )}
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
                    <p className="text-[#b73d67] text-[11px] font-medium mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] shrink-0 inline-block" />
                      <span>{phoneError}</span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label className="block text-[12px] font-bold text-[#38262e]">
                      Delivery address *
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold text-[#b73d67] hover:text-[#8e294d] bg-[#fceef2] hover:bg-[#fadce6] px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs disabled:opacity-60 shrink-0"
                      title="Auto-fill address using device GPS"
                    >
                      <svg className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>{isLocating ? 'Detecting GPS…' : 'Use GPS location'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    onBlur={() => setAddressTouched(true)}
                    placeholder="e.g. No. 24, Insein Road, Building A, 3rd floor"
                    className={`w-full h-[46px] px-3.5 bg-white border rounded-[9px] text-[14px] text-[#38262e] placeholder-[#a89aa0] outline-none transition-colors ${
                      addressTouched && !streetAddress.trim()
                        ? 'border-[#b73d67] bg-[#fdf2f5]/20'
                        : 'border-[#eedfe5] focus:border-[#b73d67]'
                    }`}
                  />
                  {addressTouched && !streetAddress.trim() && (
                    <p className="text-[#b73d67] text-[11px] font-medium mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] shrink-0 inline-block" />
                      <span>Delivery address is required</span>
                    </p>
                  )}
                  {gpsErrorMsg && (
                    <p className="text-[#b73d67] text-[11.5px] font-medium mt-1.5 flex items-center gap-1.5">
                      <span className="shrink-0">⚠</span>
                      <span>{gpsErrorMsg}</span>
                    </p>
                  )}
                  {gpsStatus === 'success' && !gpsErrorMsg && pinCoords && (
                    <p className="text-emerald-700 text-[11px] font-medium mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>GPS location captured ({pinCoords.lat.toFixed(4)}, {pinCoords.lng.toFixed(4)}) · You can edit the address above</span>
                    </p>
                  )}
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

            {/* Step 2: Payment Method Selector */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
              <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e] mb-2">
                2. Payment method
              </h2>
              <p className="text-[13px] text-[#7a6870] mb-4">
                Choose your preferred payment method.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Mobile Banking */}
                <div
                  onClick={() => setPaymentMethod('Mobile Banking')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center ${
                    paymentMethod === 'Mobile Banking'
                      ? 'bg-[#fceef2] border-[#b73d67] ring-1 ring-[#b73d67]'
                      : 'bg-white border-[#eedfe5] hover:border-[#b73d67]'
                  }`}
                >
                  <span className={`text-[15px] font-bold ${paymentMethod === 'Mobile Banking' ? 'text-[#b73d67]' : 'text-[#38262e]'}`}>
                    {paymentMethod === 'Mobile Banking' ? '●' : '○'} Mobile Banking
                  </span>
                </div>

                {/* 2. Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-[#fceef2] border-[#b73d67] ring-1 ring-[#b73d67]'
                      : 'bg-white border-[#eedfe5] hover:border-[#b73d67]'
                  }`}
                >
                  <span className={`text-[15px] font-bold ${paymentMethod === 'Cash on Delivery' ? 'text-[#b73d67]' : 'text-[#38262e]'}`}>
                    {paymentMethod === 'Cash on Delivery' ? '●' : '○'} Cash on Delivery
                  </span>
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
                      <div className="truncate flex items-center">
                        <span className="font-medium text-[#38262e] truncate">{item.name}</span>
                        <span className="inline-flex items-center font-bold text-[#b73d67] bg-[#fceef2] border border-[#f5d9e3] px-1.5 py-0.5 rounded text-[11px] ml-2 shrink-0">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-[#38262e] shrink-0">
                      {(item.price * item.quantity).toLocaleString()} MMK
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#eedfe5] pt-4 flex justify-between items-center text-[18px] font-bold text-[#38262e]">
                <span>Total</span>
                <span className="text-[#b73d67]">{grandTotal.toLocaleString()} MMK</span>
              </div>

              {/* Notification around confirm button (visible on mobile without scrolling up) */}
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
                className={`w-full ${formAlert ? 'mt-3' : 'mt-5'} h-[50px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-sm cursor-pointer whitespace-nowrap`}
              >
                {paymentMethod === 'Cash on Delivery' ? 'Confirm Order' : 'Proceed to Payment'}
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
