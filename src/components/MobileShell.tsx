'use client';

import React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show navigation bar only on main browsing pages (hide on product details, checkout, payment, confirmation)
  const isExcludedRoute =
    pathname.startsWith('/product') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/order-confirmation') ||
    pathname.startsWith('/payment-pending') ||
    pathname.startsWith('/payment-recovery');

  const showNav = !isExcludedRoute;

  return (
    <div className="w-full min-h-screen bg-white text-[#38262e] relative flex flex-col">
      {/* Desktop Persistent Header (md and above) */}
      <Header />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col w-full ${showNav ? 'pb-[72px] md:pb-0' : ''}`}>
        {children}
      </main>

      {/* Desktop Persistent Footer (md and above) */}
      <Footer />

      {/* Mobile Bottom Navigation (screens below md) */}
      {showNav && <Navigation />}
    </div>
  );
}
