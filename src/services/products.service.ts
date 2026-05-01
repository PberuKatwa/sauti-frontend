import type { ApiResponse } from "../types/api.types";
import type { AllProductsApiResponse, BaseProductFilters, CreateProductPayload, SingleProductMinimalApiResponse, UpdateProductPayload } from "../types/product.types"
import { apiClient } from "./api.client"

export const ProductsService = {

  async createProduct(payload:CreateProductPayload):Promise<SingleProductMinimalApiResponse> {

    payload.user_id = 1;
    const response = await apiClient.post(
      "products/catalog",
      payload,
      { headers: { "Content-Type": "application/json", } }
    )

    const product: SingleProductMinimalApiResponse = response.data;
    return product;
  },

  async updateProduct(payload: UpdateProductPayload): Promise<void>{

    await apiClient.post(
      "products/catalog/update",
      payload,
      { headers: { "Content-Type": "application/json", }}
    )

  },

  async getAllProducts(page: number, limit: number, filters?:BaseProductFilters): Promise<AllProductsApiResponse>{
    const params = new URLSearchParams();

    if (page) {
      params.append('page', page.toString());
    }

    if (limit) {
      params.append('limit', limit.toString());
    }

    if (filters?.name) {
      params.append('name', filters.name);
    }

    if (filters?.brand) {
      params.append('brand', filters.brand);
    }

    if (filters?.category) {
      params.append('category', filters.category);
    }

    const allParams = params.toString()
    const response = await apiClient.get(`/products/?${allParams}`);

    const products: AllProductsApiResponse = response.data;
    return products;

  },

  async trashProduct(id: number) {
    try {
      const response= await apiClient.delete(
        `/products/catalog/${id}`
      )

      const propertyRes: ApiResponse = response.data;
      return propertyRes;
    } catch (error) {
      throw error;
    }
  },

}
