import { useState } from "react";
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

}
