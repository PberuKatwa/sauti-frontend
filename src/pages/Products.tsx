import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { ProductsService } from "../services/products.service";
import type { AllProducts, FullProduct } from "../types/product.types";
import { CreateProductModal } from "../components/products/product.create";
import { UpdateProductModal } from "../components/products/products.update";

const initialUploadPayload: FullProduct = {
  id: 0,
  retailer_id: "",
  name: "",
  description: "",
  price: "0",
  user_id: 0,
  currency: null,
  availability: "in stock",
  brand: null,
  category: null,
  file_id: null,
  file_url: null,
  inventory: 0,
  signed_url:null,
  created_at: new Date(),
  metadata: null,
};

export const Products = function () {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FullProduct>(initialUploadPayload);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const openUpdateModal = (product: FullProduct) => {
    setSelectedProduct(product);
    setIsUpdateOpen(true);
  };

  const getAllProducts = async function (currentPage: number, limit: number) {
    try {
      setLoading(true);
      const response = await ProductsService.getAllProducts(currentPage, limit);
      const productsData: AllProducts = response.data!;
      setProducts(productsData.products);
      setCurrentPage(productsData.pagination.currentPage);
      setTotalPages(productsData.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async function (_id: number) {
    try {
      await ProductsService.trashProduct(_id);
      toast.success("Product deleted successfully");
      getAllProducts(currentPage, limit);
    } catch (error) {
      toast.error(`${error}`);
      console.error(`Error in handling delete`, error);
    }
  };

  useEffect(
    function () {
      getAllProducts(currentPage, limit);
    },
    [currentPage, limit]
  );

  return (
    <div className="min-h-screen bg-white px-3 py-8 font-[Poppins]">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5 text-[#F48120]" />
            </div>
            <span className="text-[10px] font-semibold text-[#F48120] uppercase tracking-[0.2em]">
              Catalog
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Products</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your product catalog</p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-[#F48120] shadow-sm shadow-[#F48120]/20
            hover:bg-[#E57514] hover:shadow-md hover:shadow-[#F48120]/30
            active:scale-95 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          New Product
        </button>
      </div>

      <div className="border-t border-gray-100 mb-10" />

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-16 justify-center">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-[#F48120] rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading products…</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-400">No products yet</p>
          <p className="text-xs text-gray-300 mt-1">Add your first product to the catalog</p>
        </div>
      )}

      {/* Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden
                shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]
                hover:-translate-y-0.5
                transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48 bg-gray-100">
                {product.signed_url ? (
                  <img
                  src={product.signed_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faPlus} className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Body */}
              <div className="flex-1 p-5 space-y-2 border-b border-gray-200">
                <h5 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">
                  {product.name}
                </h5>

                <p className="text-xs text-gray-500">
                  {product.brand || "No brand"} · {product.category || "Uncategorized"}
                </p>

                <p className="text-sm font-semibold text-gray-900">
                  {product.currency} {Number(product.price).toLocaleString()}
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      product.availability === "in stock"
                        ? "bg-green-50 text-green-700"
                        : product.availability === "out of stock"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {product.availability}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-3.5 flex gap-2 bg-gray-50">
                <button
                  onClick={() => openUpdateModal(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg
                    border border-gray-200 text-gray-500 bg-white
                    hover:border-[#3B82F6] hover:bg-blue-50 hover:text-[#0F172A]
                    transition-all duration-150"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg
                    border border-gray-200 text-gray-500 bg-white
                    hover:border-red-300 hover:bg-red-50 hover:text-red-600
                    transition-all duration-150"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            Page <span className="font-semibold text-gray-600">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-600">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg
                hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 text-xs font-medium rounded-lg transition-all ${
                  currentPage === page
                    ? "bg-[#F48120] text-white border border-transparent shadow-sm shadow-[#F48120]/30"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg
                hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg
              hover:bg-gray-50 cursor-pointer outline-none"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      )}

      {/* Modals */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => getAllProducts(currentPage, limit)}
      />

      <UpdateProductModal
        isOpen={isUpdateOpen}
        product={selectedProduct}
        onClose={() => setIsUpdateOpen(false)}
        onSuccess={() => getAllProducts(currentPage, limit)}
      />
    </div>
  );
};
