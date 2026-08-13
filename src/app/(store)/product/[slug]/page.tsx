import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { dbService } from '@/lib/db/client';
import { ProductDetailClient } from '@/components/store/ProductDetailClient';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.seo_title || `${product.name} | KL STUDIOS`,
    description: product.seo_description || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images?.[0]?.url || '' }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);
  if (!product) notFound();

  const [allProducts, reviews] = await Promise.all([
    dbService.getProducts({ status: 'published' }),
    dbService.getReviews(product.id),
  ]);

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      <ProductDetailClient product={product} initialReviews={reviews} relatedProducts={relatedProducts} />
    </div>
  );
}
