'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
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

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, cartCount, addToCart, isMounted } = useStore();

  const initialCat = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState<string>(initialCat);
  const [searchFilter, setSearchFilter] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  // Sync state when URL query params change (e.g. from Home page Others popup)
  useEffect(() => {
    const cat = searchParams.get('category');
    setActiveCategory(cat || 'all');
  }, [searchParams]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchFilter(q);
    }
  }, [searchParams]);

  // Filter Modal specific states
  const [maxPrice, setMaxPrice] = useState<number>(60000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);

  const categoriesList = useMemo(() => [
    {
      id: 'all',
      label: 'All Products',
      description: 'Explore full catalog across beauty, tech & variety',
      count: products.length,
    },
    {
      id: 'electrical',
      label: 'Electrical & Gadgets',
      description: 'Sonic beauty tech, touch LED mirrors & smart humidifiers',
      count: products.filter((p) => p.category === 'electrical').length,
    },
    {
      id: 'skincare',
      label: 'Skincare',
      description: 'Gentle barrier serums, moisturizers & UV daily defense',
      count: products.filter((p) => p.category === 'skincare').length,
    },
    {
      id: 'makeup',
      label: 'Makeup',
      description: 'Breathable cheek tints, lip glazes & complexion picks',
      count: products.filter((p) => p.category === 'makeup').length,
    },
    {
      id: 'lifestyle',
      label: 'Lifestyle & Variety',
      description: 'Silk hair accessories, vacuum tumblers & daily finds',
      count: products.filter((p) => p.category === 'lifestyle').length,
    },
    {
      id: 'lenses',
      label: 'Contact Lenses',
      description: 'Hydrated daily and monthly comfort beauty lenses',
      count: products.filter((p) => p.category === 'lenses').length,
    },
    {
      id: 'more',
      label: 'Accessories & More',
      description: 'Pure silk ties, beauty tools & thoughtful additions',
      count: products.filter((p) => p.category === 'more').length,
    },
  ], [products]);

  // Limit visible pill bar to 5 categories (including All Products); others go into '+ Others'
  const visibleCategories = useMemo(() => {
    const top5 = categoriesList.slice(0, 5);
    // If an "other" category is active, display it so the active state is always visible
    if (activeCategory !== 'all' && !top5.some((c) => c.id === activeCategory)) {
      const activeObj = categoriesList.find((c) => c.id === activeCategory);
      if (activeObj) {
        return [...top5.slice(0, 4), activeObj];
      }
    }
    return top5;
  }, [categoriesList, activeCategory]);

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'electrical':
        return 'Electrical & Smart Gadgets';
      case 'skincare':
        return 'Skincare Essentials';
      case 'makeup':
        return 'Everyday Makeup';
      case 'lifestyle':
        return 'Lifestyle & Variety';
      case 'lenses':
        return 'Contact Lenses & Eye Care';
      case 'more':
        return 'Accessories & More';
      default:
        return 'The Variety Corner';
    }
  };

  const getCategorySubtitle = () => {
    switch (activeCategory) {
      case 'electrical':
        return 'Sonic beauty devices, touch LED mirrors, humidifiers & smart lifestyle tech.';
      case 'skincare':
        return 'Gentle serums, barrier moisturizers, and UV daily defense formulas.';
      case 'makeup':
        return 'Breathable cheek tints, cushion lip glazes, and daily complexion picks.';
      case 'lifestyle':
        return 'Silk hair ties, vacuum tumblers, and thoughtful everyday accessories.';
      case 'lenses':
        return 'Moisture-rich daily and monthly contact lenses for natural beauty.';
      case 'more':
        return 'Pure mulberry silk scrunchies, cosmetic tools & everyday add-ons.';
      default:
        return 'From genuine skincare & makeup to smart electrical gadgets and variety essentials.';
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // Search term
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      // In stock
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Max price
      if (p.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return 0; // featured default
    });
  }, [products, activeCategory, searchFilter, inStockOnly, maxPrice, sortBy]);

  return (
    <div className="w-full bg-white flex flex-col min-h-full">
      {/* 1. Mobile Header (hidden on desktop because desktop Header renders it) */}
      <header className="md:hidden px-5 pt-3.5 pb-2 border-b border-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="p-1 -ml-1 text-[#38262e] hover:opacity-70 transition-opacity"
            aria-label="Back to home"
          >
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="font-serif text-[28px] font-medium text-[#38262e]">
            {getCategoryTitle()}
          </h1>

          <Link href="/bag" className="relative p-1 text-[#38262e] hover:opacity-80 transition-opacity">
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <CartBadge className="absolute -top-1 -right-1 bg-[#b73d67] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" />
          </Link>
        </div>

        <p className="font-sans text-[12px] text-[#7a6870] mt-2">
          {getCategorySubtitle()}
        </p>

        {/* Mobile Search input */}
        <div className="mt-3.5 bg-[#f7f4f5] h-[44px] rounded-[9px] flex items-center px-3.5 gap-2.5 focus-within:ring-1 focus-within:ring-[#b73d67]">
          <svg className="w-[20px] h-[20px] text-[#7a6870] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search electrical, beauty, gadgets, lifestyle…"
            className="bg-transparent text-[13px] text-[#38262e] placeholder-[#7a6870] outline-none w-full"
          />
          {searchFilter && (
            <button onClick={() => setSearchFilter('')} className="text-[#7a6870] text-xs hover:text-[#38262e]">
              ✕
            </button>
          )}
        </div>
      </header>

      {/* 2. Desktop Catalog Header & Breadcrumb (md and up) */}
      <div className="hidden md:block w-full max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#7a6870] mb-3">
          <Link href="/" className="hover:text-[#38262e]">Home</Link>
          <span>/</span>
          <span className="text-[#38262e] font-medium capitalize">{activeCategory}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-[36px] lg:text-[42px] font-medium text-[#38262e] leading-tight">
              {getCategoryTitle()}
            </h1>
            <p className="font-sans text-[14px] text-[#7a6870] mt-1.5 max-w-xl">
              {getCategorySubtitle()}
            </p>
          </div>

          {/* Desktop Search Bar */}
          <div className="w-full md:w-[320px] lg:w-[380px] shrink-0">
            <div className="bg-[#f7f4f5] border border-[#eedfe5] focus-within:border-[#b73d67] focus-within:bg-white h-[44px] rounded-full flex items-center px-4 gap-2.5 transition-all shadow-2xs">
              <svg className="w-4 h-4 text-[#7a6870] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search products, electricals, gadgets…"
                className="bg-transparent text-[13px] text-[#38262e] placeholder-[#7a6870] outline-none w-full"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="text-[#7a6870] hover:text-[#38262e] text-xs p-1 transition-colors"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="text-right mt-1.5">
              <span className="text-[12px] text-[#7a6870]">
                Showing <strong className="text-[#38262e]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-2 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`h-[36px] sm:h-[38px] px-4 sm:px-5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#38262e] text-white shadow-xs'
                  : 'bg-[#faf7f8] text-[#38262e] border border-[#eedfe5] hover:bg-[#fceef2]'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            onClick={() => setShowCategoryModal(true)}
            className={`h-[36px] sm:h-[38px] px-4 rounded-full text-[13px] font-bold whitespace-nowrap border transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              !categoriesList.slice(0, 5).some((c) => c.id === activeCategory) && activeCategory !== 'all'
                ? 'bg-[#38262e] text-white border-[#38262e]'
                : 'bg-[#faf7f8] text-[#b73d67] border-[#eedfe5] hover:bg-[#fceef2]'
            }`}
          >
            <span>+ Others</span>
            {categoriesList.length > 5 && (
              <span className="text-[11px] opacity-75">
                ({categoriesList.length - 5})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Catalog Section - Responsive Container */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-3 pb-12">
        {/* Controls Toolbar: Active Filters & Count on Left, Filter & Sort on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eedfe5]">
          {/* Left: Product Counter & Active Filter Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[13px] text-[#7a6870]">
              Showing <strong className="text-[#38262e]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>

            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#fceef2] text-[#b73d67] text-[12px] font-semibold px-2.5 py-0.5 rounded-full border border-[#f5d9e3]">
                <span>{categoriesList.find((c) => c.id === activeCategory)?.label || activeCategory}</span>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="hover:text-[#38262e] cursor-pointer ml-0.5"
                  title="Show all products"
                >
                  ✕
                </button>
              </span>
            )}

            {searchFilter && (
              <span className="inline-flex items-center gap-1.5 bg-[#f7f4f5] text-[#38262e] text-[12px] font-medium px-2.5 py-0.5 rounded-full border border-[#eedfe5]">
                <span>&quot;{searchFilter}&quot;</span>
                <button
                  onClick={() => setSearchFilter('')}
                  className="hover:text-[#b73d67] cursor-pointer ml-0.5"
                  title="Clear search"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          {/* Right: Filter & Sort Bar */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <button
              onClick={() => setShowFilterModal(true)}
              className={`h-[38px] px-3.5 sm:px-4 rounded-[9px] border flex items-center gap-2 text-[13px] transition-colors cursor-pointer ${
                maxPrice < 60000 || !inStockOnly || activeCategory !== 'all'
                  ? 'bg-[#fceef2] border-[#b73d67] text-[#b73d67] font-semibold'
                  : 'bg-white border-[#eedfe5] text-[#38262e] hover:border-[#b73d67]'
              }`}
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Filters</span>
              {(maxPrice < 60000 || !inStockOnly || activeCategory !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67]" />
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#eedfe5] rounded-[9px] text-[13px] text-[#38262e] pr-8 pl-3.5 h-[38px] focus:outline-none focus:border-[#b73d67] cursor-pointer font-normal"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <span className="absolute right-3 top-2.5 pointer-events-none text-[#7a6870] text-xs">⌄</span>
            </div>
          </div>
        </div>

        {/* Responsive Product Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 mt-6">
            {filteredProducts.map((product) => {
              return (
                <div key={product.id} className="flex flex-col group">
                  <div className="relative w-full h-[204px] sm:h-[230px] md:h-[260px] lg:h-[280px] bg-[#f9f5f7] rounded-[12px] overflow-hidden">
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
        ) : (
          <div className="py-16 text-center">
            <p className="font-serif text-[24px] text-[#38262e]">No products match your filters</p>
            <p className="text-[14px] text-[#7a6870] mt-1.5">Try adjusting your price range or search keyword.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchFilter('');
                setMaxPrice(60000);
                setInStockOnly(false);
              }}
              className="mt-5 px-6 py-2.5 bg-[#b73d67] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#a33259] transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>

      {/* 4. Filter Modal (35:632) - Responsive: Slide-up on mobile, Centered Dialog on desktop */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#38262e]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowFilterModal(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full md:max-w-md bg-white rounded-t-[20px] md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-6 md:zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#eedfe5]">
              <h2 className="font-serif text-[24px] font-medium text-[#38262e]">
                Filter & sort
              </h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-[#fceef2] flex items-center justify-center text-[#38262e] hover:bg-[#f6e1e8]"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Categories */}
              <div>
                <p className="text-[13px] font-bold text-[#38262e] mb-2 uppercase tracking-wide">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`h-[34px] px-3.5 rounded-[17px] text-[12px] transition-colors cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-[#38262e] text-white font-medium'
                          : 'bg-[#fceef2] text-[#38262e]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <div className="flex justify-between items-center text-[13px] font-bold text-[#38262e] mb-2">
                  <span>Price range</span>
                  <span className="text-[#b73d67]">0 — {maxPrice.toLocaleString()} MMK</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="60000"
                  step="2000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#b73d67] cursor-pointer"
                />
              </div>

              {/* Availability */}
              <div>
                <p className="text-[13px] font-bold text-[#38262e] mb-2 uppercase tracking-wide">Availability</p>
                <label className="flex items-center gap-2.5 text-[13px] text-[#38262e] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#b73d67]"
                  />
                  In stock items only
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-colors cursor-pointer"
                >
                  Show matching products
                </button>

                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchFilter('');
                    setMaxPrice(60000);
                    setInStockOnly(true);
                    setSortBy('featured');
                  }}
                  className="w-full h-[44px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] hover:bg-[#f6e1e8] transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Popup Modal ("+ Others") */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#38262e]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCategoryModal(false)}
          />

          {/* Dialog */}
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-[20px] sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#eedfe5]">
              <div>
                <h3 className="font-serif text-[22px] font-medium text-[#38262e]">
                  All Categories
                </h3>
                <p className="text-[12px] text-[#7a6870] mt-0.5">
                  Select a category to view
                </p>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-8 h-8 rounded-full bg-[#fceef2] flex items-center justify-center text-[#38262e] hover:bg-[#f6e1e8] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2.5">
              {categoriesList.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setShowCategoryModal(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-[12px] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#fceef2] border-[#b73d67] shadow-xs'
                        : 'bg-white border-[#eedfe5] hover:border-[#b73d67] hover:bg-[#faf7f8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[14px] font-bold ${isSelected ? 'text-[#b73d67]' : 'text-[#38262e]'}`}>
                          {cat.label}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#b73d67] text-white font-bold px-1.5 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#7a6870] mt-0.5 line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                    <span className="text-[12px] font-semibold text-[#7a6870] bg-[#faf7f8] px-2.5 py-1 rounded-full border border-[#eedfe5] shrink-0">
                      {cat.count} items
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#7a6870]">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
