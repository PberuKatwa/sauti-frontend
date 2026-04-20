import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCircleNotch,
  faClipboardList,
  faTruck,
  faCheckCircle,
  faClock,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { OrdersService } from "../../services/orders.service";
import type { OrderStatus, UpdateStatusPayload, AdminOrderRow } from "../../types/orders.types";

const statusOptions: { value: OrderStatus; label: string; icon: typeof faClock; color: string }[] = [
  { value: "pending_location", label: "Pending Location", icon: faLocationDot, color: "text-gray-500" },
  { value: "pending_contact", label: "Pending Contact", icon: faPhone, color: "text-yellow-500" },
  { value: "pending_delivery_type", label: "Pending Delivery Type", icon: faClipboardList, color: "text-blue-500" },
  { value: "pending_delivery", label: "Pending Delivery", icon: faClock, color: "text-orange-500" },
  { value: "enroute", label: "En Route", icon: faTruck, color: "text-[#F48120]" },
  { value: "delivered", label: "Delivered", icon: faCheckCircle, color: "text-green-500" },
];

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  order: AdminOrderRow;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateOrderStatusModal = function ({
  isOpen,
  order,
  onClose,
  onSuccess,
}: UpdateOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending_delivery");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.delivery_status);
    }
  }, [order]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const payload: UpdateStatusPayload = {
        orderId: order.id,
        status: selectedStatus,
      };
      await OrdersService.updateStatus(payload);
      toast.success("Order status updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Error updating order status: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !order) return null;

  const labelClass = "text-sm font-medium text-gray-700";

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 p-4 sm:p-6 transition-opacity duration-200">
      <div className="relative z-[310] w-full max-w-[440px] max-h-[92vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
              <FontAwesomeIcon icon={faTruck} className="text-[#F48120] text-sm" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Update Order Status</h3>
              <p className="text-xs text-gray-400">Order #{order.order_number}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg
                       text-[#0F172A]
                       hover:bg-[#0F172A] hover:text-white
                       active:bg-[#020617]
                       transition-colors duration-150"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* SCROLLABLE FORM */}
        <form
          className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          {/* Current Status Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">Current Status</p>
            <p className="text-sm font-semibold text-[#12245B] mt-0.5 capitalize">
              {order.delivery_status.replace(/_/g, " ")}
            </p>
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-2">
            <span className={labelClass}>New Status</span>
            <div className="space-y-1.5">
              {statusOptions.map((option) => {
                const isSelected = selectedStatus === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedStatus(option.value)}
                    className={[
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-150",
                      isSelected
                        ? "border-[#12245B] bg-[#12245B]/5 ring-2 ring-[#12245B]/20"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                        isSelected
                          ? "border-[#12245B] bg-[#12245B]"
                          : "border-gray-300",
                      ].join(" ")}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <FontAwesomeIcon
                      icon={option.icon}
                      className={`w-4 h-4 flex-shrink-0 ${option.color}`}
                    />
                    <span
                      className={[
                        "text-sm font-medium",
                        isSelected ? "text-[#12245B]" : "text-gray-700",
                      ].join(" ")}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ACTIONS */}
          <div className="flex items-center gap-3 pb-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-200 text-gray-500 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 hover:border-[#0F172A] hover:bg-[#0F172A] hover:text-white active:bg-[#020617] active:border-[#020617]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedStatus === order.delivery_status}
              className="flex-[2] flex items-center justify-center gap-2 bg-[#F48120] hover:bg-[#E57514] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
