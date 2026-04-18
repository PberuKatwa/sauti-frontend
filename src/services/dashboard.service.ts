import type { ApiResponse } from "../types/api.types";
import type { BaseOrderFilters, TotalOrdersStatsApiResponse } from "../types/orders.types";
import { apiClient } from "./api.client";

export const DashboardService = {

  async getTotalOrderStats(filters:BaseOrderFilters) {

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

    const allParams = params.toString()
    const response = await apiClient.get(`/dashboard/order/stats?${allParams}`);

    const orderStats: TotalOrdersStatsApiResponse = response.data;
    return orderStats;

  },

  async getTotalClients(startDate:string, endDate:string) {

    const params = new URLSearchParams();

    if (startDate) {
      params.append('startDate', startDate);
    }

    if (endDate) {
      params.append('endDate', endDate);
    }

    const allParams = params.toString()
    const response = await apiClient.get(`/dashboard/client/stats?${allParams}`);

    const totalClients: ApiResponse = response.data;
    return totalClients;
  }


}
