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
    <div>
      <h1>HOMEEEEEE</h1>
      <OrderFilters
        variant="base"
        initialFilters={{
          statuses: ['pending_delivery'],
          startDate: '2024-01-01'
        }}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <MetricsGrid data={metricsData} />

      <MonthlySalesChart
        data={monthlyData}
        currency="KES"
      />
    </div>
  )
}
