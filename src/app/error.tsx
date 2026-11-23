'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App-level uncaught error:', error);
  }, [error]);

  return (
    <main className="w-full min-h-[75vh] flex items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-[32px] p-8 text-center shadow-sm space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#fceef2] text-[#b73d67] flex items-center justify-center text-2xl font-bold">
          !
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#38262e] font-serif">
            Something went wrong
          </h1>
          <p className="text-sm text-[#7a6870]">
            မမျှော်လင့်ထားသော အမှားတစ်ခု ဖြစ်ပေါ်သွားပါသည်။ ပြန်လည်ကြိုးစားကြည့်ပါ သို့မဟုတ် ပင်မစာမျက်နှာသို့ ပြန်သွားပါ။
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
            className="px-5 py-2.5 bg-[#b73d67] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#a03257] transition shadow-xs cursor-pointer"
          >
            Try Again / ပြန်စမ်းမည်
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white border border-[#eedfe5] text-[#38262e] rounded-full text-xs font-semibold hover:bg-[#fceef2] transition text-center"
          >
            Go Home / ပင်မစာမျက်နှာ
          </Link>
        </div>
      </div>
    </main>
  );
}
