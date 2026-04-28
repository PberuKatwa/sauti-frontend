import React, { useState, useCallback } from 'react';
import type { BaseUserFilters } from '../../types/user.types';

interface UserFiltersProps {
  initialFilters?: Partial<BaseUserFilters>;
  onFilterChange: (filters: BaseUserFilters) => void;
  onReset?: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  initialFilters = {},
  onFilterChange,
  onReset,
}) => {
  const [filters, setFilters] = useState<BaseUserFilters>({
    firstName: initialFilters.firstName || '',
    lastName: initialFilters.lastName || '',
    email: initialFilters.email || '',
  });

  const handleInputChange = useCallback((field: keyof BaseUserFilters, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [field]: value };
      onFilterChange(updated);
      return updated;
    });
  }, [onFilterChange]);

  const handleReset = useCallback(() => {
    const resetFilters: BaseUserFilters = {
      firstName: '',
      lastName: '',
      email: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset?.();
  }, [onFilterChange, onReset]);

  const hasActiveFilters =
    filters.firstName ||
    filters.lastName ||
    filters.email;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 font-['Poppins',sans-serif]">
      <div className="flex flex-col gap-4">
        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#12245B]">
              First Name
            </label>
            <input
              type="text"
              value={filters.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Search first name..."
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#12245B]">
              Last Name
            </label>
            <input
              type="text"
              value={filters.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Search last name..."
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#12245B]">
              Email
            </label>
            <input
              type="text"
              value={filters.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Search email..."
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
            />
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

export default UserFilters;
