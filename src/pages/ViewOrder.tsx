import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPenToSquare,
  faUser,
  faTruck,
  faBox,
  faLocationDot,
  faReceipt,
  faCreditCard,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { OrdersService } from "../services/orders.service";
import type { AdminOrder, OrderStatus } from "../types/orders.types";
import { SautiCloudLoader } from "../components/spinners/sauti.loader";
import { UpdateOrderModal } from "../components/orders/order.update";
import { CreatePaymentModal } from "../components/payments/payments.create";
import OrderReceipt from "../components/orders/order.receipt";

const statusColors: Record<OrderStatus, string> = {
  pending_location: "bg-blue-50 text-blue-700 border-blue-200",
  pending_contact: "bg-yellow-50 text-yellow-700 border-yellow-200",
  pending_delivery_type: "bg-yellow-50 text-yellow-700 border-yellow-200",
  pending_delivery: "bg-yellow-50 text-yellow-700 border-yellow-200",
  enroute: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
};

export default function ViewOrder() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const getOrder = async () => {
    try {
      setLoading(true);
      const response = await OrdersService.getOrder(Number(orderId));
      if (!response.data) throw new Error("Order not found");
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order", error);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) getOrder();
  }, [orderId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayValue = (value: string | number | null) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return String(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['Poppins',sans-serif]">
        <SautiCloudLoader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-['Poppins',sans-serif]">
        <p className="text-gray-500 mb-4">Order not found</p>
        <button
          onClick={() => navigate("/dashboard/orders")}
          className="px-4 py-2 bg-[#F48120] text-white text-sm font-medium rounded-lg hover:bg-[#E57514] transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-[#0F172A] hover:border-[#0F172A] transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#12245B]">
                  Order #{order.order_number}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                    statusColors[order.delivery_status]
                  }`}
                >
                  {order.delivery_status
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Created {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReceiptOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                bg-white border-2 border-[#12245B] text-[#12245B]
                hover:bg-[#12245B] hover:text-white hover:shadow-md hover:shadow-[#12245B]/20
                active:scale-95 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faPrint} className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-green-600 shadow-sm shadow-green-600/20
                hover:bg-green-700 hover:shadow-md hover:shadow-green-600/30
                active:scale-95 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faCreditCard} className="w-3.5 h-3.5" />
              Record Payment
            </button>
            <button
              onClick={() => setIsUpdateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-[#F48120] shadow-sm shadow-[#F48120]/20
                hover:bg-[#E57514] hover:shadow-md hover:shadow-[#F48120]/30
                active:scale-95 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="w-3.5 h-3.5" />
              Edit Order
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FontAwesomeIcon icon={faBox} className="text-[#F48120] text-sm" />
                <h2 className="text-sm font-semibold text-gray-900">Order Items</h2>
                <span className="ml-auto text-xs text-gray-400">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        Unit price {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">× {item.quantity}</p>
                      <p className="text-xs text-gray-400">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">VAT / Charges</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.total - order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-1">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#F48120]">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faTruck} className="text-[#F48120] text-xs" />
                Delivery
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Type</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{order.delivery_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Rider Phone</p>
                  <p className="text-sm font-medium text-gray-900">{displayValue(order.rider_phone)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  {order.latitude && order.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#3B82F6] hover:underline"
                    >
                      <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                      {order.latitude}, {order.longitude}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Special Instructions</p>
                  <p className="text-sm font-medium text-gray-900">{displayValue(order.special_instructions)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faReceipt} className="text-[#F48120] text-xs" />
                Order Info
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Order Number</p>
                  <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mt-0.5 ${
                      statusColors[order.delivery_status]
                    }`}
                  >
                    {order.delivery_status
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Created At</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(order.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-[#F48120] text-xs" />
                Customer
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Client ID</p>
                  <p className="text-sm font-medium text-gray-900">{order.client_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Contact Phone</p>
                  <p className="text-sm font-medium text-gray-900">{displayValue(order.order_contact)}</p>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCreditCard} className="text-[#F48120] text-xs" />
                Payments
              </h2>
              {order.payments && order.payments.length > 0 ? (
                <div className="space-y-3">
                  {order.payments.map((payment, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-gray-400">{payment.source}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{payment.reference}</p>
                        <p className="text-sm font-medium text-[#F48120]">{formatCurrency(payment.amount)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-semibold">
                    <span className="text-gray-900">Total Paid</span>
                    <span className="text-[#F48120]">{formatCurrency(order.total_paid)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No payments recorded</p>
              )}
            </div>

          </div>
        </div>
      </div>

      <UpdateOrderModal
        isOpen={isUpdateOpen}
        order={order}
        onClose={() => setIsUpdateOpen(false)}
        onSuccess={() => getOrder()}
      />

      <CreatePaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => getOrder()}
        orderId={Number(orderId)}
      />

      <OrderReceipt
        isOpen={isReceiptOpen}
        order={order}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
