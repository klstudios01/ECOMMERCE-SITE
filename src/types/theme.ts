// DEVELOPER PORTAL THEME & SITE CONFIGURATION SCHEMA

export interface ThemeConfig {
  // BRAND & VISUAL SYSTEM
  storeName: string;
  storeTagline: string;
  logoType: 'text' | 'image';
  logoText: string;
  logoImageUrl: string;
  primaryColor: string; // Hex color (e.g. #F59E0B)
  accentColor: string; // Hex color
  fontFamily: 'Inter' | 'Outfit' | 'Roboto' | 'Cinzel';

  // CONTACT & LOCATION
  supportEmail: string;
  supportPhone: string;
  storeAddress: string;
  currencySymbol: string;
  currencyCode: string;

  // CMS & ANNOUNCEMENT TEXTS
  topAnnouncementText: string;
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  heroSubtitle: string;
  footerCopyrightText: string;

  // FEATURE TOGGLES
  enableWishlist: boolean;
  enableQuickView: boolean;
  enableReviews: boolean;
  enablePromoCoupons: boolean;
  enableFreeShippingBanner: boolean;

  // PAYSTACK & API SETTINGS
  paystackMode: 'demo' | 'live';
  paystackPublicKey: string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  storeName: 'KL STUDIOS LUXURY COMMERCE',
  storeTagline: 'Luxury Acoustics, Wearable Tech & Full-Grain Leather Carry',
  logoType: 'text',
  logoText: 'KL STUDIOS',
  logoImageUrl: '/logo.png',
  primaryColor: '#F59E0B',
  accentColor: '#D97706',
  fontFamily: 'Inter',

  supportEmail: 'concierge@klstudios.com',
  supportPhone: '+233 24 000 9999',
  storeAddress: 'Oxford Street, Osu, Accra, Ghana',
  currencySymbol: 'GH₵',
  currencyCode: 'GHS',

  topAnnouncementText: 'COMPLIMENTARY SHIPPING ON ALL ORDERS OVER GH₵2,000 IN ACCRA',
  heroHeadingLine1: 'Uncompromising',
  heroHeadingLine2: 'Craftsmanship',
  heroSubtitle: 'Experience acoustic engineering, titanium timepieces, and Italian leather carry.',
  footerCopyrightText: '© 2026 KL STUDIOS. All Rights Reserved. Production-Grade Commercial Platform.',

  enableWishlist: true,
  enableQuickView: true,
  enableReviews: true,
  enablePromoCoupons: true,
  enableFreeShippingBanner: true,

  paystackMode: 'demo',
  paystackPublicKey: 'pk_test_demo_paystack_public_key',
};
