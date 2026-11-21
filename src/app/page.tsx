'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import HeroBannerSlider from '@/components/HeroBannerSlider';

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
  const { products, cartCount, setSearchQuery, addToCart, isMounted, t, language } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  const categoriesList = useMemo(() => [
    {
      id: 'all',
      label: t.catAll,
      description: language === 'my' ? 'ဆိုင်ရှိ ပစ္စည်းအားလုံးကို စုံလင်စွာ ကြည့်ရှုနိုင်ပါသည်' : 'Explore our complete variety of products',
      count: products.length,
    },
    {
      id: 'electrical',
      label: t.catElectrical,
      description: language === 'my' ? 'အလှအပသုံး စမတ်ကိရိယာများနှင့် ဂက်ဂျက်များ' : 'Sonic beauty tech, touch LED mirrors & smart humidifiers',
      count: products.filter((p) => p.category === 'electrical').length,
    },
    {
      id: 'skincare',
      label: t.catSkincare,
      description: language === 'my' ? 'နူးညံ့ထိရောက်သော အသားအရေထိန်း ပစ္စည်းများ' : 'Gentle barrier serums, moisturizers & UV daily defense',
      count: products.filter((p) => p.category === 'skincare').length,
    },
    {
      id: 'makeup',
      label: t.catMakeup,
      description: language === 'my' ? 'ပေါ့ပါးလန်းဆန်းသော မိတ်ကပ်နှင့် နှုတ်ခမ်းနီများ' : 'Breathable cheek tints, lip glazes & complexion picks',
      count: products.filter((p) => p.category === 'makeup').length,
    },
    {
      id: 'lifestyle',
      label: t.catLifestyle,
      description: language === 'my' ? 'ခေတ်မီ လူနေမှုဘဝနှင့် နေ့စဉ်သုံးပစ္စည်းများ' : 'Silk hair accessories, vacuum tumblers & daily finds',
      count: products.filter((p) => p.category === 'lifestyle').length,
    },
    {
      id: 'lenses',
      label: t.catLenses,
      description: language === 'my' ? 'မျက်လုံးအေးမြ သက်တောင့်သက်သာရှိသော မျက်ကပ်မှန်များ' : 'Hydrated daily and monthly comfort beauty lenses',
      count: products.filter((p) => p.category === 'lenses').length,
    },
    {
      id: 'more',
      label: t.catMore,
      description: language === 'my' ? 'အခြား အလှအပနှင့် အသုံးအဆောင်ပစ္စည်းများ' : 'Pure silk ties, beauty tools & thoughtful additions',
      count: products.filter((p) => p.category === 'more').length,
    },
  ], [products, t, language]);

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
      {/* Hero Editorial / Dynamic Promotion Slideshow */}
      <HeroBannerSlider />

      {/* 4. Categories - Responsive Container */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-[22px] sm:text-[28px] font-medium text-[#38262e]">
            {t.exploreByCategory}
          </h3>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="text-[13px] font-bold text-[#b73d67] hover:underline cursor-pointer shrink-0"
          >
            {t.viewAll}
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
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-6 sm:pb-8">
        <div className="flex items-start sm:items-baseline justify-between gap-3 mb-5">
          <div className="min-w-0">
            <h3 className="font-serif text-[22px] sm:text-[32px] font-medium text-[#38262e] leading-tight">
              {t.topPicksTitle}
            </h3>
          </div>
          <Link
            href={activeCategory === 'all' ? '/shop' : `/shop?category=${activeCategory}`}
            className="text-[13px] font-bold text-[#b73d67] hover:underline shrink-0 whitespace-nowrap pt-1 sm:pt-0"
          >
            {t.shopMore}
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
                    {product.category}
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
            <span>{t.exploreFullCollection}</span>
          </Link>
        </div>
      </section>

      {/* 6. Address Card Banner */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-6 sm:pb-8">
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
                {t.storeLocationBadge}
              </span>
              <h4 className="font-serif text-[20px] sm:text-[24px] font-medium leading-snug text-[#38262e]">
                {t.storeLocationHeading}
              </h4>
              <p className="text-[13px] text-[#7a6870] leading-relaxed mt-1">
                {t.storeLocationDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Category Popup Modal ("+ Others") */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#38262e]/45 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCategoryModal(false)}
          />

          {/* Dialog - Centered on screen */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-5 sm:p-6 max-h-[80vh] overflow-y-auto shadow-2xl z-10 border border-[#eedfe5] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#eedfe5]">
              <div>
                <h3 className="font-serif text-[22px] font-medium text-[#38262e]">
                  {t.allCategories}
                </h3>
                <p className="text-[12px] text-[#7a6870] mt-0.5">
                  {t.selectCategoryToView}
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
          </div>
        </div>
      )}
    </div>
  );
}
