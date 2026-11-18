import React from 'react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import ProductDetailView from '@/components/ProductDetailView';
import { notFound } from 'next/navigation';

export const instant = false;

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
