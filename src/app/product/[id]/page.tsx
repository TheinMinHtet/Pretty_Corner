import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchStorefrontProduct, fetchStorefrontProducts } from '@/lib/api';
import ProductDetailView from '@/components/ProductDetailView';
import { ProductDetailSkeleton } from '@/components/Skeletons';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const products = await fetchStorefrontProducts();
    if (!products || products.length === 0) return [];
    return products.map((p) => ({
      id: p.slug || p.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchStorefrontProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found | Pretty Corner',
      description: 'The requested product could not be found at Pretty Corner.',
    };
  }

  const desc = product.description || product.tagline || 'Authentic beauty & lifestyle find at Pretty Corner';

  return {
    title: `${product.name} | Pretty Corner`,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: desc,
      images: product.image ? [product.image] : [],
    },
  };
}

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
