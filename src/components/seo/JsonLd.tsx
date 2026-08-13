import React from 'react';
import { Product } from '@/types';

interface JsonLdProps {
  product?: Product;
}

export function JsonLd({ product }: JsonLdProps) {
  if (product) {
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images?.map(i => i.url) || [],
      description: product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: 'KL STUDIOS',
      },
      offers: {
        '@type': 'Offer',
        url: `https://klstudios.com/product/${product.slug}`,
        priceCurrency: 'GHS',
        price: product.sale_price || product.base_price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: (product.variants?.[0]?.stock_quantity || 0) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
      aggregateRating: product.rating_avg ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating_avg,
        reviewCount: 5,
      } : undefined,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    );
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'KL STUDIOS LUXURY COMMERCE',
    url: 'https://klstudios.com',
    logo: 'https://klstudios.com/logo.png',
    description: 'Bespoke acoustics, wearable tech, and Italian full-grain leather carry.',
    telephone: '+233 24 000 9999',
    priceRange: 'GH₵300 - GH₵5,000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Oxford Street, Osu',
      addressLocality: 'Accra',
      addressCountry: 'GH',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
