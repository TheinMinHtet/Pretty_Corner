'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import LazyImage from '@/components/LazyImage';
import { ProductGridSkeleton, ShopPageSkeleton } from '@/components/Skeletons';

const CategoryModal = dynamic(() => import('@/components/CategoryModal'), { ssr: false });
const ShopFilterModal = dynamic(() => import('@/components/ShopFilterModal'), { ssr: false });

const ProductCardStepper = dynamic(() => import('@/components/ProductCardStepper'), {
  ssr: false,
  loading: () => (
    <button className="h-[30px] sm:h-[32px] px-3 bg-[#b73d67] text-white rounded-[7px] text-[11px] sm:text-[12px] font-bold flex items-center gap-1 shadow-xs">
      + Add
    </button>
  ),
});

function ShopContent() {
  const searchParams = useSearchParams();
  const { products, productsLoading, promotions, t, language } = useStore();

  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('q') || '';
  const promoParam = searchParams.get('promo') || '';
  const dropParam = searchParams.get('drop') || '';
  const productParam = searchParams.get('product') || '';
  const productsParam = searchParams.get('products') || '';

  const [dismissedPromo, setDismissedPromo] = useState(false);

  // Sync dismissedPromo when URL filter parameters change
  const currentPromoKey = `${dropParam}|${promoParam}|${productParam}|${productsParam}`;
  const prevPromoKeyRef = useRef(currentPromoKey);
  if (prevPromoKeyRef.current !== currentPromoKey) {
    prevPromoKeyRef.current = currentPromoKey;
    setDismissedPromo(false);
  }

  const [prevCategoryParam, setPrevCategoryParam] = useState(categoryParam);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  if (categoryParam !== prevCategoryParam) {
    setPrevCategoryParam(categoryParam);
    setActiveCategory(categoryParam);
  }

  const [prevQueryParam, setPrevQueryParam] = useState(queryParam);
  const [searchFilter, setSearchFilter] = useState<string>(queryParam);
  if (queryParam !== prevQueryParam) {
    setPrevQueryParam(queryParam);
    setSearchFilter(queryParam);
  }

  const activePromoMatch = useMemo(() => {
    if (dismissedPromo) return null;
    if (!promotions || promotions.length === 0) return null;

    if (promoParam) {
      const clean = promoParam.trim().toUpperCase();
      const match = promotions.find(
        (p) => p.code && p.code.trim().toUpperCase() === clean
      );
      if (match) return match;
    }

    return null;
  }, [promotions, promoParam, dismissedPromo]);

  const isPromoFiltered = useMemo(() => {
    if (dismissedPromo) return false;
    if (productParam) return true;
    if (activePromoMatch) {
      return activePromoMatch.targetType === 'SINGLE_PRODUCT';
    }
    return false;
  }, [dismissedPromo, productParam, activePromoMatch]);

  const promoBadgeLabel = useMemo(() => {
    if (activePromoMatch) {
      return activePromoMatch.title;
    }
    if (productParam) {
      const match = products.find(
        (p) => p.slug === productParam || p.id === productParam || p.databaseId === productParam
      );
      return match ? match.name : productParam;
    }
    return '';
  }, [activePromoMatch, productParam, products]);

  const clearPromoFilter = () => {
    setDismissedPromo(true);
  };

  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown]);

  // Compute catalog maximum price dynamically so expensive items aren't excluded by default
  const catalogMaxPrice = useMemo(() => {
    if (!products || products.length === 0) return 100000;
    const highest = Math.max(...products.map((p) => p.price || 0));
    return Math.max(highest, 100000);
  }, [products]);

  // Filter Modal specific states
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [userAdjustedPrice, setUserAdjustedPrice] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categoriesList = useMemo(() => {
    const staticCats = [
      {
        id: 'all',
        label: t.catAll,
        description: language === 'my' ? 'အလှအပ၊ အီလက်ထရောနစ်နှင့် လူနေမှုအသုံးအဆောင် ပစ္စည်းအားလုံး' : 'Explore full catalog across beauty, tech & variety',
        count: products.length,
        aliases: ['all', 'everything', 'catalog', 'products', 'store', 'အားလုံး'],
      },
      {
        id: 'electrical',
        label: t.catElectrical,
        description: language === 'my' ? 'အလှအပသုံး ပစ္စည်းများ၊ LED မှန်နှင့် စမတ်အသုံးအဆောင်များ' : 'Sonic beauty tech, touch LED mirrors & smart humidifiers',
        count: products.filter((p) => p.category === 'electrical').length,
        aliases: ['electrical', 'electronics', 'gadget', 'gadgets', 'tech', 'device', 'devices', 'mirror', 'humidifier', 'sonic'],
      },
      {
        id: 'skincare',
        label: t.catSkincare,
        description: language === 'my' ? 'အသားအရေကြည်လင် အစိုဓာတ်ထိန်း ဆီရမ်၊ ခရင်မ်နှင့် နေလောင်ကာ' : 'Gentle barrier serums, moisturizers & UV daily defense',
        count: products.filter((p) => p.category === 'skincare').length,
        aliases: ['skincare', 'skin', 'serum', 'cream', 'moisturizer', 'barrier', 'sunscreen', 'uv', 'cleanser'],
      },
      {
        id: 'makeup',
        label: t.catMakeup,
        description: language === 'my' ? 'ပါးနီ၊ နှုတ်ခမ်းနီနှင့် နေ့စဉ်လိမ်း မိတ်ကပ်ပစ္စည်းများ' : 'Breathable cheek tints, lip glazes & complexion picks',
        count: products.filter((p) => p.category === 'makeup').length,
        aliases: ['makeup', 'cosmetics', 'tint', 'lip', 'blush', 'cheek', 'glaze', 'complexion'],
      },
      {
        id: 'lifestyle',
        label: t.catLifestyle,
        description: language === 'my' ? 'ပိုးသားဆံပင်စည်းကြိုး၊ ရေဗူးနှင့် နေ့စဉ်လူနေမှုအသုံးအဆောင်များ' : 'Silk hair accessories, vacuum tumblers & daily finds',
        count: products.filter((p) => p.category === 'lifestyle').length,
        aliases: ['lifestyle', 'variety', 'tumbler', 'hair', 'scrunchie', 'accessories', 'everyday'],
      },
      {
        id: 'lenses',
        label: t.catLenses,
        description: language === 'my' ? 'မျက်စိသက်တောင့်သက်သာရှိစေမည့် နေ့စဉ်နှင့် လစဉ်သုံး မျက်ကပ်မှန်များ' : 'Hydrated daily and monthly comfort beauty lenses',
        count: products.filter((p) => p.category === 'lenses').length,
        aliases: ['lenses', 'lens', 'contact lens', 'contact lenses', 'eyes', 'eye'],
      },
      {
        id: 'more',
        label: t.catMore,
        description: language === 'my' ? 'ပိုးသားအသုံးအဆောင်နှင့် အလှပြင်ကိရိယာများ' : 'Pure silk ties, beauty tools & thoughtful additions',
        count: products.filter((p) => p.category === 'more').length,
        aliases: ['more', 'accessories', 'tools', 'silk', 'additions'],
      },
    ];

    // Discover any additional categories dynamically created by admin
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
          aliases: [catSlug, displayName.toLowerCase()],
        });
      }
    });

    return [...staticCats, ...dynamicCats];
  }, [products, t, language]);

  const visibleCategories = useMemo(() => {
    const top5 = categoriesList.slice(0, 5);
    if (activeCategory !== 'all' && !top5.some((c) => c.id === activeCategory)) {
      const activeObj = categoriesList.find((c) => c.id === activeCategory);
      if (activeObj) {
        return [...top5.slice(0, 4), activeObj];
      }
    }
    return top5;
  }, [categoriesList, activeCategory]);

  const getCategoryTitle = () => {
    if (isPromoFiltered) {
      if (activePromoMatch?.title) return activePromoMatch.title;
      if (productParam) {
        const match = products.find(
          (p) => p.slug === productParam || p.id === productParam || p.databaseId === productParam
        );
        return match ? match.name : productParam;
      }
      if (productsParam) {
        return language === 'my' ? 'သီးသန့် ရွေးချယ်မှု' : 'Curated Selection';
      }
    }
    switch (activeCategory) {
      case 'electrical':
        return language === 'my' ? 'အီလက်ထရောနစ်နှင့် စမတ်ဂက်ဂျက်များ' : 'Electrical & Smart Gadgets';
      case 'skincare':
        return language === 'my' ? 'အသားအရေထိန်းသိမ်း ပစ္စည်းများ' : 'Skincare Essentials';
      case 'makeup':
        return language === 'my' ? 'နေ့စဉ်သုံး မိတ်ကပ်ပစ္စည်းများ' : 'Everyday Makeup';
      case 'lifestyle':
        return language === 'my' ? 'လူနေမှုအသုံးအဆောင် ပစ္စည်းများ' : 'Lifestyle & Variety';
      case 'lenses':
        return language === 'my' ? 'မျက်ကပ်မှန်နှင့် မျက်စိအားဖြည့်ပစ္စည်းများ' : 'Contact Lenses & Eye Care';
      case 'more':
        return language === 'my' ? 'အခြား အလှပြင်အသုံးအဆောင်များ' : 'Accessories & More';
      default:
        return t.catAll;
    }
  };

  const getCategorySubtitle = () => {
    if (isPromoFiltered) {
      if (activePromoMatch?.subtitle) return activePromoMatch.subtitle;
      return language === 'my'
        ? 'သီးသန့် ပရိုမိုးရှင်းပစ္စည်း အထူးကမ်းလှမ်းချက်'
        : 'Exclusive promotional featured items';
    }
    switch (activeCategory) {
      case 'electrical':
        return language === 'my' ? 'အလှအပသုံး စက်ပစ္စည်းများ၊ LED မှန်နှင့် စမတ်အသုံးအဆောင်များ' : 'Sonic beauty devices, touch LED mirrors, humidifiers & smart lifestyle tech.';
      case 'skincare':
        return language === 'my' ? 'အသားအရေစိုပြေစေမည့် ဆီရမ်၊ မွိုက်စချာရိုက်ဆာနှင့် နေလောင်ကာများ' : 'Gentle serums, barrier moisturizers, and UV daily defense formulas.';
      case 'makeup':
        return language === 'my' ? 'ပေါ့ပါးလန်းဆန်းသော ပါးနီ၊ နှုတ်ခမ်းနီနှင့် မိတ်ကပ်ပစ္စည်းများ' : 'Breathable cheek tints, cushion lip glazes, and daily complexion picks.';
      case 'lifestyle':
        return language === 'my' ? 'ပိုးသားဆံပင်စည်းကြိုး၊ ရေဗူးနှင့် နေ့စဉ်လူနေမှုအသုံးအဆောင်များ' : 'Silk hair ties, vacuum tumblers, and thoughtful everyday accessories.';
      case 'lenses':
        return language === 'my' ? 'မျက်စိစိုပြေစေသော နေ့စဉ်နှင့် လစဉ်သုံး မျက်ကပ်မှန်များ' : 'Moisture-rich daily and monthly contact lenses for natural beauty.';
      case 'more':
        return language === 'my' ? 'ပိုးသားအသုံးအဆောင်နှင့် အလှပြင်ကိရိယာများ' : 'Pure mulberry silk scrunchies, cosmetic tools & everyday add-ons.';
      default:
        return '';
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Single Product Promotion Filter
        if (isPromoFiltered) {
          if (activePromoMatch?.targetType === 'SINGLE_PRODUCT') {
            const target = activePromoMatch.targetSlug || productParam;
            const matches =
              target === p.id ||
              target === p.slug ||
              (p.databaseId && target === p.databaseId);
            if (!matches) return false;
          } else if (productParam) {
            const matches =
              productParam === p.id ||
              productParam === p.slug ||
              (p.databaseId && productParam === p.databaseId);
            if (!matches) return false;
          }
        }

        // 2. Category Filter
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }

        // 3. Search Filter
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase().trim();
          const categoryObj = categoriesList.find((c) => c.id === p.category);
          const matchesCategory =
            p.category.toLowerCase().includes(q) ||
            (categoryObj &&
              (categoryObj.label.toLowerCase().includes(q) ||
                categoryObj.aliases.some(
                  (alias) => alias.includes(q) || q.includes(alias)
                )));
          const matchesQuery =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            matchesCategory;
          if (!matchesQuery) return false;
        }

        // 4. In Stock and Max Price
        if (inStockOnly && !p.inStock) {
          return false;
        }
        if (userAdjustedPrice && p.price > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        return 0;
      });
  }, [
    products,
    isPromoFiltered,
    activePromoMatch,
    productParam,
    productsParam,
    activeCategory,
    searchFilter,
    inStockOnly,
    maxPrice,
    sortBy,
    categoriesList,
  ]);

  return (
    <div className="w-full bg-white flex flex-col min-h-full">
      {/* Catalog Header & Breadcrumb */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-3 sm:pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#7a6870] mb-2 sm:mb-3">
          <Link href="/" className="hover:text-[#38262e]">{t.navHome}</Link>
          <span>/</span>
          {isPromoFiltered ? (
            <>
              <button
                type="button"
                onClick={clearPromoFilter}
                className="hover:text-[#38262e] cursor-pointer"
              >
                {language === 'my' ? 'ကုန်ပစ္စည်းများ' : 'Catalog'}
              </button>
              <span>/</span>
              <span className="text-[#38262e] font-medium truncate max-w-[200px]">
                {promoBadgeLabel}
              </span>
            </>
          ) : (
            <span className="text-[#38262e] font-medium capitalize">
              {categoriesList.find((c) => c.id === activeCategory)?.label || activeCategory}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div>
            <h1 className={`font-serif font-medium text-[#38262e] leading-[1.45] ${
              language === 'my'
                ? 'text-[19px] min-[380px]:text-[22px] sm:text-[28px] lg:text-[33px]'
                : 'text-[26px] sm:text-[36px] lg:text-[42px]'
            }`}>
              {getCategoryTitle()}
            </h1>
            {getCategorySubtitle() ? (
              <p className="font-sans text-[12.5px] sm:text-[14px] text-[#7a6870] mt-1 sm:mt-1.5 max-w-xl leading-[1.82]">
                {getCategorySubtitle()}
              </p>
            ) : null}
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-[320px] lg:w-[380px] shrink-0 mt-2 md:mt-0">
            <div className="bg-[#f7f4f5] border border-[#eedfe5] focus-within:border-[#b73d67] focus-within:bg-white h-[44px] rounded-full flex items-center px-4 gap-2.5 transition-all shadow-2xs">
              <svg className="w-4 h-4 text-[#7a6870] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="bg-transparent text-[13px] text-[#38262e] placeholder-[#7a6870] outline-none w-full font-normal"
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
            <div className="hidden md:block text-right mt-1.5">
              <span className="text-[12px] text-[#7a6870]">
                {t.showing} <strong className="text-[#38262e]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? t.productCountSingular : t.productsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-2">
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
            className={`h-[36px] sm:h-[38px] px-3.5 sm:px-4 rounded-full text-[13px] font-bold whitespace-nowrap border transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              !categoriesList.slice(0, 5).some((c) => c.id === activeCategory) && activeCategory !== 'all'
                ? 'bg-[#38262e] text-white border-[#38262e]'
                : 'bg-[#faf7f8] text-[#b73d67] border-[#eedfe5] hover:bg-[#fceef2]'
            }`}
          >
            <span>
              <span className="hidden sm:inline">{t.moreCategories}</span>
              <span className="sm:hidden">{language === 'my' ? '+ အခြား' : '+ More'}</span>
            </span>
            {categoriesList.length > 5 && (
              <span className="text-[11px] opacity-75">
                ({categoriesList.length - 5})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Catalog Section */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-16">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eedfe5]">
          {/* Left: Product Counter & Active Filter Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[13px] text-[#7a6870]">
              {t.showing} <strong className="text-[#38262e]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? t.productCountSingular : t.productsCount}
            </span>

            {isPromoFiltered && (
              <span className="inline-flex items-center gap-1.5 bg-[#fceef2] text-[#b73d67] text-[12px] font-bold px-3 py-1 rounded-full border border-[#f5d9e3] shadow-2xs">
                <span>✨ {promoBadgeLabel} ({filteredProducts.length} {filteredProducts.length === 1 ? (t.productCountSingular || 'item') : (t.productsCount || 'items')})</span>
                <button
                  type="button"
                  onClick={clearPromoFilter}
                  className="hover:text-[#38262e] cursor-pointer ml-1 font-bold text-xs bg-white text-[#b73d67] hover:bg-[#fceef2] rounded-full w-4 h-4 flex items-center justify-center border border-[#f5d9e3]"
                  title="Clear promo filter"
                >
                  ✕
                </button>
              </span>
            )}

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
              className={`flex items-center gap-2 border rounded-full text-[13px] px-4 h-[38px] cursor-pointer font-medium transition-all shadow-[0_2px_8px_rgba(56,38,46,0.02)] ${
                userAdjustedPrice || inStockOnly || activeCategory !== 'all'
                  ? 'bg-[#fcf7f9] border-[#b73d67] text-[#b73d67] ring-1 ring-[#b73d67]/20 font-semibold'
                  : 'bg-[#fdfbfa] hover:bg-[#fcf7f9] border-[#eedfe5] text-[#38262e] hover:border-[#b73d67]'
              }`}
            >
              <span>{t.filters}</span>
              {(userAdjustedPrice || inStockOnly || activeCategory !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67]" />
              )}
            </button>

            {/* Custom Aesthetic Sort Dropdown Menu */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`flex items-center bg-[#fdfbfa] hover:bg-[#fcf7f9] border rounded-full text-[13px] text-[#38262e] px-4 h-[38px] cursor-pointer font-medium transition-all shadow-[0_2px_8px_rgba(56,38,46,0.02)] ${
                  showSortDropdown ? 'border-[#b73d67] ring-1 ring-[#b73d67]/20 bg-[#fcf7f9]' : 'border-[#eedfe5]'
                }`}
              >
                <span>
                  {sortBy === 'featured' && t.sortFeatured}
                  {sortBy === 'newest' && t.sortNewest}
                  {sortBy === 'price-asc' && t.sortPriceAsc}
                  {sortBy === 'price-desc' && t.sortPriceDesc}
                </span>
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[190px] bg-white/95 backdrop-blur-md rounded-2xl border border-[#eedfe5] shadow-[0_12px_32px_rgba(56,38,46,0.12)] py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {[
                    { value: 'featured', label: t.sortFeatured },
                    { value: 'newest', label: t.sortNewest },
                    { value: 'price-asc', label: t.sortPriceAsc },
                    { value: 'price-desc', label: t.sortPriceDesc },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortBy(option.value as 'featured' | 'newest' | 'price-asc' | 'price-desc');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center justify-between cursor-pointer ${
                        sortBy === option.value
                          ? 'bg-[#fdf2f5] text-[#b73d67] font-semibold'
                          : 'text-[#38262e] hover:bg-[#faf6f7]'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Product Grid */}
        {productsLoading && products.length === 0 ? (
          <div className="mt-4 sm:mt-6">
            <ProductGridSkeleton count={8} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
            {filteredProducts.map((product) => {
              return (
                <div key={product.id} className="flex flex-col group">
                  <div className="relative w-full h-[160px] sm:h-[230px] md:h-[260px] lg:h-[280px] bg-[#f9f5f7] rounded-[10px] sm:rounded-[12px] overflow-hidden">
                    <Link href={`/product/${product.id}`} className="block relative w-full h-full">
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
                      <Link href={`/product/${product.id}`}>
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
        ) : (
          <div className="py-16 text-center">
            <p className="font-serif text-[24px] text-[#38262e]">{t.noProductsMatch}</p>
            <p className="text-[14px] text-[#7a6870] mt-1.5">{t.noProductsAdjust}</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchFilter('');
                setMaxPrice(catalogMaxPrice);
                setUserAdjustedPrice(false);
                setInStockOnly(false);
                setDismissedPromo(true);
              }}
              className="mt-5 px-6 py-2.5 bg-[#b73d67] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#a33259] transition-colors"
            >
              {t.resetFilters}
            </button>
          </div>
        )}
      </section>

      {/* 4. Filter Modal */}
      {showFilterModal && (
        <ShopFilterModal
          title={t.filterAndSort}
          categoryHeading={language === 'my' ? 'အမျိုးအစား' : 'Category'}
          priceRangeLabel={t.priceRange}
          availabilityLabel={t.availability}
          onlyInStockLabel={t.onlyInStock}
          showMatchingLabel={t.showMatchingProducts}
          clearAllLabel={t.clearAll}
          categories={categoriesList}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          catalogMaxPrice={catalogMaxPrice}
          maxPrice={maxPrice}
          userAdjustedPrice={userAdjustedPrice}
          onChangeMaxPrice={(price) => {
            setMaxPrice(price);
            setUserAdjustedPrice(true);
          }}
          inStockOnly={inStockOnly}
          onToggleInStock={setInStockOnly}
          onClearAll={() => {
            setActiveCategory('all');
            setSearchFilter('');
            setMaxPrice(catalogMaxPrice);
            setUserAdjustedPrice(false);
            setInStockOnly(false);
            setSortBy('featured');
          }}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {/* Category Popup Modal ("+ Others") */}
      {showCategoryModal && (
        <CategoryModal
          categories={categoriesList}
          activeCategory={activeCategory}
          title={t.allCategories}
          subtitle={t.selectCategoryToView}
          activeLabel={t.active}
          itemsUnitLabel={language === 'my' ? 'ခု' : 'items'}
          onSelect={(catId) => {
            setActiveCategory(catId);
            setShowCategoryModal(false);
          }}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
