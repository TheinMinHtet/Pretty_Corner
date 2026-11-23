'use client';

import React from 'react';

export interface CategoryModalItem {
  id: string;
  label: string;
  description: string;
  count: number;
}

interface CategoryModalProps {
  categories: CategoryModalItem[];
  activeCategory: string;
  title: string;
  subtitle: string;
  activeLabel: string;
  itemsUnitLabel: string;
  onSelect: (categoryId: string) => void;
  onClose: () => void;
}

export default function CategoryModal({
  categories,
  activeCategory,
  title,
  subtitle,
  activeLabel,
  itemsUnitLabel,
  onSelect,
  onClose,
}: CategoryModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#38262e]/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl p-5 sm:p-6 max-h-[80vh] overflow-y-auto shadow-2xl z-10 border border-[#eedfe5] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#eedfe5]">
          <div>
            <h3 className="font-serif text-[22px] font-medium text-[#38262e]">
              {title}
            </h3>
            <p className="text-[12px] text-[#7a6870] mt-0.5">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#fceef2] flex items-center justify-center text-[#38262e] hover:bg-[#f6e1e8] transition-colors cursor-pointer"
            aria-label="Close categories"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-2.5">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className={`w-full text-left p-3.5 rounded-[12px] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#fceef2] border-[#b73d67] shadow-xs'
                    : 'bg-white border-[#eedfe5] hover:border-[#b73d67] hover:bg-[#faf7f8]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[14px] font-bold ${isSelected ? 'text-[#b73d67]' : 'text-[#38262e]'}`}>
                      {cat.label}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#b73d67] text-white font-bold px-1.5 py-0.5 rounded-full">
                        {activeLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#7a6870] mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-[#7a6870] bg-[#faf7f8] px-2.5 py-1 rounded-full border border-[#eedfe5] shrink-0">
                  {cat.count} {itemsUnitLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
