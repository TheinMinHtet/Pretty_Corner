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
  onConfirm,
  onCancel,
}: SlideToConfirmProps) {
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const maxDragRef = useRef(0);

  const updateMaxDrag = useCallback(() => {
    if (trackRef.current && knobRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const knobWidth = knobRef.current.clientWidth;
      maxDragRef.current = Math.max(0, trackWidth - knobWidth - 8); // 4px padding each side
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
    const maxDrag = maxDragRef.current;
    if (maxDrag <= 0) return;

    const delta = clientX - startXRef.current;
    const clamped = Math.max(0, Math.min(delta, maxDrag));
    const progress = clamped / maxDrag;
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

  const knobOffsetPx = maxDragRef.current * dragProgress;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[390px] bg-[#0D0B0C] border border-[#2A2326] rounded-[28px] p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center text-white relative">
        {/* Header label */}
        <span className="text-[11px] font-bold tracking-[2.5px] text-[#806B73] uppercase mb-4 select-none">
          {title}
        </span>

        {/* Total Amount */}
        <div className="flex flex-col items-center my-3">
          <span className="text-4xl sm:text-[42px] font-extrabold tracking-tight text-white select-none">
            {amount.toLocaleString()} {currency}
          </span>
          <span className="text-[12px] text-[#806B73] font-medium mt-1 select-none">
            {subtitle}
          </span>
        </div>

        {/* Draggable slider container */}
        <div className="w-full mt-6">
          <div
            ref={trackRef}
            className="w-full h-15 bg-[#1C181A] border border-[#2D2529] rounded-full relative p-1 flex items-center select-none overflow-hidden touch-none"
          >
            {/* Filled background progress */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#35252D]/60 rounded-full transition-all"
              style={{ width: `${Math.max(15, dragProgress * 100)}%` }}
            />

            {/* Hint text inside track */}
            <div
              className="w-full text-center text-[13px] font-medium text-[#8E7982] pointer-events-none transition-opacity duration-150"
              style={{ opacity: Math.max(0, 1 - dragProgress * 1.5) }}
            >
              {isSubmitting ? 'Processing order...' : promptText}
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
              className="absolute left-1 top-1 bottom-1 w-13 h-13 rounded-full bg-[#2A2427] border border-[#3E343A] shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing text-white shrink-0 z-10 transition-colors hover:bg-[#342D30]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : confirmed ? (
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
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
          className="mt-5 text-[13px] text-[#806B73] hover:text-[#B73D67] font-semibold transition-colors cursor-pointer py-1 disabled:opacity-50"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
}
