import OrderFilters from "../components/filters/orders.filters";
import type { FullOrderFilters, MonthlyOrderStat } from "../types/orders.types";
import type { MetricItem } from '../components/cards/metrics.cards';
import MetricsGrid from "../components/cards/metrics.cards";
import {
  faUsers,
  faBox,
  faShoppingCart,
  faDollarSign,
  faTruck,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import MonthlySalesChart from "../components/charts/monthlyOrders.chart";


export default function Home() {

  const handleFilterChange = (filters: FullOrderFilters) => {
    console.log('Full filters:', filters);
  };

  const handleReset = () => {
    console.log('Filters reset');
  };

  const metricsData: MetricItem[] = [
    {
      label: 'Total Customers',
      value: '3,782',
      icon: faUsers,
    },
    {
      label: 'Total Orders',
      value: '5,359',
      icon: faBox,
    },
    {
      label: 'Pending Deliveries',
      value: '142',
      icon: faShoppingCart,
    },
    {
      label: 'Revenue',
      value: 'KES 1.2M',
      icon: faDollarSign,
    },
    {
      label: 'Active Agents',
      value: '24',
      icon: faTruck,
    },
    {
      label: 'Completed Today',
      value: '89',
      icon: faCheckCircle,
    },
  ];

  const monthlyData: MonthlyOrderStat[] = [
    { month: 1, monthName: "Jan", totalValue: 168000, orderCount: 45 },
    { month: 2, monthName: "Feb", totalValue: 385000, orderCount: 89 },
    { month: 3, monthName: "Mar", totalValue: 201000, orderCount: 52 },
    { month: 4, monthName: "Apr", totalValue: 298000, orderCount: 71 },
    { month: 5, monthName: "May", totalValue: 187000, orderCount: 48 },
    { month: 6, monthName: "Jun", totalValue: 195000, orderCount: 53 },
    { month: 7, monthName: "Jul", totalValue: 291000, orderCount: 78 },
    { month: 8, monthName: "Aug", totalValue: 110000, orderCount: 29 },
    { month: 9, monthName: "Sep", totalValue: 215000, orderCount: 58 },
    { month: 10, monthName: "Oct", totalValue: 390000, orderCount: 95 },
    { month: 11, monthName: "Nov", totalValue: 280000, orderCount: 72 },
    { month: 12, monthName: "Dec", totalValue: 112000, orderCount: 31 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12245B]">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Monitor your business performance and manage orders in real-time
          </p>
        </div>

        {/* Filters Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#12245B]">
              Filter Orders
            </h2>
            <span className="text-sm text-gray-400">
              Refine your view
            </span>
          </div>
          <OrderFilters
            variant="base"
            initialFilters={{
              statuses: ['pending_delivery'],
              startDate: '2024-01-01'
            }}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </section>

        {/* Key Metrics Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#12245B]">
              Key Metrics
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F48120] animate-pulse"></div>
              <span className="text-sm text-gray-500">Live updates</span>
            </div>
          </div>
          <MetricsGrid data={metricsData} />
        </section>

        {/* Sales Chart Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#12245B]">
              Sales Performance
            </h2>
            <button className="text-sm text-[#3B82F6] hover:text-[#12245B] transition-colors font-medium">
              View Detailed Report
            </button>
          </div>
          <MonthlySalesChart
            data={monthlyData}
            currency="KES"
          />
        </section>

        {/* Quick Actions Footer */}
        <section className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#12245B]">
                Need to manage orders?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Access your complete order management system
              </p>
            </div>
            <button className="px-6 py-2.5 bg-[#F48120] text-white text-sm font-medium rounded-lg hover:bg-[#e67310] transition-all duration-200 shadow-sm hover:shadow-md">
              View All Orders
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}
