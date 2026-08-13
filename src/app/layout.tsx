import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { ThemeConfigProvider } from '@/context/ThemeConfigContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';
import { QuickViewModal } from '@/components/store/QuickViewModal';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: {
    default: 'KL STUDIOS | Luxury Acoustics, Wearable Tech & Leather Carry',
    template: '%s | KL STUDIOS Luxury Commerce',
  },
  description: 'Handcrafted luxury acoustics, wireless noise-canceling headphones, titanium smartwatches, and Italian full-grain leather carry. Fast door delivery across Ghana.',
  keywords: ['luxury acoustics', 'wireless headphones', 'smartwatch', 'leather weekender bag', 'Ghana e-commerce', 'Accra luxury store'],
  openGraph: {
    title: 'KL STUDIOS | Commercial Luxury E-Commerce Platform',
    description: 'Precision engineering, titanium timepieces, and Italian leather carry.',
    url: 'https://klstudios.com',
    siteName: 'KL STUDIOS',
    locale: 'en_GH',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <AuthProvider>
          <ThemeConfigProvider>
            <StoreProvider>
              <JsonLd />
              <Header />
              <CartDrawer />
              <QuickViewModal />
              <main className="flex-1">{children}</main>
              <Footer />
            </StoreProvider>
          </ThemeConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
