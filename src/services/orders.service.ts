import type { AllAdminOrdersApiResponse, FullOrderFilters, UpdateStatusPayload } from "../types/orders.types";
import { apiClient } from "./api.client";


export const OrdersService = {

  async getAllOrders(filters:FullOrderFilters) {
    const params = new URLSearchParams();

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
    const response = await apiClient.get(`/orders/admin?${allParams}`);

    const orders: AllAdminOrdersApiResponse = response.data;
    return orders;
  },

  async updateStatus(payload: UpdateStatusPayload) {

    const response = await apiClient.patch(
      "products/catalog",
      payload,
      { headers: { "Content-Type": "application/json", } }
    )

  }

}
