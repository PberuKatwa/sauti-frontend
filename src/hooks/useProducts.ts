import { useEffect, useState } from "react";
import type { AllProducts, FullProduct } from "../types/product.types";
import { ProductsService } from "../services/products.service";

export function useProducts(currentPage: number, limit: number) {
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // prevents race conditions

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await ProductsService.getAllProducts(currentPage, limit);
        const data: AllProducts = response.data!;

        if (!isMounted) return;

        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [currentPage, limit]);

  return { products, totalPages, isLoading };
}
