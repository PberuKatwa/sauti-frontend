import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUpload,
  faCircleNotch,
  faBoxOpen,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { ProductsService } from "../../services/products.service";
import { fileService } from "../../services/file.service";
import type { CreateProductPayload, availabilityStatus } from "../../types/product.types";

const initialPayload: CreateProductPayload = {
  user_id: 0,
  file_id: 0,
  name: "",
  description: "",
  price: 0,
  currency: "KES",
  availability: "in stock",
  brand: "classic",
  category: "birthday",
  inventory: 0,
  metadata: {},
};

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProductModal = function ({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductModalProps) {
  const [data, setData] = useState<CreateProductPayload>(initialPayload);
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "price" || name === "inventory") {
      setData((prev) => ({ ...prev, [name]: value ? Number(value) : 0 }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!e.target.files?.length) throw new Error("No file selected");
      const form = new FormData();
      form.append("file", e.target.files[0]);
      const response = await fileService.uploadImage(form);
      if (!response.data) throw new Error("Upload failed");
      toast.success(response.message);
      const fileId = response.data.id;
      setData((prev) => ({ ...prev, file_id: fileId }));
      setImageUploaded(true);
    } catch {
      toast.error("Invalid format, only images are allowed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await ProductsService.createProduct(data);
      toast.success(response.message);
      setData(initialPayload);
      setImageUploaded(false);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Error creating product: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setData(initialPayload);
    setImageUploaded(false);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20 transition-colors duration-150";

  const labelClass = "text-sm font-medium text-gray-700";

  const availabilityOptions: availabilityStatus[] = [
    "in stock",
    "out of stock",
    "preorder",
    "available for order",
    "discontinued",
    "pending",
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 p-4 sm:p-6 transition-opacity duration-200">
      <div className="relative z-[310] w-full max-w-[500px] max-h-[92vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
              <FontAwesomeIcon icon={faBoxOpen} className="text-[#F48120] text-sm" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">New Product</h3>
              <p className="text-xs text-gray-400">Add a new product to your catalog</p>
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
          {/* IMAGE UPLOAD */}
          <div className="flex flex-col gap-1.5">
            <span className={labelClass}>Product Image</span>
            <label
              htmlFor="create-file-upload"
              className={[
                "flex items-center gap-4 px-4 py-4 rounded-lg border border-dashed cursor-pointer transition-colors duration-150",
                imageUploaded
                  ? "border-[#3B82F6] bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-[#0F172A] hover:bg-blue-50",
                loading ? "opacity-60 pointer-events-none" : "",
              ].join(" ")}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faCircleNotch} className="text-[#F48120] text-lg animate-spin flex-shrink-0" />
                  <span className="text-sm text-gray-500">Uploading...</span>
                </>
              ) : imageUploaded ? (
                <>
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[#3B82F6] text-lg flex-shrink-0" />
                  <span className="text-sm font-medium text-[#0F172A]">Image uploaded successfully</span>
                </>
              ) : (
                <>
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 flex-shrink-0">
                    <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-sm" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Upload product image</span>
                    <span className="text-xs text-gray-400">JPG, PNG, WEBP</span>
                  </div>
                </>
              )}
            </label>
            <input
              id="create-file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={loading}
              onChange={handleImageUpload}
            />
          </div>

          <hr className="border-gray-100" />

          {/* PRODUCT NAME */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-name" className={labelClass}>Product Name</label>
            <input
              id="create-name"
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="e.g. Samsung Galaxy S24"
              required
              className={inputClass}
            />
          </div>

          {/* BRAND & CATEGORY */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-brand" className={labelClass}>Brand</label>
              <select
                id="create-brand"
                name="brand"
                value={data.brand}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="classic">Classic</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-category" className={labelClass}>Category</label>
              <select
                id="create-category"
                name="category"
                value={data.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="birthday">Birthday</option>
                <option value="wedding">Wedding</option>
                <option value="funeral">Funeral</option>
                <option value="anniversary">Anniversary</option>
                <option value="romantic">Romantic</option>
                <option value="valentines">Valentines</option>
                <option value="sympathy">Sympathy</option>
                <option value="congratulations">Congratulations</option>
                <option value="apology">Apology</option>
                <option value="family-occasions">Family Occasions</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
          </div>

          {/* PRICE & CURRENCY */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-price" className={labelClass}>Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none select-none">
                  {data.currency}
                </span>
                <input
                  id="create-price"
                  type="number"
                  name="price"
                  value={data.price || ""}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className={inputClass + " pl-12 font-medium"}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-currency" className={labelClass}>Currency</label>
              <select
                id="create-currency"
                name="currency"
                value={data.currency}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* INVENTORY */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-inventory" className={labelClass}>Inventory Quantity</label>
            <input
              id="create-inventory"
              type="number"
              name="inventory"
              value={data.inventory || ""}
              onChange={handleChange}
              placeholder="0"
              className={inputClass}
            />
          </div>

          {/* AVAILABILITY STATUS */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-availability" className={labelClass}>Availability Status</label>
            <select
              id="create-availability"
              name="availability"
              value={data.availability}
              onChange={handleChange}
              className={inputClass}
            >
              {availabilityOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-description" className={labelClass}>Description</label>
            <textarea
              id="create-description"
              rows={3}
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="e.g. Product features and details..."
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
              {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};