import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCircleNotch,
  faCartShopping,
  faSearch,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { OrdersService } from "../../services/orders.service";
import { ProductsService } from "../../services/products.service";
import type { CreateContactAndOrder, OrderItem } from "../../types/orders.types";
import type { FullProduct } from "../../types/product.types";

const initialPayload: CreateContactAndOrder = {
  clientPhone: 0,
  items: [],
};

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateOrderModal = function ({
  isOpen,
  onClose,
  onSuccess,
}: CreateOrderModalProps) {
  const [data, setData] = useState<CreateContactAndOrder>(initialPayload);
  const [loading, setLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(async () => {
      if (productSearch.trim().length === 0) {
        setProducts([]);
        return;
      }
      try {
        setSearching(true);
        const response = await ProductsService.getAllProducts(1, 20, {
          name: productSearch,
        });
        if (!response.data) throw new Error(`No Products were found`);
        setProducts(response.data.products);
        setShowResults(true);
      } catch {
        toast.error("Failed to search products");
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [productSearch, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleAddProduct = (product: FullProduct) => {
    const existing = data.items.find(
      (item) => item.catalogId === product.retailer_id
    );
    if (existing) {
      toast.info("Product already added");
      return;
    }
    const newItem: OrderItem = {
      name: product.name,
      catalogId: product.retailer_id,
      quantity: 1,
      unitPrice: Number(product.price),
    };
    setData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setProductSearch("");
    setShowResults(false);
  };

  const handleRemoveItem = (catalogId: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.catalogId !== catalogId),
    }));
  };

  const handleItemQuantityChange = (catalogId: string, quantity: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.catalogId === catalogId
          ? { ...item, quantity: quantity || 1 }
          : item
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.items.length === 0) {
      toast.error("Add at least one product");
      return;
    }
    try {
      setLoading(true);
      const response = await OrdersService.createOrder(data);
      toast.success(response.message);
      setData(initialPayload);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Error creating order: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setData(initialPayload);
    setProductSearch("");
    setProducts([]);
    setShowResults(false);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20 transition-colors duration-150";

  const labelClass = "text-sm font-medium text-gray-700";

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 p-4 sm:p-6 transition-opacity duration-200">
      <div className="relative z-[310] w-full max-w-[560px] max-h-[92vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-[#F48120] text-sm"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                New Order
              </h3>
              <p className="text-xs text-gray-400">
                Create a customer order
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
          {/* CLIENT DETAILS */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-clientPhone" className={labelClass}>
              Client Phone
            </label>
            <input
              id="create-clientPhone"
              type="number"
              name="clientPhone"
              value={data.clientPhone || ""}
              onChange={handleChange}
              placeholder="e.g. 254712345678"
              required
              className={inputClass}
            />
          </div>

          <hr className="border-gray-100" />

          {/* PRODUCT SEARCH */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor="create-product-search" className={labelClass}>
              Add Products
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              />
              <input
                id="create-product-search"
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() =>
                  products.length > 0 && setShowResults(true)
                }
                placeholder="Search products by name..."
                className={inputClass + " pl-9"}
              />
              {searching && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F48120] text-xs animate-spin"
                />
              )}
            </div>

            {/* SEARCH RESULTS DROPDOWN */}
            {showResults && products.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.retailer_id}
                    type="button"
                    onClick={() => handleAddProduct(product)}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F48120] border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                  >
                    <span className="truncate">{product.name}</span>
                    <span className="text-xs text-gray-400 ml-2 shrink-0">
                      {product.currency || "KES"}{" "}
                      {Number(product.price).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* NO RESULTS */}
            {showResults &&
              productSearch &&
              !searching &&
              products.length === 0 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-400 text-center">
                  No products found
                </div>
              )}
          </div>

          {/* SELECTED ITEMS */}
          {data.items.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className={labelClass}>
                Order Items ({data.items.length})
              </span>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
                {data.items.map((item) => (
                  <div
                    key={item.catalogId}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        KES{" "}
                        {(
                          item.unitPrice * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemQuantityChange(
                          item.catalogId,
                          Number(e.target.value)
                        )
                      }
                      min={1}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center text-gray-900 outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem(item.catalogId)
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-xs"
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm px-1">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  KES {subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* EMPTY ITEMS PLACEHOLDER */}
          {data.items.length === 0 && (
            <div className="border border-dashed border-gray-300 rounded-lg px-4 py-6 text-center text-sm text-gray-400">
              <FontAwesomeIcon
                icon={faPlus}
                className="text-gray-300 text-lg mb-1"
              />
              <p>Search and add products above</p>
            </div>
          )}

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
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
