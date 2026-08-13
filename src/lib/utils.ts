import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currencyCode: string = 'GHS',
  currencySymbol: string = 'GH₵'
): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  
  try {
    const formatted = new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currencyCode === 'GHS' ? 'GHS' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);

    return formatted.replace('GHS', currencySymbol).replace('USD', '$');
  } catch (e) {
    return `${currencySymbol}${safeAmount.toFixed(2)}`;
  }
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return '—';
  }
}

export function slugify(text: string): string {
  if (!text) return `item-${Date.now()}`;
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export function calculateDiscountPercentage(basePrice: number, salePrice: number): number {
  if (!basePrice || !salePrice || salePrice >= basePrice) return 0;
  return Math.round(((basePrice - salePrice) / basePrice) * 100);
}
