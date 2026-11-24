import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import MobileShell from '@/components/MobileShell';
import { PageShellSkeleton } from '@/components/Skeletons';
import { WebVitals } from '@/app/web-vitals';
import { Suspense } from 'react';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dmsans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://prettycornershopmm.com'),
  title: 'Pretty Corner | Beauty, Electrical Gadgets & Everyday Variety',
  description: 'A curated corner for all your favorites. Authentic cosmetics, smart electrical devices, and everyday lifestyle finds delivered across Myanmar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans min-h-screen bg-white text-[#38262e] selection:bg-[#fceef2] selection:text-[#b73d67]"
        suppressHydrationWarning
      >
        <StoreProvider>
          <WebVitals />
          <Suspense fallback={<PageShellSkeleton />}>
            <MobileShell>{children}</MobileShell>
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
