import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderFilters from "../components/filters/orders.filters";
import type { AdminOrderRow, BaseOrderFilters, FullOrderFilters, OrderStatus } from "../types/orders.types";
import type { ColumnType } from "../components/tables/DataTable";
import DataTable from "../components/tables/DataTable";
import { OrdersService } from "../services/orders.service";
import { getDateRange } from "../utils/getDateRange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { SautiCloudLoader } from "../components/spinners/sauti.loader";
import { UpdateOrderStatusModal } from "../components/orders/orderStatus.update";

const OrderFallback: AdminOrderRow[] = [

  {
    id: 0,
    order_number: 0,
    total: 0,
    delivery_status: 'pending_delivery' as OrderStatus,
    client_phone: 0,
    latitude: "",
    longitude: "",
    order_contact: 0,
    delivery_type: 'immediate',
    special_instructions: "",
    google_maps_link: "",
    created_at: "",
  }

];

export default function Orders() {
  const { startDate, endDate } = getDateRange(32);

  const startFilters: FullOrderFilters = {
    startDate,
    endDate,
    statuses: [],
    orderNumber: "",
    clientPhone: "",
  };

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRow>(OrderFallback[0]);
  const [filters, setFilters] = useState<FullOrderFilters>(startFilters);
  const [orders, setOrders] = useState<AdminOrderRow[]>(OrderFallback);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const openUpdateModal = (order: AdminOrderRow) => {
    setSelectedOrder(order);
    setIsUpdateOpen(true);
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

  const handleStatusUpdate = async (id: number, status: OrderStatus) => {
    try {
      const update = await OrdersService.updateStatus({ orderId: id, status });
      if (!update.success) throw new Error("Error in updating status");
      toast.success("Successfully updated the order");
      await getAllOrders();
    } catch (error) {
      toast.error("Error in updating status");
      console.error("Error in updating status", error);
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

  const handleEdit = (row: Record<string, unknown>) => {
    toast.info(`Edit order #${row.order_number}`);
  };

  const handleDelete = (row: Record<string, unknown>) => {
    toast.warning(`Delete order #${row.order_number}`);
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
      type: "text",
      key: "order_number",
      label: "Order Number",
      cellClassName: "font-medium text-heading",
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
    {
      type: "text",
      key: "client_phone",
      label: "Client Phone",
    },
    {
      type: "text",
      key: "order_contact",
      label: "Recipient",
    },
    {
      type: "custom",
      key: "google_maps_link",
      label: "Google Maps",
      render: (value) =>
        value ? (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3B82F6] hover:underline font-medium"
          >
            Open Maps
          </a>
        ) : (
          <span className="text-gray-400">N/A</span>
        ),
    },
    {
      type: "text",
      key: "delivery_type",
      label: "Delivery Type",
    },
    {
      type: "custom",
      key: "total",
      label: "Total",
      render: (value) => formatCurrency(Number(value)),
    },
    {
      type: "custom",
      key: "created_at",
      label: "Created At",
      render: (value) => formatDate(String(value)),
    },
    {
      type: "custom",
      key: "actions",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          {/*<button
            className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-md transition-colors"
            title="View"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>*/}
          <button
            className="p-2 text-[#F48120] hover:bg-orange-50 rounded-md transition-colors"
            title="Edit"
            onClick={() => openUpdateModal(row as unknown as AdminOrderRow)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          {/*<button
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
            onClick={() => handleDelete(row)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>*/}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12245B]">
            Orders Management
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Track, manage, and fulfill all customer orders in one place
          </p>
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

      <UpdateOrderStatusModal
        isOpen={isUpdateOpen}
        order={selectedOrder}
        onClose={() => setIsUpdateOpen(false)}
        onSuccess={() => getAllOrders()}
      />
    </div>
  );
}
