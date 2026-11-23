import React, { Suspense } from 'react';
import { fetchStorefrontProduct } from '@/lib/api';
import ProductDetailView from '@/components/ProductDetailView';
import { ProductDetailSkeleton } from '@/components/Skeletons';
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
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
