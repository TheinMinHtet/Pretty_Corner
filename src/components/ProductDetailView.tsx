'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/lib/types';
import LazyImage from '@/components/LazyImage';

export default function ProductDetailView({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, t } = useStore();

  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openWhyLove, setOpenWhyLove] = useState(true);
  const [openHowToUse, setOpenHowToUse] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product.id, '', quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12">
      {/* Breadcrumb & Back Button */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870]">
          <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-[#38262e] capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-semibold text-[#b73d67] hover:text-[#8e294d] bg-[#fceef2] hover:bg-[#fadce6] px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>{t.back}</span>
        </button>
      </div>

      {/* Main Product Detail Section - Responsive 2-Column Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:pt-4">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-16 items-start">
          {/* Left Column: Gallery (col-span-12 on mobile, col-span-6 on tablet, col-span-7 on desktop) */}
          <div className="md:col-span-6 lg:col-span-7">
            <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] lg:h-[540px] bg-[#faf7f8] rounded-2xl overflow-hidden">
              <Image
                src={product.gallery[selectedGalleryIdx] || product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
              />

              {/* Bestseller / New Badge */}
              {product.badge && (
                <div className="absolute top-[18px] left-[20px] bg-white px-3 py-1 rounded-[6px] shadow-xs">
                  <span className="text-[#b73d67] text-[11px] font-bold tracking-wider uppercase">
                    {product.badge}
                  </span>
                </div>
              )}

            {/* Gallery Dots (mobile & desktop) */}
            <div className="md:hidden absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
                {product.gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGalleryIdx(idx)}
                    className={`rounded-full transition-all ${
                      selectedGalleryIdx === idx
                        ? 'bg-[#b73d67] w-2.5 h-2.5'
                        : 'bg-[#d8c1ca] w-1.5 h-1.5'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Gallery Thumbnails Strip */}
            <div className="flex gap-2.5 sm:gap-3 mt-4 overflow-x-auto no-scrollbar pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedGalleryIdx(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#faf7f8] border-2 transition-all cursor-pointer shrink-0 ${
                    selectedGalleryIdx === idx
                      ? 'border-[#b73d67] ring-2 ring-[#b73d67]/20'
                      : 'border-transparent hover:border-[#eedfe5]'
                  }`}
                >
                  <LazyImage
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Information & Purchase (col-span-12 on mobile, col-span-6 on tablet, col-span-5 on desktop) */}
          <div className="md:col-span-6 lg:col-span-5 px-3.5 min-[380px]:px-5 sm:px-0 pt-5 md:pt-0 flex flex-col">
            {/* Badge (if exists) */}
            {product.badge && (
              <span className="text-[11px] font-bold tracking-[1px] text-[#b73d67] uppercase mb-1">
                {product.badge}
              </span>
            )}

            {/* Product Name */}
            <h1 className="font-serif text-[22px] min-[380px]:text-[26px] sm:text-[36px] lg:text-[40px] font-medium leading-[1.3] text-[#38262e]">
              {product.name}
            </h1>

            {/* Price & Stock */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-[22px] sm:text-[26px] font-bold text-[#b73d67]">
                {unitPrice.toLocaleString()} MMK
              </span>
              <span className="text-[12px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                In stock
              </span>
            </div>

            {/* Short Description */}
            <p className="text-[14px] sm:text-[15px] text-[#7a6870] leading-relaxed mt-3">
              {product.description}
            </p>

            {/* Purchase Controls (Quantity + Add to Bag) */}
            <div className="mt-6 pt-6 border-t border-[#eedfe5]">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Quantity Selector */}
                <div className="h-[46px] sm:h-[52px] w-[84px] sm:w-[110px] border border-[#eedfe5] rounded-[10px] flex items-center justify-between px-2 sm:px-3 text-[#38262e] bg-white shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#b73d67] text-[18px] sm:text-[20px] font-medium cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-[14px] sm:text-[16px] font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-[#b73d67] text-[18px] sm:text-[20px] font-medium cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Big Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-0 h-[46px] sm:h-[52px] px-2.5 sm:px-4 ${
                    isAdded ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#b73d67] hover:bg-[#a33259]'
                  } text-white rounded-[10px] font-bold text-[13px] sm:text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm cursor-pointer whitespace-nowrap`}
                >
                  {isAdded ? (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="whitespace-nowrap">{t.addedToBag}</span>
                    </>
                  ) : (
                    <>
                      <span className="whitespace-nowrap">{t.addToBag}</span>
                      <span className="opacity-90 font-medium whitespace-nowrap text-[12px] sm:text-[14px]">· {totalPrice.toLocaleString()} MMK</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Accordions: Why We Love It & How to Use */}
            <div className="mt-8 border-t border-[#eedfe5] divide-y divide-[#eedfe5]">
              {/* Accordion 1: Why we love it */}
              {(product.description || (product.benefits && product.benefits.length > 0)) && (
                <div className="py-4">
                  <button
                    onClick={() => setOpenWhyLove(!openWhyLove)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="text-[15px] font-bold text-[#38262e]">{t.whyWeLoveIt}</span>
                    <span className="text-[20px] text-[#38262e] font-normal leading-none">
                      {openWhyLove ? '−' : '+'}
                    </span>
                  </button>
                  {openWhyLove && (
                    <div className="pt-2 text-[14px] text-[#7a6870] leading-relaxed space-y-2">
                      {product.description && <p>{product.description}</p>}
                      {product.benefits && product.benefits.length > 0 && (
                        <div className="space-y-1 pt-1 text-[13px]">
                          {product.benefits.map((b, i) => (
                            <p key={i} className="text-[#514149]">✓ {b}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 2: How to use */}
              {product.usage && (
                <div className="py-4">
                  <button
                    onClick={() => setOpenHowToUse(!openHowToUse)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="text-[15px] font-bold text-[#38262e]">{t.howToUse}</span>
                    <span className="text-[20px] text-[#38262e] font-normal leading-none">
                      {openHowToUse ? '−' : '+'}
                    </span>
                  </button>
                  {openHowToUse && (
                    <div className="pt-2 text-[14px] text-[#7a6870] leading-relaxed">
                      <p>{product.usage}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
