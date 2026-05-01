import React, { useState, useCallback } from 'react';
import type { BaseProductFilters, ProductBrands, FlowerProductCategories } from '../../types/product.types';

interface ProductFiltersProps {
  initialFilters?: Partial<BaseProductFilters>;
  onFilterChange: (filters: BaseProductFilters) => void;
  onReset?: () => void;
}

const BRAND_OPTIONS: { value: ProductBrands; label: string }[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
];

const CATEGORY_OPTIONS: { value: FlowerProductCategories; label: string }[] = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'funeral', label: 'Funeral' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'valentines', label: 'Valentines' },
  { value: 'sympathy', label: 'Sympathy' },
  { value: 'congratulations', label: 'Congratulations' },
  { value: 'apology', label: 'Apology' },
  { value: 'family-occasions', label: 'Family Occasions' },
  { value: 'corporate', label: 'Corporate' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  initialFilters = {},
  onFilterChange,
  onReset,
}) => {
  const [filters, setFilters] = useState<BaseProductFilters>({
    name: initialFilters.name,
    brand: initialFilters.brand,
    category: initialFilters.category,
  });

  const handleInputChange = useCallback((field: keyof BaseProductFilters, value: string) => {
    setFilters((prev) => {
      const updated: BaseProductFilters = { ...prev, [field]: value || undefined };
      onFilterChange(updated);
      return updated;
    });
  }, [onFilterChange]);

  const handleSelectChange = useCallback((field: 'brand' | 'category', value: string) => {
    setFilters((prev) => {
      const updated: BaseProductFilters = { ...prev, [field]: value || undefined };
      onFilterChange(updated);
      return updated;
    });
  }, [onFilterChange]);

  const handleReset = useCallback(() => {
    const resetFilters: BaseProductFilters = {};
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset?.();
  }, [onFilterChange, onReset]);

  const hasActiveFilters =
    !!filters.name || !!filters.brand || !!filters.category;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 font-['Poppins',sans-serif]">
      <div className="flex flex-col gap-4">
        {/* Name Search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#12245B]">
            Product Name
          </label>
          <input
            type="text"
            value={filters.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Search by name..."
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Brand & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#12245B]">
              Brand
            </label>
            <select
              value={filters.brand || ''}
              onChange={(e) => handleSelectChange('brand', e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
            >
              <option value="">All Brands</option>
              {BRAND_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#12245B]">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleSelectChange('category', e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#12245B] transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={() => onFilterChange(filters)}
            className="px-6 py-2 bg-[#12245B] text-white text-sm font-medium rounded-md hover:bg-[#020617] transition-colors duration-200 shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
