import OrderFilters from "../components/filters/orders.filters";
import type { FullOrderFilters } from "../types/orders.types";


export default function Home() {

  const handleFilterChange = (filters: FullOrderFilters) => {
    console.log('Full filters:', filters);
  };

  const handleReset = () => {
    console.log('Filters reset');
  };

  return (
    <div>
      <h1>HOMEEEEEE</h1>
      <OrderFilters
        variant="full"
        initialFilters={{
          statuses: ['pending_delivery'],
          startDate: '2024-01-01'
        }}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </div>
  )
}
