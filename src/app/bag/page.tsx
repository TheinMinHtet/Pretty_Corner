'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import LazyImage from '@/components/LazyImage';
import { BagPageSkeleton } from '@/components/Skeletons';

export default function ShoppingBagPage() {
  const router = useRouter();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
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
    isMounted,
    t,
    language,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const promoItemsCount = lineItemsPricing
    ? lineItemsPricing
      .filter((lp) => lp.discountAmount > 0)
      .reduce((sum, lp) => sum + lp.quantity, 0)
    : 0;

  if (!isMounted) {
    return <BagPageSkeleton />;
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12">
      {/* Breadcrumb & Heading - Consistent across mobile and desktop */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870]">
            <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
            <span>/</span>
            <span className="text-[#38262e] font-medium">{t.bagTitle}</span>
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

        <h1 className={`font-serif font-medium text-[#38262e] ${language === 'my'
            ? 'text-[24px] sm:text-[30px]'
            : 'text-[30px] sm:text-[38px]'
          }`}>
          {t.bagTitle}
        </h1>
        <p className="font-sans text-[13px] sm:text-[15px] text-[#7a6870] mt-1">
          {cart.length > 0
            ? language === 'my'
              ? `အိမ်အရောက်ပို့ဆောင်ရန် ပစ္စည်း ${cart.length} မျိုး အသင့်ရှိပါသည်။`
              : `${cart.length} lovely ${cart.length === 1 ? 'find' : 'finds'} ready for doorstep delivery.`
            : t.bagSubtitleEmpty}
        </p>
      </div>

      {/* Main Content Area - Responsive 2-Column Grid */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2">
        {cart.length > 0 ? (
          <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
            {/* Left Column: Bag Line Items (col-span-12 on mobile, col-span-7 or 8 on desktop) */}
            <div className="md:col-span-7 lg:col-span-8 divide-y divide-[#eedfe5]">
              {cart.map((item) => {
                const itemPricing = lineItemsPricing?.find((lp) => lp.itemId === item.id);
                const isDiscounted = Boolean(itemPricing && itemPricing.discountAmount > 0);
                const unitDiscount = isDiscounted ? Math.round(itemPricing!.discountAmount / item.quantity) : 0;
                const finalUnitPrice = isDiscounted ? item.price - unitDiscount : item.price;

                return (
                  <div key={item.id} className="py-4 sm:py-5 flex gap-3 sm:gap-6 items-center">
                    <div className="relative w-[88px] sm:w-[120px] h-[108px] sm:h-[140px] bg-[#f9f5f7] rounded-[10px] overflow-hidden shrink-0">
                      <LazyImage
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 88px, 120px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-[126px] sm:h-[140px] py-1">
                      <div>
                        <h3 className="font-sans text-[16px] sm:text-[18px] font-bold text-[#38262e] leading-snug line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-[12px] sm:text-[13px] text-[#7a6870] mt-0.5">
                          {item.size ? `${item.size} · ` : ''}{t.standardPackaging}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {isDiscounted ? (
                            <>
                              <span className="text-[15px] sm:text-[16px] font-bold text-[#b73d67]">
                                {finalUnitPrice.toLocaleString()} MMK
                              </span>
                              <span className="text-[12px] text-[#7a6870] line-through">
                                {item.price.toLocaleString()} MMK
                              </span>
                              <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-[#b73d67] bg-[#fceef2] px-2 py-0.5 rounded-full border border-[#f5d9e3]">
                                ✨ {appliedPromo?.code} (-{appliedPromo?.discountPercentage}%)
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-[15px] sm:text-[16px] font-bold text-[#38262e]">
                                {item.price.toLocaleString()} MMK
                              </span>
                              {appliedPromo && (
                                <span className="inline-flex items-center text-[10px] sm:text-[11px] font-medium text-[#7a6870] bg-[#f7f4f5] px-2 py-0.5 rounded-full border border-[#eedfe5]">
                                  Regular Item
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity control */}
                        <div className="h-[36px] w-[108px] bg-white border border-[#eedfe5] rounded-[8px] flex items-center justify-between px-2.5 text-[#38262e]">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="px-1 text-[18px] font-medium hover:text-[#b73d67] cursor-pointer"
                          >
                            −
                          </button>
                          <span className="text-[14px] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="px-1 text-[18px] font-medium hover:text-[#b73d67] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Trash removal */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-[#7a6870] hover:text-[#b73d67] hover:bg-[#fceef2] rounded-full transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary Card (sticky on desktop) */}
            <div className="md:col-span-5 lg:col-span-4 mt-6 md:mt-0">
              <div className="sticky top-28 bg-[#fcf9fa] p-5 sm:p-6 lg:p-7 rounded-2xl border border-[#eedfe5]">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#eedfe5]">
                  <h2 className="font-serif text-[22px] sm:text-[26px] font-medium text-[#38262e]">
                    {t.orderSummary}
                  </h2>
                  <span className="text-[12px] font-medium text-[#7a6870]">
                    {cartCount} {cartCount === 1 ? t.itemCountSingular : t.itemsCount}
                  </span>
                </div>

                {/* Products miniature list with customer quantity and item total */}
                <div className="max-h-64 overflow-y-auto divide-y divide-[#eedfe5]/70 pr-3 mb-3 custom-scrollbar">
                  {cart.map((item) => {
                    const itemPricing = lineItemsPricing?.find((lp) => lp.itemId === item.id);
                    const isDiscounted = Boolean(itemPricing && itemPricing.discountAmount > 0);
                    const finalLineTotal = itemPricing ? itemPricing.finalTotal : (item.price * item.quantity);

                    return (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-[13px]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-10 h-10 rounded-lg bg-white border border-[#eedfe5] overflow-hidden shrink-0">
                            <LazyImage src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                          </div>
                          <div className="min-w-0 flex flex-col">
                            <div className="flex items-center">
                              <span className="font-medium text-[#38262e] truncate">{item.name}</span>
                              <span className="inline-flex items-center font-bold text-[#b73d67] bg-[#fceef2] border border-[#f5d9e3] px-1.5 py-0.5 rounded text-[11px] ml-2 shrink-0">
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

                {/* Promo Code Input Box */}
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-[#eedfe5] mb-3.5 shadow-2xs">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-[#fceef2] px-3 py-2 rounded-lg border border-[#f1d3df]">
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
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!promoInput.trim()) return;
                        const res = applyPromoCode(promoInput.trim());
                        setPromoFeedback(res.message);
                        if (res.success) {
                          setPromoInput('');
                        }
                      }}
                      className="space-y-1.5"
                    >
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder={t.promoPlaceholder}
                          className="flex-1 min-w-0 h-[38px] px-3 rounded-lg border border-[#eedfe5] text-[12.5px] sm:text-[13px] font-mono uppercase text-[#38262e] placeholder:text-[#a89aa0] focus:outline-none focus:border-[#b73d67] transition-colors"
                        />
                        <button
                          type="submit"
                          className="h-[38px] px-3.5 sm:px-4 bg-[#38262e] hover:bg-[#b73d67] text-white text-[12px] font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          {t.apply}
                        </button>
                      </div>
                      {promoFeedback && (
                        <p className={`text-[11px] font-medium mt-1 ${appliedPromo ? 'text-emerald-700' : 'text-[#b73d67]'}`}>
                          {promoFeedback}
                        </p>
                      )}
                    </form>
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
                    <span className="text-[#b73d67]">{cartTotal.toLocaleString()} MMK</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full mt-5 h-[52px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] flex items-center justify-center hover:bg-[#a33259] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  {t.checkoutWithTotal} {cartTotal.toLocaleString()} MMK
                </Link>

                <div className="text-center mt-3.5">
                  <Link href="/shop" className="text-[13px] font-bold text-[#b73d67] hover:underline">
                    {t.continueShopping}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#fceef2] text-[#b73d67] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h2 className="font-serif text-[28px] text-[#38262e]">{t.bagEmptyTitle}</h2>
            <p className="text-[14px] text-[#7a6870] mt-2">
              {t.bagEmptySubtitle}
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center justify-center px-8 h-[48px] bg-[#b73d67] text-white rounded-[10px] text-[14px] font-bold hover:bg-[#a33259] transition-all cursor-pointer"
            >
              {t.startShopping}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
