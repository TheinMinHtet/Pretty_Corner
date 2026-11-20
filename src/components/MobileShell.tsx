'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import dynamic from 'next/dynamic';

const FloatingCartBar = dynamic(() => import('./FloatingCartBar'), { ssr: false });

export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-white text-[#38262e] relative flex flex-col">
      {/* Universal Consistent Header (mobile, tablet, desktop) */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Sticky Floating Cart Bar */}
      <FloatingCartBar />

      {/* Universal Consistent Footer */}
      <Footer />
    </div>
  );
}

