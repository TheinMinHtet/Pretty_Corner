'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/lib/types';

const CartBadge = dynamic(() => import('@/components/CartBadge'), { ssr: false });

export default function ProductDetailView({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, cartCount, isMounted } = useStore();

  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [openWhyLove, setOpenWhyLove] = useState(true);
  const [openHowToUse, setOpenHowToUse] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);

  const currentSizeObj = product.sizes.find((s) => s.name === selectedSize) || product.sizes[0];
  const unitPrice = currentSizeObj?.price || product.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product.id, selectedSize, quantity);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2200);
  };

  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12">
      {/* Breadcrumb - Consistent across mobile and desktop */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-3 flex items-center gap-2 text-[12px] sm:text-[13px] text-[#7a6870]">
        <Link href="/" className="hover:text-[#38262e]">Home</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-[#38262e] capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#38262e] font-medium truncate">{product.name}</span>
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
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Information & Purchase (col-span-12 on mobile, col-span-6 on tablet, col-span-5 on desktop) */}
          <div className="md:col-span-6 lg:col-span-5 px-5 sm:px-0 pt-6 md:pt-0 flex flex-col">
            {/* Tagline & Brand */}
            <span className="text-[11px] font-bold tracking-[1.5px] text-[#7a6870] uppercase">
              {product.brand || 'Pretty Essentials'} · {product.tagline}
            </span>

            {/* Product Name */}
            <h1 className="font-serif text-[30px] sm:text-[36px] lg:text-[40px] font-medium leading-[1.1] text-[#38262e] mt-1.5">
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

            {/* Size Selector */}
            <div className="mt-6 pt-5 border-t border-[#eedfe5]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[13px] font-bold text-[#38262e] uppercase tracking-wide">
                  Select Size
                </span>
                <span className="text-[12px] text-[#7a6870]">
                  Standard formulation
                </span>
              </div>

              <div className="flex gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSize(s.name)}
                    className={`h-[42px] px-5 rounded-[10px] text-[13px] font-medium transition-all cursor-pointer ${
                      selectedSize === s.name
                        ? 'bg-[#38262e] text-white shadow-sm'
                        : 'bg-[#faf7f8] text-[#38262e] border border-[#eedfe5] hover:bg-[#fceef2]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Controls (Quantity + Add to Bag) */}
            <div className="mt-6 pt-6 border-t border-[#eedfe5]">
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="h-[52px] w-[120px] border border-[#eedfe5] rounded-[10px] flex items-center justify-between px-3 text-[#38262e] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#b73d67] text-[20px] font-medium cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-[16px] font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-[#b73d67] text-[20px] font-medium cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Big Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-[52px] bg-[#b73d67]/80 hover:bg-[#b73d67] text-white rounded-[10px] font-bold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center shadow-sm cursor-pointer"
                >
                  Add to bag · {totalPrice.toLocaleString()} MMK
                </button>
              </div>
            </div>

            {/* Accordions: Why We Love It & How to Use */}
            <div className="mt-8 border-t border-[#eedfe5] divide-y divide-[#eedfe5]">
              {/* Accordion 1: Why we love it */}
              <div className="py-4">
                <button
                  onClick={() => setOpenWhyLove(!openWhyLove)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-[15px] font-bold text-[#38262e]">Why we love it</span>
                  <span className="text-[20px] text-[#38262e] font-normal leading-none">
                    {openWhyLove ? '−' : '+'}
                  </span>
                </button>
                {openWhyLove && (
                  <div className="pt-2 text-[14px] text-[#7a6870] leading-relaxed space-y-2">
                    <p>{product.description}</p>
                    <div className="space-y-1 pt-1 text-[13px]">
                      {product.benefits.map((b, i) => (
                        <p key={i} className="text-[#514149]">✓ {b}</p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="bg-[#fceef2] text-[#b73d67] text-[11px] font-bold px-2.5 py-1 rounded">
                        Suitable for all skin types
                      </span>
                      <span className="bg-[#fceef2] text-[#b73d67] text-[11px] font-bold px-2.5 py-1 rounded">
                        Non-greasy finish
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: How to use */}
              <div className="py-4">
                <button
                  onClick={() => setOpenHowToUse(!openHowToUse)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-[15px] font-bold text-[#38262e]">
                    {product.category === 'electrical' || product.category === 'lifestyle'
                      ? 'How to use & specifications'
                      : 'How to use & ingredients'}
                  </span>
                  <span className="text-[20px] text-[#38262e] font-normal leading-none">
                    {openHowToUse ? '−' : '+'}
                  </span>
                </button>
                {openHowToUse && (
                  <div className="pt-2 text-[14px] text-[#7a6870] leading-relaxed space-y-2">
                    <p>
                      <strong className="text-[#38262e]">Directions / Usage:</strong> {product.usage}
                    </p>
                    <p>
                      <strong className="text-[#38262e]">
                        {product.category === 'electrical' || product.category === 'lifestyle'
                          ? 'Specifications:'
                          : 'Ingredients:'}
                      </strong>{' '}
                      {product.specs || product.ingredients}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Added to Bag Toast Notification */}
      {showAddedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#38262e]/90 backdrop-blur-md border border-white/20 text-white text-[13px] font-medium px-5 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-in fade-in zoom-in-95">
          <span>✓ Added to your bag!</span>
          <Link href="/bag" className="text-[#fceef2] underline font-bold ml-1">
            View Bag
          </Link>
        </div>
      )}
    </div>
  );
}
