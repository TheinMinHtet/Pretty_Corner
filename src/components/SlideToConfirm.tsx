'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SlideToConfirmProps {
  amount: number;
  currency?: string;
  title?: string;
  subtitle?: string;
  promptText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  customerName?: string;
  phone?: string;
  address?: string;
  landmarkNote?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
}

export default function SlideToConfirm({
  amount,
  currency = 'Ks',
  title = 'ORDER CONFIRMATION',
  subtitle = 'Total amount',
  promptText = 'Slide to confirm order',
  cancelText = 'Cancel Order',
  isSubmitting = false,
  customerName,
  phone,
  address,
  landmarkNote,
  onConfirm,
  onCancel,
}: SlideToConfirmProps) {
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [maxDrag, setMaxDrag] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const maxDragRef = useRef(0);

  const updateMaxDrag = useCallback(() => {
    if (trackRef.current && knobRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const knobWidth = knobRef.current.clientWidth;
      const calculated = Math.max(0, trackWidth - knobWidth - 8); // 4px padding each side
      maxDragRef.current = calculated;
      setMaxDrag(calculated);
    }
  }, []);

  useEffect(() => {
    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, [updateMaxDrag]);

  const handleDragStart = (clientX: number) => {
    if (confirmed || isSubmitting) return;
    updateMaxDrag();
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || confirmed || isSubmitting) return;
    const currentMax = maxDragRef.current;
    if (currentMax <= 0) return;

    const delta = clientX - startXRef.current;
    const clamped = Math.max(0, Math.min(delta, currentMax));
    const progress = clamped / currentMax;
    setDragProgress(progress);

    if (progress >= 0.85) {
      setIsDragging(false);
      setDragProgress(1);
      setConfirmed(true);
      void onConfirm();
    }
  }, [isDragging, confirmed, isSubmitting, onConfirm]);

  const handleDragEnd = useCallback(() => {
    if (confirmed) return;
    setIsDragging(false);
    if (dragProgress < 0.85) {
      setDragProgress(0);
    }
  }, [confirmed, dragProgress]);

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse event handlers
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const knobOffsetPx = maxDrag * dragProgress;

  return (
    <div className="fixed inset-0 z-50 bg-[#38262e]/35 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-5 transition-all duration-300 animate-in fade-in">
      <div className="w-full max-w-[400px] max-h-[92dvh] overflow-y-auto bg-white border border-[#eedfe5] rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-[0_24px_64px_-12px_rgba(56,38,46,0.18)] flex flex-col items-center text-center text-[#38262e] relative overflow-hidden">
        {/* Soft background ambient glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-36 bg-[#fceef2] rounded-full blur-2xl pointer-events-none opacity-80" />

        {/* Top-Right Dismiss Button */}
        <button
          type="button"
          disabled={isSubmitting || confirmed}
          onClick={() => void onCancel()}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fcf9fa] hover:bg-[#fceef2] text-[#7a6870] hover:text-[#b73d67] border border-[#eedfe5] flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-2xs"
          aria-label="Close confirmation"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fceef2] border border-[#f5d5e0] text-[#b73d67] text-[10.5px] font-bold tracking-[2px] uppercase mb-3 select-none shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b73d67] animate-pulse" />
          {title}
        </div>

        {/* Total Amount & Subtitle */}
        <div className="flex flex-col items-center my-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-[38px] font-black tracking-tight text-[#38262e] select-none leading-none">
              {amount.toLocaleString()}
            </span>
            <span className="text-base sm:text-lg font-bold text-[#b73d67] select-none">
              {currency}
            </span>
          </div>
          <span className="text-[12px] text-[#7a6870] font-medium mt-1 select-none">
            {subtitle}
          </span>
        </div>

        {/* Delivery Details Recap: Phone & Address */}
        {(phone || address || customerName) && (
          <div className="w-full my-3.5 p-3 bg-[#fcf9fa] border border-[#eedfe5] rounded-[16px] text-left text-[12px] flex flex-col gap-1.5 shadow-2xs">
            {customerName && (
              <div className="flex items-center gap-2 font-bold text-[#38262e]">
                <svg className="w-3.5 h-3.5 text-[#b73d67] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="truncate">{customerName}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 font-semibold text-[#b73d67] font-mono">
                <svg className="w-3.5 h-3.5 text-[#b73d67] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span>{phone}</span>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-2 text-[#7a6870] leading-snug">
                <svg className="w-3.5 h-3.5 text-[#b73d67] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="line-clamp-2">{address}</span>
              </div>
            )}
            {landmarkNote && (
              <div className="text-[11px] text-[#917d85] italic pl-5.5">
                ({landmarkNote})
              </div>
            )}
          </div>
        )}

        {/* Draggable Slider Container */}
        <div className="w-full mt-2 sm:mt-3">
          <div
            ref={trackRef}
            className="w-full h-14 bg-[#fcf9fa] border border-[#eedfe5] rounded-full relative p-1 flex items-center select-none overflow-hidden touch-none shadow-inner"
          >
            {/* Filled Background Progress */}
            <div
              className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-75 ${
                confirmed
                  ? 'bg-gradient-to-r from-[#d1fae5] to-[#a7f3d0]'
                  : 'bg-gradient-to-r from-[#fadce6] to-[#fceef2]'
              }`}
              style={{ width: `${Math.max(12, dragProgress * 100)}%` }}
            />

            {/* Hint Text Inside Track (Safe from knob overlap with pl-15) */}
            <div
              className="w-full pl-15 sm:pl-16 pr-3 text-center text-[11px] min-[360px]:text-[12px] sm:text-[13px] font-medium text-[#7a6870] pointer-events-none transition-opacity duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ opacity: Math.max(0, 1 - dragProgress * 1.5) }}
            >
              {isSubmitting ? (
                <span className="text-[#b73d67] font-semibold flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#b73d67] border-t-transparent rounded-full animate-spin" />
                  Processing order...
                </span>
              ) : (
                <>
                  <span className="whitespace-nowrap truncate">{promptText}</span>
                  <svg className="w-3.5 h-3.5 text-[#b73d67]/70 animate-pulse hidden sm:inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </div>

            {/* Draggable Circular Knob */}
            <div
              ref={knobRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              style={{
                transform: `translateX(${knobOffsetPx}px)`,
                transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
              className={`absolute left-1 top-1 bottom-1 w-12 h-12 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0 z-10 transition-colors shadow-[0_3px_10px_rgba(183,61,103,0.22)] ${
                confirmed
                  ? 'bg-emerald-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                  : isSubmitting
                  ? 'bg-[#b73d67] text-white opacity-90'
                  : 'bg-[#b73d67] text-white hover:bg-[#a33259] active:bg-[#8e294d]'
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : confirmed ? (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Action */}
        <button
          type="button"
          disabled={isSubmitting || confirmed}
          onClick={() => void onCancel()}
          className="mt-5 text-[13px] text-[#7a6870] hover:text-[#b73d67] font-semibold transition-colors cursor-pointer py-1.5 px-4 rounded-full hover:bg-[#fceef2] disabled:opacity-50"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
}
