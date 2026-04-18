import React, { useState, useCallback } from 'react';
import type { OrderStatus, BaseOrderFilters, FullOrderFilters } from '../../types/orders.types';


interface OrderFiltersProps {
  variant?: 'base' | 'full';
  initialFilters?: Partial<FullOrderFilters>;
  onFilterChange: (filters: BaseOrderFilters | FullOrderFilters) => void;
  onReset?: () => void;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending_location', label: 'Pending Location' },
  { value: 'pending_contact', label: 'Pending Contact' },
  { value: 'pending_delivery_type', label: 'Pending Delivery Type' },
  { value: 'pending_delivery', label: 'Pending Delivery' },
  { value: 'enroute', label: 'En Route' },
  { value: 'delivered', label: 'Delivered' },
];

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  variant = 'base',
  initialFilters = {},
  onFilterChange,
  onReset,
}) => {
  const [filters, setFilters] = useState<FullOrderFilters>({
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    statuses: initialFilters.statuses || [],
    orderNumber: initialFilters.orderNumber || '',
    clientPhone: initialFilters.clientPhone || '',
  });

  const isFull = variant === 'full';

  const handleInputChange = useCallback((field: keyof FullOrderFilters, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [field]: value };
      onFilterChange(isFull ? updated : {
        startDate: updated.startDate,
        endDate: updated.endDate,
        statuses: updated.statuses,
      });
      return updated;
    });
  }, [isFull, onFilterChange]);

  const handleStatusToggle = useCallback((status: OrderStatus) => {
    setFilters((prev) => {
      const currentStatuses = prev.statuses || [];
      const updatedStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter((s) => s !== status)
        : [...currentStatuses, status];

      const updated = { ...prev, statuses: updatedStatuses };
      onFilterChange(isFull ? updated : {
        startDate: updated.startDate,
        endDate: updated.endDate,
        statuses: updated.statuses,
      });
      return updated;
    });
  }, [isFull, onFilterChange]);

  const handleReset = useCallback(() => {
    const resetFilters: FullOrderFilters = {
      startDate: '',
      endDate: '',
      statuses: [],
      orderNumber: '',
      clientPhone: '',
    };
    setFilters(resetFilters);
    onFilterChange(isFull ? resetFilters : {
      startDate: '',
      endDate: '',
      statuses: [],
    });
    onReset?.();
  }, [isFull, onFilterChange, onReset]);

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    (filters.statuses?.length || 0) > 0 ||
    (isFull && (filters.orderNumber || filters.clientPhone));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 font-['Poppins',sans-serif]">
      <div className="flex flex-col gap-4">
        {/* Search Fields - Full variant only */}
        {isFull && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#12245B]">
                Order Number
              </label>
              <input
                type="text"
                value={filters.orderNumber}
                onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                placeholder="Search order number..."
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#12245B]">
                Client Phone
              </label>
              <input
                type="text"
                value={filters.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                placeholder="Search phone number..."
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#12245B]">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#12245B]">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F48120] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#12245B]">
            Order Status
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => {
              const isSelected = filters.statuses?.includes(status.value);
              return (
                <button
                  key={status.value}
                  onClick={() => handleStatusToggle(status.value)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                    ${isSelected
                      ? 'bg-[#F48120] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }
                  `}
                >
                  {status.label}
                </button>
              );
            })}
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
            onClick={() => onFilterChange(isFull ? filters : {
              startDate: filters.startDate,
              endDate: filters.endDate,
              statuses: filters.statuses,
            })}
            className="px-6 py-2 bg-[#12245B] text-white text-sm font-medium rounded-md hover:bg-[#020617] transition-colors duration-200 shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
