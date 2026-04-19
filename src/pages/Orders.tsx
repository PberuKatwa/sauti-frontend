import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { AdminOrderRow, BaseOrderFilters, FullOrderFilters, OrderProfile, OrderStatus } from "../types/orders.types";
import { OrdersService } from "../services/orders.service";
import { getDateRange } from "../utils/getDateRange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash,faEye } from "@fortawesome/free-solid-svg-icons";
import type { ColumnType } from "../components/tables/DataTable";
import { SautiCloudLoader } from "../components/spinners/sauti.loader";
import DataTable from "../components/tables/DataTable";

const OrderFallback: AdminOrderRow[] = [
  {
    id: 0,
    order_number: 0,
    total: 0,
    delivery_status: "pending_delivery",
    client_phone: 0,
    created_at: "",
    latitude: "",
    longitude: "",
    order_contact: 0,
    delivery_type: "immediate",
    special_instructions:""
  }
]

export default function Orders() {

  const { startDate, endDate } = getDateRange(32);

  const startFilters: FullOrderFilters = {
    startDate,
    endDate,
    statuses:['pending_delivery']
  }

  const [filters,setFilters]= useState<BaseOrderFilters>(startFilters)
  const [orders, setOrders] = useState<AdminOrderRow[]>(OrderFallback);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const getAllOrders = async () => {
    try {

      setLoading(true)

      const response = await OrdersService.getAllOrders(currentPage, limit, filters);
      if (!response.data) throw new Error(`No data was found`)

      setOrders(response.data.orders)
      setCurrentPage(response .data.pagination.currentPage)
      setTotalPages(response.data.pagination.totalPages)

      toast.success(response.message)
    } catch (error) {
      console.error(`Error in getting all orders`, error)
      toast.error(`Error in fetching all orders`)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, status: OrderStatus) => {
    try {

      const update = await OrdersService.updateStatus({ orderId: id, status: status });

      if (!update.success) throw new Error(`Error in updating status`);
      toast.success("Successfully updated the order");

      await getAllOrders()

    } catch (error) {
      toast.error("error in handling status update")
      console.error(`Error in updating status`);
    }

  }

  const handleFilterChange = (filters: BaseOrderFilters) => {
    setFilters(filters);
  };

  const handleReset = () => {
    console.log('Filters reset');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  useEffect(
    () => {
      getAllOrders()
    },[filters,currentPage,limit]
  )

  if (loading) {
    return <SautiCloudLoader/>
  }

  const orderColumns: ColumnType[] = [
    {
      type: "text",
      key: "order_number",
      label: "Order Number",
    },
    {
      type: "text",
      key: "delivery_status",
      label: "Status",
    },
    {
      type: "text",
      key: "client_phone",
      label: "Client",
    },
    {
      type: "text",
      key: "google_maps_link",
      label: "Google Maps",
    },
    {
      type: "text",
      key: "order_contact",
      label: "Recipient",
    },
    {
      type: "text",
      key: "delivery_type",
      label: "Delivery",
    },
    {
      type: "text",
      key: "special_instructions",
      label: "Instructions",
    },
    {
      type: "text",
      key: "total",
      label: "total",
    },
    {
      type: "custom",
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex gap-2">
          <button className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-md transition-colors">
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button className="p-2 text-[#F48120] hover:bg-orange-50 rounded-md transition-colors">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
    ];

  return (
    <div>
      <DataTable
        columns={orderColumns}
        data={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleLimitChange}
        isLoading={loading}
        emptyMessage="No orders found"
      />
    </div>
  )


}
