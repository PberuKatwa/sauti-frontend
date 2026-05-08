import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrderFilters from "../components/filters/orders.filters";
import type { AdminOrder, BaseOrderFilters, FullOrderFilters } from "../types/orders.types";
import type { ColumnType } from "../components/tables/DataTable";
import DataTable from "../components/tables/DataTable";
import { OrdersService } from "../services/orders.service";
import { getMonthDateRange } from "../utils/getDateRange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { SautiCloudLoader } from "../components/spinners/sauti.loader";
import { CreateOrderModal } from "../components/orders/order.create";
import { UpdateOrderModal } from "../components/orders/order.update";
import { CreatePaymentModal } from "../components/payments/payments.create";

const OrderFallback: AdminOrder[] = [
  {
    id: 0,
    order_number: 0,
    total: 0,
    delivery_status: "pending_delivery",
    order_contact: null,
    delivery_type: "immediate",
    special_instructions: null,
    client_id: 0,
    latitude: "",
    longitude: "",
    rider_phone: null,
    created_at: "",
    updated_at: "",
    client_phone: null,
    payments: null,
    payment_status: "unpaid",
    total_paid: 0,
    google_maps_link: "",
    items: [],
  },
];

export default function Orders() {
  const navigate = useNavigate();
  const { startDate, endDate } = getMonthDateRange();

  const startFilters: FullOrderFilters = {
    startDate,
    endDate,
    statuses: [],
    orderNumber: "",
    clientPhone: "",
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentOrderId, setSelectedPaymentOrderId] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder>(OrderFallback[0]);
  const [filters, setFilters] = useState<FullOrderFilters>(startFilters);
  const [orders, setOrders] = useState<AdminOrder[]>(OrderFallback);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const openUpdateModal = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsUpdateOpen(true);
  };

  const openPaymentModal = (orderId: number) => {
    setSelectedPaymentOrderId(orderId);
    setIsPaymentOpen(true);
  };

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const response = await OrdersService.getAllOrders(currentPage, limit, filters);
      if (!response.data) throw new Error("No data was found");
      setOrders(response.data.orders);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      toast.success(response.message);
    } catch (error) {
      console.error("Error in getting all orders", error);
      toast.error("Error in fetching all orders");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: BaseOrderFilters | FullOrderFilters) => {
    const full = newFilters as FullOrderFilters;
    setFilters({
      startDate: full.startDate || "",
      endDate: full.endDate || "",
      statuses: full.statuses || [],
      orderNumber: full.orderNumber || "",
      clientPhone: full.clientPhone || "",
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(startFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  useEffect(() => {
    getAllOrders();
  }, [filters, currentPage, limit]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const orderColumns: ColumnType[] = [
    {
      type: "custom",
      key: "created_at",
      label: "Date",
      render: (value) => formatDate(String(value)),
    },
    {
      type: "text",
      key: "order_number",
      label: "Order Number",
      cellClassName: "font-medium text-heading",
    },
    {
      type: "custom",
      key: "details",
      label: "Details",
      cellClassName: "min-w-[180px]",
      render: (_value, row) => {
        const order = row as unknown as AdminOrder;
        const client = order.client_phone ? order.client_phone : "NA";
        const recipient = order.order_contact ? order.order_contact : "NA";
        const rider = order.rider_phone ? order.rider_phone : "NA";
        const location = order.google_maps_link ? (
          <a
            href={order.google_maps_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3B82F6] hover:underline font-medium"
          >
            Open Maps
          </a>
        ) : (
          "NA"
        );
        return (
          <div className="flex flex-col gap-0.5 text-xs text-gray-600">
            <div><span className="font-bold underline text-gray-700">Client:</span> {client}</div>
            <div><span className="font-bold underline text-gray-700">Recipient:</span> {recipient}</div>
            <div><span className="font-bold underline text-gray-700">Rider:</span> {rider}</div>
            <div><span className="font-bold underline text-gray-700">Location:</span> {location}</div>
          </div>
        );
      },
    },
    {
      type: "custom",
      key: "items",
      label: "Items",
      render: (_value, row) => {
        const items = (row as unknown as AdminOrder).items || [];
        if (items.length === 0) return <span className="text-gray-400 text-xs">No items</span>;
        return (
          <div className="flex flex-col gap-0.5">
            {items.map((item, idx) => (
              <div key={idx} className="text-xs text-gray-700">
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-400"> × {item.quantity} @ {formatCurrency(item.unitPrice)}</span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      type: "badge",
      key: "delivery_status",
      label: "Status",
      colorMap: {
        pending_location: "info",
        pending_contact: "warning",
        pending_delivery_type: "warning",
        pending_delivery: "warning",
        enroute: "primary",
        delivered: "success",
      },
    },
    // {
    //   type: "text",
    //   key: "delivery_type",
    //   label: "Delivery Type",
    // },
    {
      type: "custom",
      key: "total",
      label: "Total",
      render: (value) => formatCurrency(Number(value)),
    },
    {
      type: "badge",
      key: "payment_status",
      label: "Payment",
      colorMap: {
        unpaid: "error",
        partially_paid: "warning",
        paid: "success",
        overpaid: "info",
      },
    },
    {
      type: "custom",
      key: "payments",
      label: "Payments",
      render: (_value, row) => {
        const payments = (row as unknown as AdminOrder).payments;
        if (!payments || payments.length === 0) return <span className="text-gray-400 text-xs">No payments</span>;
        return (
          <div className="flex flex-col gap-0.5">
            {payments.map((p, idx) => (
              <div key={idx} className="text-xs text-gray-700">
                <span className="font-medium">{p.source}</span>
                <span className="text-gray-400"> · {p.reference}</span>
                <span className="text-gray-600"> · {formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        );
      },
    },

    {
      type: "custom",
      key: "actions",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <button
            className="p-1 text-lg text-[#3B82F6] hover:bg-blue-50 rounded-md transition-colors"
            title="View"
            onClick={() => navigate(`/dashboard/orders/${(row as unknown as AdminOrder).id}`)}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="p-1 text-lg text-[#F48120] hover:bg-orange-50 rounded-md transition-colors"
            title="Edit"
            onClick={() => openUpdateModal(row as unknown as AdminOrder)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="p-1 text-lg text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Record Payment"
            onClick={() => openPaymentModal((row as unknown as AdminOrder).id)}
          >
            <FontAwesomeIcon icon={faMoneyBill} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && orders.length === 0) {
    return <SautiCloudLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#12245B]">
              Orders Management
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Track, manage, and fulfill all customer orders in one place
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-[#F48120] shadow-sm shadow-[#F48120]/20
              hover:bg-[#E57514] hover:shadow-md hover:shadow-[#F48120]/30
              active:scale-95 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
            New Order
          </button>
        </div>

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
            variant="full"
            initialFilters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#12245B]">
              All Orders
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F48120] animate-pulse"></div>
              <span className="text-sm text-gray-500">
                {orders.length} order{orders.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
          <DataTable
            columns={orderColumns}
            data={orders}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleLimitChange}
            isLoading={loading}
            emptyMessage="No orders found matching your filters"
          />
        </section>
      </div>

      <CreateOrderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => getAllOrders()}
      />

      <UpdateOrderModal
        isOpen={isUpdateOpen}
        order={selectedOrder}
        onClose={() => setIsUpdateOpen(false)}
        onSuccess={() => getAllOrders()}
      />

      <CreatePaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => getAllOrders()}
        orderId={selectedPaymentOrderId}
      />
    </div>
  );
}
