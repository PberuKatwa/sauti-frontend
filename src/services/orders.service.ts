import type { ApiResponse } from "../types/api.types";
import type { AllAdminOrdersApiResponse, CreateContactAndOrder, FullOrderFilters, SingleOrderApiResponse, UpdateOrderPayload } from "../types/orders.types";
import { apiClient } from "./api.client";


export const OrdersService = {

  async getAllOrders(page: number, limit: number, filters: FullOrderFilters): Promise<AllAdminOrdersApiResponse> {
    const params = new URLSearchParams();

    if (page) {
      params.append('page', page.toString());
    }

    if (limit) {
      params.append('limit', limit.toString());
    }

    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }

    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }

    if (filters.statuses && filters.statuses.length > 0) {
      params.append('statuses', filters.statuses.join(','));
    }

    if (filters.orderNumber) {
      params.append('orderNumber', filters.orderNumber);
    }

    if (filters.clientPhone) {
      params.append('clientPhone', filters.clientPhone);
    }

    const allParams = params.toString()
    const response = await apiClient.get(`/orders/?${allParams}`);

    const orders: AllAdminOrdersApiResponse = response.data;
    return orders;
  },

  async createOrder(payload: CreateContactAndOrder): Promise<SingleOrderApiResponse>{

    const response = await apiClient.post(
      `orders/create-client/${payload.clientPhone}`,
      payload,
      { headers: { "Content-Type": "application/json", } }
    );

    const orderRes: SingleOrderApiResponse = response.data;

    return orderRes;
  },


  async updateOrder(payload: UpdateOrderPayload):Promise<ApiResponse> {

    const response = await apiClient.put(
      `orders/${payload.orderId}`,
      payload,
      { headers: { "Content-Type": "application/json", } }
    )

    const updateRes: ApiResponse = response.data;

    return updateRes;
  },

  async getOrder(orderId: number): Promise<SingleOrderApiResponse>{
    const response = await apiClient.get(`orders/${orderId}`)

    const order: SingleOrderApiResponse = response.data;

    return order;
  }

}
