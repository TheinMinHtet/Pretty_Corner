import React, { Suspense } from 'react';
import { fetchStorefrontProduct } from '@/lib/api';
import ProductDetailView from '@/components/ProductDetailView';
import { notFound } from 'next/navigation';

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchStorefrontProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-[#7a6870]">
          Loading product details...
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
