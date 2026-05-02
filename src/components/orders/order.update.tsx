import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCircleNotch,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { OrdersService } from "../../services/orders.service";
import type { UpdateOrderPayload, OrderStatus, AdminOrderRow } from "../../types/orders.types";

const initialState: UpdateOrderPayload = {
  orderId: 0,
  delivery_status: "pending_location",
  order_contact: 0,
  delivery_type: "immediate",
  special_instructions: "",
  rider_phone: 0,
};

interface UpdateOrderModalProps {
  isOpen: boolean;
  order: AdminOrderRow;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateOrderModal = function ({
  isOpen,
  order,
  onClose,
  onSuccess,
}: UpdateOrderModalProps) {
  const [data, setData] = useState<UpdateOrderPayload>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setData({
        orderId: order.id,
        delivery_status: order.delivery_status,
        order_contact: order.order_contact,
        delivery_type: order.delivery_type,
        special_instructions: order.special_instructions || "",
        rider_phone: (order as AdminOrderRow & { rider_phone?: number }).rider_phone || 0,
      });
    }
  }, [order]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === "order_contact" || name === "rider_phone") {
      setData((prev) => ({ ...prev, [name]: value ? Number(value) : 0 }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await OrdersService.updateOrder(data);
      toast.success("Order updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Error updating order: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setData(initialState);
    onClose();
  };

  if (!isOpen || !order) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20 transition-colors duration-150";

  const labelClass = "text-sm font-medium text-gray-700";

  const statusOptions: OrderStatus[] = [
    "pending_location",
    "pending_contact",
    "pending_delivery_type",
    "pending_delivery",
    "enroute",
    "delivered",
  ];

  const deliveryTypeOptions: Array<"scheduled" | "immediate"> = [
    "scheduled",
    "immediate",
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 p-4 sm:p-6 transition-opacity duration-200">
      <div className="relative z-[310] w-full max-w-[500px] max-h-[92vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-[#F48120] text-sm"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Update Order
              </h3>
              <p className="text-xs text-gray-400">
                Order #{order.order_number}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#0F172A] hover:bg-[#0F172A] hover:text-white active:bg-[#020617] transition-colors duration-150"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* SCROLLABLE FORM */}
        <form
          className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          {/* STATUS & DELIVERY TYPE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="update-status" className={labelClass}>
                Status
              </label>
              <select
                id="update-status"
                name="delivery_status"
                value={data.delivery_status}
                onChange={handleChange}
                className={inputClass}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="update-delivery-type" className={labelClass}>
                Delivery Type
              </label>
              <select
                id="update-delivery-type"
                name="delivery_type"
                value={data.delivery_type}
                onChange={handleChange}
                className={inputClass}
              >
                {deliveryTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ORDER CONTACT & RIDER PHONE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="update-order-contact" className={labelClass}>
                Recipient Phone
              </label>
              <input
                id="update-order-contact"
                type="number"
                name="order_contact"
                value={data.order_contact || ""}
                onChange={handleChange}
                placeholder="e.g. 254712345678"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="update-rider-phone" className={labelClass}>
                Rider Phone
              </label>
              <input
                id="update-rider-phone"
                type="number"
                name="rider_phone"
                value={data.rider_phone || ""}
                onChange={handleChange}
                placeholder="e.g. 254712345678"
                className={inputClass}
              />
            </div>
          </div>

          {/* SPECIAL INSTRUCTIONS */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="update-special-instructions" className={labelClass}>
              Special Instructions
            </label>
            <textarea
              id="update-special-instructions"
              rows={3}
              name="special_instructions"
              value={data.special_instructions}
              onChange={handleChange}
              placeholder="e.g. Leave at the gate..."
              className={inputClass + " resize-none"}
            />
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
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 bg-[#F48120] hover:bg-[#E57514] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin"
                />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderModal;
