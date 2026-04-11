import type { AllProductsApiResponse, CreateProductPayload, SingleProductMinimalApiResponse, UpdateProductPayload } from "../types/product.types"
import { apiClient } from "./api.client"

export const ProductsService = {

  async createProduct(payload:CreateProductPayload):Promise<SingleProductMinimalApiResponse> {

    const response = await apiClient.post(
      "products/catalog",
      payload,
      { headers: { "Content-Type": "multipart/form-data", }}
    )

    const product: SingleProductMinimalApiResponse = response.data;
    return product;
  },

  async updateProduct(payload: UpdateProductPayload): Promise<void>{

    await apiClient.post(
      "products/catalog/update",
      payload,
      { headers: { "Content-Type": "multipart/form-data", }}
    )

  },

  async getAllProducts(page: number, limit: number): Promise<AllProductsApiResponse>{

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const allParams = params.toString()
    const response = await apiClient.get(`/products/?${allParams}`);

    const products: AllProductsApiResponse = response.data;
    return products;

  }

}
