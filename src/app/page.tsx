'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import HeroBannerSlider from '@/components/HeroBannerSlider';
import LazyImage from '@/components/LazyImage';
import { ProductGridSkeleton } from '@/components/Skeletons';

const CategoryModal = dynamic(() => import('@/components/CategoryModal'), { ssr: false });

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
  const { products, productsLoading, t, language } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  const categoriesList = useMemo(() => {
    const staticCats = [
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
    ];

    const knownSlugs = new Set(staticCats.map((c) => c.id));
    const dynamicCats: typeof staticCats = [];

    products.forEach((p) => {
      const catSlug = (p.category || '').trim().toLowerCase();
      if (catSlug && !knownSlugs.has(catSlug)) {
        knownSlugs.add(catSlug);
        const displayName = p.subcategory || (catSlug.charAt(0).toUpperCase() + catSlug.slice(1));
        dynamicCats.push({
          id: catSlug,
          label: displayName,
          description: displayName,
          count: products.filter((item) => (item.category || '').toLowerCase() === catSlug).length,
        });
      }
    });

    return [...staticCats, ...dynamicCats];
  }, [products, t, language]);

  // Matching products for the selected category
  const matchingProducts = useMemo(() => {
    return activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // Show top curated highlights as preview (up to 8 products)
  const displayedProducts = useMemo(() => {
    return matchingProducts.slice(0, 8);
  }, [matchingProducts]);

  return (
    <div className="w-full bg-white flex flex-col min-h-full">
      {/* Hero Editorial / Dynamic Promotion Slideshow */}
      <HeroBannerSlider />

      {/* 4. Categories - Responsive Container */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-[20px] sm:text-[28px] font-medium text-[#38262e]">
            {t.exploreByCategory}
          </h3>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="text-[12.5px] sm:text-[13px] font-bold text-[#b73d67] hover:underline cursor-pointer shrink-0"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 mt-2.5 sm:mt-3.5 overflow-x-auto no-scrollbar pb-1">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`h-[34px] sm:h-[40px] px-4 sm:px-5 rounded-[20px] text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
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
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-6 sm:pb-8">
        <div className="flex items-center justify-between gap-2.5 mb-3.5 sm:mb-5">
          <div className="min-w-0">
            <h3 className="font-serif text-[19px] sm:text-[32px] font-medium text-[#38262e] leading-tight">
              {t.topPicksTitle}
            </h3>
          </div>
          <Link
            href={activeCategory === 'all' ? '/shop' : `/shop?category=${activeCategory}`}
            className="text-[12px] sm:text-[13px] font-bold text-[#b73d67] hover:underline shrink-0 whitespace-nowrap"
          >
            {t.shopMore}
          </Link>
        </div>

        {/* Responsive Product Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
        {productsLoading && products.length === 0 ? (
          <ProductGridSkeleton count={8} />
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {displayedProducts.map((product) => {
            return (
              <div key={product.id} className="flex flex-col group">
                <div className="relative w-full h-[160px] sm:h-[230px] md:h-[260px] lg:h-[280px] bg-[#f9f5f7] rounded-[10px] sm:rounded-[12px] overflow-hidden">
                  <Link href={`/product/${product.slug || product.id}`} className="block relative w-full h-full">
                    <LazyImage
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-white text-[#b73d67] text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-[4px] sm:rounded-[5px] shadow-sm select-none">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="pt-1.5 sm:pt-3 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[9.5px] sm:text-[11px] font-medium tracking-wide text-[#7a6870] uppercase">
                      {product.category}
                    </p>
                    <Link href={`/product/${product.slug || product.id}`}>
                      <h4 className="text-[13px] sm:text-[16px] font-normal text-[#38262e] hover:text-[#b73d67] transition-colors line-clamp-2 mt-0.5 leading-snug">
                        {product.name}
                      </h4>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-1.5 sm:mt-2 pt-1">
                    <p className="text-[12px] sm:text-[15px] font-bold text-[#b73d67] whitespace-nowrap leading-none">
                      {product.price.toLocaleString()} <span className="text-[9.5px] sm:text-[11px] font-medium">MMK</span>
                    </p>
                    <ProductCardStepper productId={product.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Full catalog CTA button beneath the preview grid */}
        <div className="mt-8 mb-4 sm:mt-10 sm:mb-6 text-center">
          <Link
            href={activeCategory === 'all' ? '/shop' : `/shop?category=${activeCategory}`}
            className="inline-flex items-center justify-center gap-1.5 h-[42px] px-6 rounded-[10px] bg-[#faf7f8] text-[#b73d67] border border-[#eedfe5] hover:bg-[#fceef2] hover:border-[#b73d67] text-[13px] font-bold transition-all shadow-2xs"
          >
            <span>{t.exploreFullCollection}</span>
          </Link>
        </div>
      </section>

      {/* 6. Address Card Banner */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="bg-[#fceef2] rounded-[28px] sm:rounded-2xl p-4 min-[380px]:p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 border border-[#eedfe5]">
          {/* Address Card Image */}
          <div className="w-full md:max-w-2xl bg-white rounded-[20px] sm:rounded-xl shadow-xs overflow-hidden border border-[#eedfe5]/80">
            <LazyImage
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
              <h4 className="font-serif text-[18px] min-[380px]:text-[20px] sm:text-[24px] font-medium leading-[1.48] text-[#38262e]">
                {t.storeLocationHeading}
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Category Popup Modal ("+ Others") */}
      {showCategoryModal && (
        <CategoryModal
          categories={categoriesList}
          activeCategory={activeCategory}
          title={t.allCategories}
          subtitle={t.selectCategoryToView}
          activeLabel="Active"
          itemsUnitLabel="items"
          onSelect={(catId) => {
            setShowCategoryModal(false);
            if (catId === 'all') {
              router.push('/shop');
            } else {
              router.push(`/shop?category=${catId}`);
            }
          }}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
}
