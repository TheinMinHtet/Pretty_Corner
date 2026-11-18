'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

const CartBadge = dynamic(() => import('@/components/CartBadge'), { ssr: false });
const ProductCardStepper = dynamic(() => import('@/components/ProductCardStepper'), {
  ssr: false,
  loading: () => (
    <button className="h-[30px] sm:h-[32px] px-3 bg-[#b73d67] text-white rounded-[7px] text-[11px] sm:text-[12px] font-bold flex items-center gap-1 shadow-xs">
      + Add
    </button>
  ),
});
const WishlistButton = dynamic(() => import('@/components/WishlistButton'), {
  ssr: false,
  loading: () => (
    <div className="absolute top-2.5 right-2.5 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
      <svg className="w-4 h-4 text-[#7a6870] fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </div>
  ),
});

export default function HomePage() {
  const router = useRouter();
  const { products, cartCount, isWishlisted, toggleWishlist, setSearchQuery, addToCart, isMounted } = useStore();
  const [activeCategory, setActiveCategory] = useState<'skincare' | 'makeup' | 'lenses' | 'more'>('skincare');
  const [searchInput, setSearchInput] = useState('');

  // Show up to 4 items on bestsellers to look beautiful on 2-col, 3-col, and 4-col responsive layouts
  const bestsellers = products.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      router.push(`/shop?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <div className="w-full bg-white flex flex-col min-h-full">


      {/* 2. Mobile Header (hidden on desktop because desktop Header is active) */}
      <header className="md:hidden px-5 pt-3.5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-[#38262e]">
              Pretty Corner
            </h1>
            <p className="font-sans text-[9px] font-medium tracking-[1.5px] text-[#7a6870] uppercase mt-1">
              Your Everyday Beauty Edit
            </p>
          </div>

          <Link href="/bag" className="relative p-2 text-[#38262e] hover:opacity-80 transition-opacity">
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <CartBadge className="absolute top-0 right-0 bg-[#b73d67] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" />
          </Link>
        </div>

        {/* Mobile Search bar */}
        <form onSubmit={handleSearchSubmit} className="mt-4">
          <div className="bg-[#f7f4f5] h-[42px] rounded-[9px] flex items-center px-3.5 gap-2.5 transition-all focus-within:ring-1 focus-within:ring-[#b73d67]">
            <svg className="w-[19px] h-[19px] text-[#7a6870] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search your next beauty favorite"
              className="bg-transparent text-[13px] text-[#38262e] placeholder-[#7a6870] outline-none w-full font-normal"
            />
          </div>
        </form>
      </header>

      {/* 3. Hero Editorial - Responsive Container */}
      <section className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 sm:pt-4 md:pt-6">
        <div className="relative w-full h-[386px] sm:h-[460px] md:h-[500px] lg:h-[540px] sm:rounded-2xl md:rounded-3xl overflow-hidden bg-[#faf7f8]">
          <Image
            src="/assets/hero.png"
            alt="The Daily Glow Edit"
            fill
            priority
            className="object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />

          <div className="absolute inset-0 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-between">
            <div className="max-w-lg">
              <span className="inline-block font-sans text-[11px] sm:text-[12px] font-bold tracking-[2px] text-[#b73d67] uppercase">
                The Daily Glow Edit
              </span>
              <h2 className="font-serif text-[41px] sm:text-[50px] md:text-[58px] lg:text-[64px] font-medium leading-[1.05] text-[#38262e] mt-2">
                A little care.<br />A lot of glow.
              </h2>
              <p className="font-sans text-[14px] sm:text-[16px] text-[#7a6870] mt-3 max-w-md">
                Good skin days start here. Thoughtful formulas designed for radiant everyday wear.
              </p>
            </div>

            <div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-[#b73d67] text-white text-[14px] sm:text-[15px] font-bold h-[48px] sm:h-[52px] px-7 sm:px-8 rounded-[12px] shadow-sm hover:bg-[#a33259] active:scale-[0.98] transition-all"
              >
                Find your glow →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categories - Responsive Container */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[24px] sm:text-[28px] font-medium text-[#38262e]">
            Your beauty, your way
          </h3>
          <Link
            href="/shop"
            className="hidden sm:inline-block text-[13px] font-bold text-[#b73d67] hover:underline"
          >
            Explore all categories →
          </Link>
        </div>

        <div className="flex items-center gap-2.5 mt-3.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveCategory('skincare')}
            className={`h-[36px] sm:h-[40px] px-5 rounded-[20px] text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'skincare'
                ? 'bg-[#38262e] text-white'
                : 'bg-[#fceef2] text-[#38262e] hover:bg-[#f6e1e8]'
            }`}
          >
            Skincare
          </button>
          <button
            onClick={() => setActiveCategory('makeup')}
            className={`h-[36px] sm:h-[40px] px-5 rounded-[20px] text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'makeup'
                ? 'bg-[#38262e] text-white'
                : 'bg-[#fceef2] text-[#38262e] hover:bg-[#f6e1e8]'
            }`}
          >
            Makeup
          </button>
          <button
            onClick={() => setActiveCategory('lenses')}
            className={`h-[36px] sm:h-[40px] px-5 rounded-[20px] text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'lenses'
                ? 'bg-[#38262e] text-white'
                : 'bg-[#fceef2] text-[#38262e] hover:bg-[#f6e1e8]'
            }`}
          >
            Lenses
          </button>
          <button
            onClick={() => setActiveCategory('more')}
            className={`h-[36px] sm:h-[40px] px-5 rounded-[20px] text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'more'
                ? 'bg-[#38262e] text-white'
                : 'bg-[#fceef2] text-[#38262e] hover:bg-[#f6e1e8]'
            }`}
          >
            More Essentials
          </button>
        </div>
      </section>

      {/* 5. Bestsellers - Responsive Grid */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-10">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h3 className="font-serif text-[28px] sm:text-[32px] font-medium text-[#38262e]">
              Loved for a reason
            </h3>
            <p className="font-sans text-[13px] text-[#7a6870] mt-0.5 hidden sm:block">
              Daily bestsellers crafted for authentic results.
            </p>
          </div>
          <Link
            href={`/shop?category=${activeCategory}`}
            className="text-[13px] font-bold text-[#b73d67] hover:underline"
          >
            Shop all →
          </Link>
        </div>

        {/* Responsive Product Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {bestsellers.map((product) => {
            const wishlisted = isWishlisted(product.id);
            return (
              <div key={product.id} className="flex flex-col group">
                <div className="relative w-full h-[184px] sm:h-[230px] md:h-[260px] lg:h-[280px] bg-[#f9f5f7] rounded-[12px] overflow-hidden">
                  <Link href={`/product/${product.id}`} className="block relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-white text-[#b73d67] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-[5px] shadow-sm select-none">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <WishlistButton productId={product.id} />
                </div>

                {/* Details */}
                <div className="pt-3">
                  <p className="text-[10px] sm:text-[11px] font-medium tracking-wide text-[#7a6870] uppercase">
                    {product.tagline}
                  </p>
                  <Link href={`/product/${product.id}`}>
                    <h4 className="text-[15px] sm:text-[16px] font-normal text-[#38262e] hover:text-[#b73d67] transition-colors line-clamp-1 mt-0.5">
                      {product.name}
                    </h4>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[14px] sm:text-[15px] font-bold text-[#b73d67]">
                      {product.price.toLocaleString()} MMK
                    </p>
                    <ProductCardStepper productId={product.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Brand Promise - Responsive Banner */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10">
        <div className="bg-[#fceef2] rounded-2xl p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h4 className="font-serif text-[24px] sm:text-[30px] font-medium leading-snug text-[#38262e]">
              A corner for your kind of beautiful.
            </h4>
            <p className="text-[13px] sm:text-[15px] text-[#7a6870] leading-relaxed mt-2">
              Thoughtfully picked. Lovingly packed. Authentic beauty, without the fuss. Handcrafted skincare essentials delivered directly to your doorstep in Yangon.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="h-[46px] px-6 bg-[#38262e] text-white rounded-[10px] text-[13px] font-bold flex items-center justify-center hover:bg-[#b73d67] transition-colors"
            >
              Shop Catalog
            </Link>
            <Link
              href="/about"
              className="h-[46px] px-6 bg-white text-[#38262e] border border-[#eedfe5] rounded-[10px] text-[13px] font-bold flex items-center justify-center hover:bg-[#faf5f7] transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Mobile quick links (hidden on desktop because desktop Footer handles it) */}
        <div className="md:hidden flex items-center justify-center gap-3 text-[11px] text-[#7a6870] mt-5 font-normal">
          <Link href="/about" className="hover:text-[#38262e] hover:underline">
            About us
          </Link>
          <span>·</span>
          <Link href="/policies/shipping" className="hover:text-[#38262e] hover:underline">
            Delivery & returns
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-[#38262e] hover:underline">
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
