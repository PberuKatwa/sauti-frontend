import React from 'react';
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { MonthlyOrderStat } from '../../types/orders.types';

interface MonthlySalesChartProps {
  data: MonthlyOrderStat[];
  currency?: string;
}

export const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({
  data,
  currency = 'KES'
}) => {
  // Sort data by month number to ensure correct order
  const sortedData = [...data].sort((a, b) => a.month - b.month);

  // Extract month names and values for the chart
  const categories = sortedData.map(item => item.monthName);
  const salesValues = sortedData.map(item => item.totalValue);

  const options: ApexOptions = {
    colors: ["#F48120"], // Sauti Orange for the bars
    chart: {
      fontFamily: "Poppins, sans-serif", // Updated to match design doc
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontFamily: "Poppins, sans-serif",
        },
        formatter: (value: number) => {
          if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
          }
          if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
          }
          return value.toString();
        },
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${currency} ${val.toLocaleString()}`,
      },
    },
  };

  const series = [
    {
      name: "Total Sales",
      data: salesValues,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 font-['Poppins',sans-serif]">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#12245B]">
          Monthly Sales Performance
        </h3>
        <p className="text-sm text-gray-500">
          Revenue overview for the year
        </p>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px]">
          <Chart
            options={options}
            series={series}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
