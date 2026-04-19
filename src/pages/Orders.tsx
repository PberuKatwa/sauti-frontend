import { useState } from "react";
import { toast } from "react-toastify";
import type { AdminOrderRow, BaseOrderFilters, FullOrderFilters, OrderProfile, OrderStatus } from "../types/orders.types";
import { OrdersService } from "../services/orders.service";
import { getDateRange } from "../utils/getDateRange";

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

  const startFilters: BaseOrderFilters = {
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

  const getAllOrders = async (currentPg: number, currLimit: number) => {
    try {

      setLoading(true)

      const response = await OrdersService.getAllOrders(filters);
      if (!response.data) throw new Error(`No data was found`)

      setOrders(response.data.orders)
      setCurrentPage(response .data.pagination.currentPage)
      setLimit(currLimit)
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

    } catch (error) {
      toast.error("error in handling status update")
      console.error(`Error in updating status`);
    }

  }


}
