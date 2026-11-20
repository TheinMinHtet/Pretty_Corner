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
  const [pinCoords, setPinCoords] = useState({ lat: 16.8302, lng: 96.1301 });
  const [paymentMethod, setPaymentMethod] = useState<'Mobile Banking' | 'Cash on Delivery'>('Mobile Banking');
  const [mapSearch, setMapSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
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

        // Real reverse geocoding to auto-fill street address if empty
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
              const parts = [
                addr.road || addr.street,
                addr.quarter || addr.neighbourhood,
                addr.suburb || addr.township || addr.city_district,
                addr.city || 'Yangon',
              ].filter(Boolean);

              if (parts.length > 0 && (!streetAddress.trim() || streetAddress.startsWith('Near Insein'))) {
                setStreetAddress(parts.join(', '));
              }
            }
          }
        } catch {
          // coordinates are safely saved
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
          setGpsErrorMsg('Could not detect location. Please search your area or enter street address.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleMapSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mapSearch.trim()) return;

    setIsSearchingMap(true);
    setGpsErrorMsg('');
    try {
      const query = encodeURIComponent(`${mapSearch.trim()}, Yangon, Myanmar`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
        headers: {
          'Accept-Language': 'en,my',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          setPinCoords({ lat, lng });
          setGpsStatus('success');
          if (!streetAddress.trim()) {
            setStreetAddress(data[0].display_name.split(',').slice(0, 3).join(', '));
          }
        } else {
          setGpsErrorMsg(`No location found in Yangon for "${mapSearch}".`);
        }
      }
    } catch {
      setGpsErrorMsg('Search service unavailable. Please enter address manually.');
    } finally {
      setIsSearchingMap(false);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const activeEl = typeof document !== 'undefined' ? (document.activeElement as HTMLElement) : null;
    if (activeEl?.getAttribute('data-no-submit') === 'true' || activeEl?.getAttribute('name') === 'map-search') {
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
      deliveryAddress: streetAddress ? `${streetAddress}, Yangon` : 'Yangon',
      coordinates: pinCoords,
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
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870] mb-2 sm:mb-3">
          <Link href="/" className="hover:text-[#38262e]">Home</Link>
          <span>/</span>
          <Link href="/bag" className="hover:text-[#38262e]">Beauty Bag</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium">Checkout</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-[30px] sm:text-[38px] font-medium text-[#38262e]">
              Checkout
            </h1>
            <p className="font-sans text-[13px] sm:text-[15px] text-[#7a6870] mt-1">
              Fast, direct delivery across all Yangon townships.
            </p>
          </div>

          {/* Unified Step Bar */}
          <div className="w-full md:w-auto shrink-0">
            <OrderingStepBar currentStep={1} />
          </div>
        </div>
      </div>

      {/* Main Form Area - 2-Column Responsive Layout */}
      <form
        onSubmit={handlePlaceOrder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLElement;
            if (target?.getAttribute('data-no-submit') === 'true' || target?.getAttribute('name') === 'map-search') {
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
            {/* Elegant Notification if form invalid */}
            {formAlert && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#fdf2f5] border border-[#f3ccd8] text-[#38262e] flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(183,61,103,0.06)] animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#b73d67] shrink-0" />
                  <span className="text-[13px] font-medium text-[#842a4b]">{formAlert}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormAlert(null)}
                  className="w-6 h-6 rounded-full hover:bg-white/60 text-[#b73d67] flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
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
                  <label className="block text-[12px] font-bold text-[#38262e] mb-1.5">
                    Street & apartment details *
                  </label>
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
                      <span>Street & apartment details are required</span>
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

            {/* Step 2: Interactive Real GPS Map Locator */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e]">
                    2. Pinpoint delivery location
                  </h2>
                  <p className="text-[12px] text-[#7a6870] mt-0.5">
                    Real-time GPS delivery coordinates for accurate rider dispatch
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className={`px-3.5 py-2 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-auto ${
                    isLocating
                      ? 'bg-[#fceef2] text-[#b73d67] border border-[#f5d9e3]'
                      : gpsStatus === 'success'
                      ? 'bg-[#fceef2] text-[#b73d67] border border-[#f5d9e3]'
                      : 'bg-[#b73d67] hover:bg-[#a33259] text-white active:scale-95'
                  }`}
                >
                  <svg className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>
                    {isLocating
                      ? 'Detecting GPS…'
                      : gpsStatus === 'success'
                      ? 'Located'
                      : 'Locate my GPS'}
                  </span>
                </button>
              </div>

              {/* Map search input */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex-1 bg-[#f7f4f5] border border-[#eedfe5] focus-within:border-[#b73d67] focus-within:bg-white h-[42px] rounded-[9px] flex items-center px-3 gap-2.5 transition-all">
                  <svg className="w-4 h-4 text-[#7a6870] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    name="map-search"
                    data-no-submit="true"
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMapSearch();
                      }
                    }}
                    placeholder="Search street, township or landmark in Yangon…"
                    className="bg-transparent text-[13px] text-[#38262e] placeholder-[#7a6870] outline-none w-full"
                  />
                  {mapSearch && (
                    <button
                      type="button"
                      onClick={() => setMapSearch('')}
                      className="text-[#7a6870] text-xs hover:text-[#38262e] cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleMapSearch()}
                  disabled={isSearchingMap || !mapSearch.trim()}
                  className="h-[42px] px-4 bg-[#38262e] hover:bg-[#503742] text-white text-[12px] font-bold rounded-[9px] transition-colors shrink-0 disabled:opacity-40 cursor-pointer"
                >
                  {isSearchingMap ? 'Searching…' : 'Search'}
                </button>
              </div>

              {/* GPS error or guide alert */}
              {gpsErrorMsg && (
                <div className="mb-3 p-2.5 bg-[#fdf2f5] border border-[#f5d9e3] rounded-lg text-[12px] text-[#b73d67] flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{gpsErrorMsg}</span>
                </div>
              )}

              {/* Real OpenStreetMap Container with Live Marker & Overlay */}
              <div className="relative w-full h-[250px] sm:h-[300px] bg-[#f2ede9] rounded-xl overflow-hidden border border-[#eedfe5] shadow-inner">
                <iframe
                  key={`${pinCoords.lat.toFixed(4)}-${pinCoords.lng.toFixed(4)}`}
                  title="Real Delivery Location Map"
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0 pointer-events-auto"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(pinCoords.lng - 0.005).toFixed(5)}%2C${(pinCoords.lat - 0.0035).toFixed(5)}%2C${(pinCoords.lng + 0.005).toFixed(5)}%2C${(pinCoords.lat + 0.0035).toFixed(5)}&layer=mapnik&marker=${pinCoords.lat.toFixed(5)}%2C${pinCoords.lng.toFixed(5)}`}
                />

                {/* Bottom Overlay: Live GPS Coordinates & Google Maps Link (non-overlapping) */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-[#eedfe5] flex items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    <span className="font-mono text-[#38262e] font-medium truncate">
                      {pinCoords.lat.toFixed(5)}, {pinCoords.lng.toFixed(5)}
                    </span>
                    <span className="text-[#b73d67] font-bold text-[10px] tracking-wide uppercase shrink-0 bg-[#fceef2] px-1.5 py-0.5 rounded">
                      Pinned
                    </span>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${pinCoords.lat},${pinCoords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#b73d67] text-[#38262e] text-[11px] font-bold px-2 py-1 rounded bg-[#faf7f8] hover:bg-[#fceef2] border border-[#eedfe5] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                    title="Open location in Google Maps"
                  >
                    <span>Google Maps</span>
                    <svg className="w-3 h-3 text-[#b73d67]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <path d="M15 3h6v6" />
                      <path d="M10 14L21 3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selector */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eedfe5]">
              <h2 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#38262e] mb-2">
                3. Payment method
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

              <div className="border-t border-[#eedfe5] pt-4 flex justify-between items-center text-[18px] font-bold text-[#38262e]">
                <span>Total</span>
                <span className="text-[#b73d67]">{grandTotal.toLocaleString()} MMK</span>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                className="w-full mt-5 h-[52px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] hover:bg-[#a33259] active:scale-[0.98] transition-all flex items-center justify-center shadow-sm cursor-pointer"
              >
                {paymentMethod === 'Cash on Delivery'
                  ? `Confirm order · ${grandTotal.toLocaleString()} MMK (Cash on Delivery)`
                  : `Proceed to payment · ${grandTotal.toLocaleString()} MMK`}
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
