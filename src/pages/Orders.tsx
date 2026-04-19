import { useState } from "react";
import { toast } from "react-toastify";
import type { AdminOrderRow, OrderProfile } from "../types/orders.types";

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

  const [orders, setOrders] = useState<AdminOrderRow[]>(OrderFallback);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const getAllOrders = async () => {
    try {

      setLoading(true)

    } catch (error) {
      console.error(`Error in getting all orders`, error)
      toast.error(`Error in fetching all orders`)
    }
  }


}
