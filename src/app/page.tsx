'use client';

import React, { useState, useMemo } from 'react';
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

export default function HomePage() {
  const router = useRouter();
  const { products, cartCount, setSearchQuery, addToCart, isMounted } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  const categoriesList = useMemo(() => [
    {
      id: 'all',
      label: 'All Products',
      description: 'Explore our complete variety of products',
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
      label: 'Lifestyle & Others',
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

  // Matching products for the selected category
  const matchingProducts = useMemo(() => {
    return activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // Show top 4 curated highlights as preview
  const displayedProducts = useMemo(() => {
    return matchingProducts.slice(0, 4);
  }, [matchingProducts]);

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
      {/* Hero Editorial - Responsive Container */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        <div className="relative w-full h-[386px] sm:h-[460px] md:h-[500px] lg:h-[540px] rounded-2xl md:rounded-3xl overflow-hidden bg-[#faf7f8]">
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
                The Curated Variety Edit
              </span>
              <h2 className="font-serif text-[41px] sm:text-[50px] md:text-[58px] lg:text-[64px] font-medium leading-[1.05] text-[#38262e] mt-2">
                Beauty, gadgets &<br />daily essentials.
              </h2>
              <p className="font-sans text-[14px] sm:text-[16px] text-[#7a6870] mt-3 max-w-md">
                Your corner for all things lovely. Authentic cosmetics, smart electrical devices, and everyday lifestyle finds delivered to your door.
              </p>
            </div>

            <div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-[#b73d67] text-white text-[14px] sm:text-[15px] font-bold h-[48px] sm:h-[52px] px-7 sm:px-8 rounded-[12px] shadow-sm hover:bg-[#a33259] active:scale-[0.98] transition-all"
              >
                Explore all products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categories - Responsive Container */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-[22px] sm:text-[28px] font-medium text-[#38262e]">
            Explore by category
          </h3>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="text-[13px] font-bold text-[#b73d67] hover:underline cursor-pointer shrink-0"
          >
            All Categories
          </button>
        </div>

        <div className="flex items-center gap-2.5 mt-3.5 overflow-x-auto no-scrollbar pb-1">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`h-[36px] sm:h-[40px] px-5 rounded-[20px] text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#38262e] text-white'
                  : 'bg-[#fceef2] text-[#38262e] hover:bg-[#f6e1e8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 5. Bestsellers - Responsive Grid */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-10">
        <div className="flex items-start sm:items-baseline justify-between gap-3 mb-5">
          <div className="min-w-0">
            <h3 className="font-serif text-[22px] sm:text-[32px] font-medium text-[#38262e] leading-tight">
              Top Picks & Highlights
            </h3>
            <p className="font-sans text-[12px] sm:text-[13px] text-[#7a6870] mt-1">
              Showing featured highlights. Explore our complete collection in the shop.
            </p>
          </div>
          <Link
            href={activeCategory === 'all' ? '/shop' : `/shop?category=${activeCategory}`}
            className="text-[13px] font-bold text-[#b73d67] hover:underline shrink-0 whitespace-nowrap pt-1 sm:pt-0"
          >
            Shop more
          </Link>
        </div>

        {/* Responsive Product Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {displayedProducts.map((product) => {
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

        {/* Full catalog CTA button beneath the preview grid */}
        <div className="mt-7 text-center">
          <Link
            href={activeCategory === 'all' ? '/shop' : `/shop?category=${activeCategory}`}
            className="inline-flex items-center justify-center gap-1.5 h-[42px] px-6 rounded-[10px] bg-[#faf7f8] text-[#b73d67] border border-[#eedfe5] hover:bg-[#fceef2] hover:border-[#b73d67] text-[13px] font-bold transition-all shadow-2xs"
          >
            <span>Explore full collection in shop</span>
          </Link>
        </div>
      </section>

      {/* 6. Address Card Banner */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-3 sm:pb-5">
        <div className="bg-[#fceef2] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#eedfe5]">
          {/* Address Card Image */}
          <div className="w-full md:max-w-2xl bg-white rounded-xl shadow-xs overflow-hidden border border-[#eedfe5]/80">
            <Image
              src="/assets/address-card-demo.png"
              alt="Pretty Corner Address Card"
              width={700}
              height={260}
              className="w-full h-auto object-contain block"
              priority={false}
            />
          </div>

          {/* Right Side Content */}
          <div className="w-full md:w-auto md:max-w-md flex flex-col justify-center items-start gap-3">
            <div>
              <span className="inline-block text-[11px] uppercase tracking-wider font-bold text-[#b73d67] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#eedfe5] mb-1.5">
                Visit Us or Order Online
              </span>
              <h4 className="font-serif text-[20px] sm:text-[24px] font-medium leading-snug text-[#38262e]">
                Everyday beauty, crafted with care.
              </h4>
              <p className="text-[13px] text-[#7a6870] leading-relaxed mt-1">
                Drop by our studio or explore our curated collection delivered fresh to your doorstep in Yangon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Category Popup Modal ("+ Others") */}
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
                  Select a category to explore
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
                      setShowCategoryModal(false);
                      if (cat.id === 'all') {
                        router.push('/shop');
                      } else {
                        router.push(`/shop?category=${cat.id}`);
                      }
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

            <div className="pt-2 border-t border-[#eedfe5]">
              <Link
                href="/shop"
                onClick={() => setShowCategoryModal(false)}
                className="w-full h-[46px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-colors flex items-center justify-center cursor-pointer"
              >
                Browse Full Catalog in Shop
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
