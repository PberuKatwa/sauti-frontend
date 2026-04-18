import React from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface MetricItem {
  label: string;
  value: string | number;
  icon: IconDefinition;
}

interface MetricsGridProps {
  data: MetricItem[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data }) => {
  // Split data into chunks of 3 for row creation
  const rows: MetricItem[][] = [];
  for (let i = 0; i < data.length; i += 3) {
    rows.push(data.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 font-['Poppins',sans-serif]">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6"
        >
          {row.map((item, index) => (
            <div
              key={`${rowIndex}-${index}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6"
            >
              {/* Icon Container - Sauti Navy Blue background */}
              <div className="flex items-center justify-center w-12 h-12 bg-[#12245B] rounded-xl">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-white text-xl"
                />
              </div>

              {/* Content */}
              <div className="mt-5">
                <span className="text-sm text-gray-500 font-medium">
                  {item.label}
                </span>
                <h4 className="mt-2 font-bold text-[#12245B] text-2xl">
                  {item.value}
                </h4>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
