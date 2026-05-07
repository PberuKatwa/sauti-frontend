import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCircleNotch,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { PaymentService } from "../../services/payments.service";
import type { CreatePaymentPayload, PaymentSources } from "../../types/payment.types";

const PAYMENT_SOURCES: PaymentSources[] = [
  "MPESA",
  "AIRTEL_MONEY",
  "NCBA",
  "KCB",
  "EQUITY",
  "COOPERATIVE_BANK",
];

const initialPayload: CreatePaymentPayload = {
  order_id: 0,
  source: "MPESA",
  reference: "",
  amount: 0,
};

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePaymentModal = function ({
  isOpen,
  onClose,
  onSuccess,
}: CreatePaymentModalProps) {
  const [data, setData] = useState<CreatePaymentPayload>(initialPayload);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "source" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.order_id) {
      toast.error("Order ID is required");
      return;
    }
    if (!data.reference.trim()) {
      toast.error("Reference is required");
      return;
    }
    if (data.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    try {
      setLoading(true);
      const response = await PaymentService.createPayment(data);
      toast.success(response.message);
      setData(initialPayload);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Error creating payment: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setData(initialPayload);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20 transition-colors duration-150";

  const labelClass = "text-sm font-medium text-gray-700";

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 p-4 sm:p-6 transition-opacity duration-200">
      <div className="relative z-[310] w-full max-w-[480px] max-h-[92vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-[#F48120] text-sm"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                New Payment
              </h3>
              <p className="text-xs text-gray-400">
                Record a customer payment
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

        {/* FORM */}
        <form
          className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          {/* ORDER ID */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-payment-order-id" className={labelClass}>
              Order ID
            </label>
            <input
              id="create-payment-order-id"
              type="number"
              name="order_id"
              value={data.order_id || ""}
              onChange={handleChange}
              placeholder="e.g. 123"
              required
              className={inputClass}
            />
          </div>

          {/* PAYMENT SOURCE */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-payment-source" className={labelClass}>
              Payment Source
            </label>
            <select
              id="create-payment-source"
              name="source"
              value={data.source}
              onChange={handleChange}
              className={inputClass}
            >
              {PAYMENT_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* REFERENCE */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-payment-reference" className={labelClass}>
              Reference
            </label>
            <input
              id="create-payment-reference"
              type="text"
              name="reference"
              value={data.reference}
              onChange={handleChange}
              placeholder="e.g. MPS1234567"
              required
              className={inputClass}
            />
          </div>

          {/* AMOUNT */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-payment-amount" className={labelClass}>
              Amount (KES)
            </label>
            <input
              id="create-payment-amount"
              type="number"
              name="amount"
              value={data.amount || ""}
              onChange={handleChange}
              placeholder="e.g. 1500"
              min={1}
              required
              className={inputClass}
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
              {loading ? "Creating..." : "Create Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaymentModal;
