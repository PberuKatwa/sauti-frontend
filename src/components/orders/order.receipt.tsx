import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBoxOpen,
  faCalendarCheck,
  faBoltLightning,
  faReceipt,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import type { OrderProfile } from "../../types/orders.types";

interface OrderReceiptProps {
  isOpen: boolean;
  order: OrderProfile;
  onClose: () => void;
}

export default function OrderReceipt({ isOpen, order, onClose }: OrderReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const isScheduled = order.delivery_type === "scheduled";

  const createdDate = new Date(order.created_at);
  const formattedDate = createdDate.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = createdDate.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const styles = document.querySelectorAll("style, link[rel='stylesheet']");
    let stylesHtml = "";
    styles.forEach((el) => stylesHtml += el.outerHTML);

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt #${order.order_number}</title>
          ${stylesHtml}
          <style>
            @page {
              margin: 0;
              size: auto;
            }
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${receiptRef.current.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 p-4 sm:p-6 transition-opacity duration-200">
      <div ref={receiptRef} className="receipt-card relative z-[310] w-full max-w-[460px] max-h-[92vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">

        {/* ── HEADER ── */}
        <div
          className="px-6 py-5 shrink-0"
          style={{ background: "linear-gradient(135deg, #12245B 0%, #020617 100%)" }}
        >
          {/* Brand row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F48120] inline-block" />
              <span className="text-white font-bold text-base tracking-wide">Sauti-Cloud</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrint}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150"
                title="Print Receipt"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>

          {/* Order number */}
          <p className="text-white/50 text-[10px] font-semibold tracking-widest uppercase mb-0.5">
            Order Confirmation
          </p>
          <p className="text-white text-2xl font-bold tracking-tight">
            #{order.order_number}
          </p>

          {/* Delivery type badge */}
          <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border border-[#F48120]/30 bg-[#F48120]/15">
            <FontAwesomeIcon
              icon={isScheduled ? faCalendarCheck : faBoltLightning}
              className="text-[#F48120] text-[10px]"
            />
            <span className="text-[#F48120] text-[11px] font-semibold">
              {isScheduled ? "Scheduled Delivery" : "Immediate Delivery"}
            </span>
          </span>
        </div>

        {/* ── SCROLLABLE BODY (printable area) ── */}
        <div className="overflow-y-auto flex-1 flex flex-col">

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-2.5 px-6 py-4 border-b border-gray-100">
            {[
              { label: "Date", value: formattedDate },
              { label: "Time", value: formattedTime },
              {
                label: "Contact",
                value: order.order_contact
                  ? `+${order.order_contact}`
                  : "\u2014",
              },
              {
                label: "Delivery",
                value: isScheduled ? "Scheduled" : "Immediate",
                accent: true,
              },
            ].map(({ label, value, accent }) => (
              <div key={label}>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">
                  {label}
                </p>
                <p
                  className={`text-[13px] font-semibold ${
                    accent ? "text-[#F48120]" : "text-gray-900"
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Items label */}
          <p className="px-6 pt-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
            Order Items
          </p>

          {/* Items list */}
          <div className="px-6 divide-y divide-gray-50">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 py-3">
                <div className="w-[26px] h-[26px] shrink-0 flex items-center justify-center rounded-lg bg-gray-100 text-[11px] font-bold text-[#12245B]">
                  {item.quantity}&times;
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                </div>
                <p className="text-[13px] font-semibold text-gray-900 whitespace-nowrap">
                  KES {(item.unitPrice * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Dashed divider */}
          <div className="mx-6 border-t-2 border-dashed border-gray-200 my-1" />

          {/* Totals */}
          <div className="px-6 pt-2 pb-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-[12px] text-gray-500">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[12px] text-gray-500">
              <span>Delivery fee</span>
              <span>KES {(order.total - subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold text-gray-900 border-t border-gray-200 mt-1 pt-2.5">
              <span>Total</span>
              <span className="text-[#12245B]">KES {order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 text-center">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Thank you for your order! You'll receive delivery updates via SMS
              to your registered contact number.
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[#F48120]">
              <FontAwesomeIcon icon={faBoxOpen} className="text-xs" />
              <span className="text-[11px] font-semibold">
                Powered by Sauti-Cloud
              </span>
              <FontAwesomeIcon icon={faReceipt} className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
