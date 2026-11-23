import React from 'react';

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-[8px] ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      <SkeletonBlock className="w-full h-[160px] sm:h-[230px] md:h-[260px] lg:h-[280px] rounded-[10px] sm:rounded-[12px]" />
      <div className="pt-1.5 sm:pt-3 flex flex-col flex-1 justify-between">
        <div>
          <SkeletonBlock className="h-2.5 sm:h-3 w-14 rounded-full" />
          <SkeletonBlock className="h-3.5 sm:h-4 w-4/5 mt-1.5 rounded-md" />
          <SkeletonBlock className="h-3.5 sm:h-4 w-2/3 mt-1 rounded-md" />
        </div>
        <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3 pt-1">
          <SkeletonBlock className="h-4 sm:h-5 w-20 rounded-md" />
          <SkeletonBlock className="h-[28px] sm:h-[34px] w-[54px] sm:w-[70px] rounded-[7px] sm:rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6"
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="w-full bg-white flex flex-col min-h-full" role="status" aria-label="Loading storefront">
      {/* Hero Skeleton */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6">
        <SkeletonBlock className="w-full h-[330px] sm:h-[410px] md:h-[480px] lg:h-[520px] rounded-[20px] sm:rounded-[32px]" />
      </section>

      {/* Categories Strip Skeleton */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-3">
        <div className="flex items-center justify-between gap-3">
          <SkeletonBlock className="h-7 sm:h-8 w-44 sm:w-56" />
          <SkeletonBlock className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 mt-3 overflow-hidden pb-1">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonBlock
              key={idx}
              className="h-[34px] sm:h-[40px] w-24 sm:w-28 rounded-[20px] shrink-0"
            />
          ))}
        </div>
      </section>

      {/* Top Picks Grid Skeleton */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-10">
        <div className="flex items-center justify-between gap-2.5 mb-4 sm:mb-5">
          <SkeletonBlock className="h-7 sm:h-9 w-48 sm:w-64" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
        <ProductGridSkeleton count={8} />
      </section>
    </div>
  );
}

export function ShopPageSkeleton() {
  return (
    <div className="w-full bg-white flex flex-col min-h-full" role="status" aria-label="Loading catalog">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-3 sm:pb-4">
        <SkeletonBlock className="h-3.5 w-28 mb-3" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-2">
            <SkeletonBlock className="h-9 sm:h-11 w-56 sm:w-72" />
            <SkeletonBlock className="h-4 w-72 sm:w-96 max-w-full" />
          </div>
          <SkeletonBlock className="h-[44px] w-full md:w-[320px] lg:w-[380px] rounded-full shrink-0" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-2">
        <div className="flex items-center gap-2 overflow-hidden pb-1">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonBlock
              key={idx}
              className="h-[36px] sm:h-[38px] w-24 sm:w-28 rounded-full shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Controls & Grid */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-16">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#eedfe5]">
          <SkeletonBlock className="h-4 w-28" />
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-[38px] w-24 rounded-full" />
            <SkeletonBlock className="h-[38px] w-28 rounded-full" />
          </div>
        </div>
        <div className="mt-4 sm:mt-6">
          <ProductGridSkeleton count={8} />
        </div>
      </section>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12" role="status" aria-label="Loading product details">
      {/* Breadcrumb & Back */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-3 flex items-center justify-between gap-3">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-8 w-20 rounded-full" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:pt-4">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-16 items-start">
          {/* Gallery */}
          <div className="md:col-span-6 lg:col-span-7">
            <SkeletonBlock className="w-full h-[360px] sm:h-[440px] md:h-[480px] lg:h-[540px] rounded-2xl" />
            <div className="flex gap-2.5 sm:gap-3 mt-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonBlock key={idx} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shrink-0" />
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="md:col-span-6 lg:col-span-5 px-5 sm:px-0 pt-6 md:pt-0 flex flex-col">
            <SkeletonBlock className="h-3.5 w-24 rounded-full mb-2" />
            <SkeletonBlock className="h-9 sm:h-11 w-4/5 mb-2" />
            <SkeletonBlock className="h-9 sm:h-11 w-2/3" />

            <div className="flex items-center gap-3 mt-4">
              <SkeletonBlock className="h-7 w-32" />
              <SkeletonBlock className="h-5 w-16 rounded" />
            </div>

            <div className="space-y-2 mt-4">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-11/12" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>

            <div className="mt-6 pt-6 border-t border-[#eedfe5] flex items-center gap-3">
              <SkeletonBlock className="h-[46px] sm:h-[52px] w-[84px] sm:w-[110px] rounded-[10px] shrink-0" />
              <SkeletonBlock className="h-[46px] sm:h-[52px] flex-1 rounded-[10px]" />
            </div>

            <div className="mt-8 border-t border-[#eedfe5] divide-y divide-[#eedfe5]">
              <div className="py-4 space-y-2">
                <SkeletonBlock className="h-5 w-36" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
              </div>
              <div className="py-4">
                <SkeletonBlock className="h-5 w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BagPageSkeleton() {
  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12" role="status" aria-label="Loading shopping bag">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-8 w-20 rounded-full" />
        </div>
        <SkeletonBlock className="h-9 sm:h-11 w-48 mb-2" />
        <SkeletonBlock className="h-4 w-64" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
          <div className="md:col-span-7 lg:col-span-8 divide-y divide-[#eedfe5]">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="py-4 sm:py-5 flex gap-3 sm:gap-6 items-center">
                <SkeletonBlock className="w-[88px] sm:w-[120px] h-[108px] sm:h-[140px] rounded-[10px] shrink-0" />
                <div className="flex-1 flex flex-col justify-between h-[116px] sm:h-[132px] py-1">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-2/3" />
                    <SkeletonBlock className="h-3.5 w-1/3" />
                    <SkeletonBlock className="h-4 w-24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <SkeletonBlock className="h-8 w-24 rounded-[8px]" />
                    <SkeletonBlock className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-5 lg:col-span-4 mt-6 md:mt-0">
            <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-5 sm:p-6 space-y-4">
              <SkeletonBlock className="h-6 w-36" />
              <SkeletonBlock className="h-11 w-full rounded-[10px]" />
              <div className="space-y-2.5 pt-2 border-t border-[#eedfe5]">
                <div className="flex justify-between">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <SkeletonBlock className="h-5 w-16" />
                  <SkeletonBlock className="h-5 w-28" />
                </div>
              </div>
              <SkeletonBlock className="h-[48px] w-full rounded-[10px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className="w-full bg-white flex flex-col min-h-full pb-12" role="status" aria-label="Loading checkout">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4">
        <SkeletonBlock className="h-4 w-44 mb-3" />
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-center">
          <div className="md:col-span-7 lg:col-span-8 space-y-2">
            <SkeletonBlock className="h-9 sm:h-11 w-52" />
            <SkeletonBlock className="h-4 w-72 max-w-full" />
          </div>
          <div className="md:col-span-5 lg:col-span-4 mt-3 md:mt-0">
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-5 sm:p-6 space-y-4">
              <SkeletonBlock className="h-6 w-44" />
              <SkeletonBlock className="h-12 w-full rounded-[10px]" />
              <SkeletonBlock className="h-12 w-full rounded-[10px]" />
              <SkeletonBlock className="h-[220px] w-full rounded-xl" />
              <SkeletonBlock className="h-12 w-full rounded-[10px]" />
            </div>
            <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-5 sm:p-6 space-y-3">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-16 w-full rounded-xl" />
              <SkeletonBlock className="h-16 w-full rounded-xl" />
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4 mt-6 md:mt-0">
            <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-5 sm:p-6 space-y-4">
              <SkeletonBlock className="h-6 w-36" />
              <SkeletonBlock className="h-16 w-full rounded-lg" />
              <SkeletonBlock className="h-16 w-full rounded-lg" />
              <div className="pt-3 border-t border-[#eedfe5] space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-6 w-full" />
              </div>
              <SkeletonBlock className="h-[50px] w-full rounded-[10px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutMapSkeleton() {
  return (
    <div
      className="w-full h-[220px] bg-[#fcf9fa] border border-[#eedfe5] rounded-xl flex flex-col items-center justify-center gap-2 mt-2"
      role="status"
      aria-label="Loading map"
    >
      <div className="w-10 h-10 rounded-full bg-[#fceef2] flex items-center justify-center text-[#b73d67] animate-pulse">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <SkeletonBlock className="h-3 w-36 rounded-full" />
    </div>
  );
}

export function OrderCardSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className={`w-full ${wide ? 'max-w-2xl' : 'max-w-xl'} mx-auto px-3 sm:px-6 py-5 md:py-10 flex flex-col min-h-full pb-12`}
      role="status"
      aria-label="Loading order details"
    >
      <div className="bg-[#faf7f8] border border-[#eedfe5] rounded-2xl p-5 sm:p-8 flex flex-col gap-5">
        <SkeletonBlock className="h-4 w-32" />
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-4 w-1/2" />
        </div>
        <div className="bg-white border border-[#eedfe5] rounded-xl p-4 space-y-3">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
        </div>
        <div className="bg-white border border-[#eedfe5] rounded-xl p-4 space-y-2.5">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-5 w-2/3" />
        </div>
        <SkeletonBlock className="h-[48px] w-full rounded-[10px]" />
      </div>
    </div>
  );
}

export function PageShellSkeleton() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col" role="status" aria-label="Loading Pretty Corner">
      <div className="w-full border-b border-[#eedfe5] bg-white h-[56px] sm:h-[64px] md:h-[74px] flex items-center">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <SkeletonBlock className="h-7 w-36" />
          <div className="hidden md:flex items-center gap-6">
            <SkeletonBlock className="h-4 w-14" />
            <SkeletonBlock className="h-4 w-14" />
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-8 w-14 rounded-full" />
            <SkeletonBlock className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <HomePageSkeleton />
    </div>
  );
}
