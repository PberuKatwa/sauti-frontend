import OrderFilters from "../components/filters/orders.filters";
import type { FullOrderFilters } from "../types/orders.types";
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
    </div>
  )
}
