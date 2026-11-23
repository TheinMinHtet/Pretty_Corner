'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global root layout error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-white text-[#38262e] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-[32px] p-8 text-center shadow-sm space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#fceef2] text-[#b73d67] flex items-center justify-center text-2xl font-bold">
            !
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#38262e]">
              System Encountered an Error
            </h1>
            <p className="text-sm text-[#7a6870]">
              အက်ပလီကေးရှင်းတွင် အမှားတစ်ခု ဖြစ်ပေါ်သွားပါသည်။
            </p>
            {error.digest && (
              <p className="text-[11px] text-[#a09097] font-mono">
                Error Ref: {error.digest}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 bg-[#b73d67] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#a03257] transition cursor-pointer"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="px-5 py-2.5 bg-white border border-[#eedfe5] text-[#38262e] rounded-full text-xs font-semibold hover:bg-[#fceef2] transition text-center"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
