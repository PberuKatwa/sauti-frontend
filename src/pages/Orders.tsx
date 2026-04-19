import { useState } from "react";
import { toast } from "react-toastify";
import type { AdminOrderRow, BaseOrderFilters, FullOrderFilters, OrderProfile, OrderStatus } from "../types/orders.types";
import { OrdersService } from "../services/orders.service";
import { getDateRange } from "../utils/getDateRange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash,faEye } from "@fortawesome/free-solid-svg-icons";
import type { ColumnType } from "../components/tables/basic.table";

const OrderFallback: AdminOrderRow[] = [
  {
    id: 0,
    order_number: 0,
    total: 0,
    delivery_status: "pending_delivery",
    client_phone: 0,
    created_at:""
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

  const userColumns: ColumnType[] = [
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
      label: "client phone",
    },
      {
        type: "badge",
        key: "status",
        label: "Status",
        colorMap: {
          Active: "success",
          Pending: "warning",
          Cancel: "error",
        },
      },
      {
        type: "text",
        key: "role",
        label: "Role",
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

    </div>
  )


}
