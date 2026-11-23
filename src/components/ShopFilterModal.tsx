'use client';

import React from 'react';
import { CategoryModalItem } from './CategoryModal';

interface ShopFilterModalProps {
  title: string;
  categoryHeading: string;
  priceRangeLabel: string;
  availabilityLabel: string;
  onlyInStockLabel: string;
  showMatchingLabel: string;
  clearAllLabel: string;
  categories: CategoryModalItem[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  catalogMaxPrice: number;
  maxPrice: number;
  userAdjustedPrice: boolean;
  onChangeMaxPrice: (price: number) => void;
  inStockOnly: boolean;
  onToggleInStock: (checked: boolean) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function ShopFilterModal({
  title,
  categoryHeading,
  priceRangeLabel,
  availabilityLabel,
  onlyInStockLabel,
  showMatchingLabel,
  clearAllLabel,
  categories,
  activeCategory,
  onSelectCategory,
  catalogMaxPrice,
  maxPrice,
  userAdjustedPrice,
  onChangeMaxPrice,
  inStockOnly,
  onToggleInStock,
  onClearAll,
  onClose,
}: ShopFilterModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="fixed inset-0 bg-[#38262e]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full md:max-w-md bg-white rounded-t-[20px] md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-6 md:zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#eedfe5]">
          <h2 className="font-serif text-[24px] font-medium text-[#38262e]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#fceef2] flex items-center justify-center text-[#38262e] hover:bg-[#f6e1e8] cursor-pointer"
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-5">
          <div>
            <p className="text-[13px] font-bold text-[#38262e] mb-2 uppercase tracking-wide">
              {categoryHeading}
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`h-[34px] px-3.5 rounded-[17px] text-[12px] transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#38262e] text-white font-medium'
                      : 'bg-[#fceef2] text-[#38262e]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[13px] font-bold text-[#38262e] mb-2">
              <span>{priceRangeLabel}</span>
              <span className="text-[#b73d67]">
                0 — {(userAdjustedPrice ? maxPrice : catalogMaxPrice).toLocaleString()} MMK
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max={catalogMaxPrice}
              step="5000"
              value={userAdjustedPrice ? maxPrice : catalogMaxPrice}
              onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
              className="w-full accent-[#b73d67] cursor-pointer"
            />
          </div>

          <div>
            <p className="text-[13px] font-bold text-[#38262e] mb-2 uppercase tracking-wide">
              {availabilityLabel}
            </p>
            <label className="flex items-center gap-2.5 text-[13px] text-[#38262e] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onToggleInStock(e.target.checked)}
                className="accent-[#b73d67]"
              />
              {onlyInStockLabel}
            </label>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-[48px] bg-[#b73d67] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#a33259] transition-colors cursor-pointer"
            >
              {showMatchingLabel}
            </button>

            <button
              type="button"
              onClick={onClearAll}
              className="w-full h-[44px] bg-[#fceef2] text-[#b73d67] rounded-[10px] font-bold text-[14px] hover:bg-[#f6e1e8] transition-colors cursor-pointer"
            >
              {clearAllLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
