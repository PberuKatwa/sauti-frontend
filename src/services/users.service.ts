import type { AllUsersApiResponse, BaseUserFilters } from "../types/user.types";
import { apiClient } from "./api.client";

export const UsersService = {
  async getAllUsers(page:number, limit:number, filters?:BaseUserFilters):AllUsersApiResponse {
    const params = new URLSearchParams();

    if (page) {
      params.append('page', page.toString());
    }

    if (limit) {
      params.append('limit', limit.toString());
    }

    if (filters?.firstName) {
      params.append('startDate', filters.firstName);
    }

    if (filters?.email) {
      params.append('endDate', filters.email);
    }

    if (filters?.lastName) {
      params.append('clientPhone', filters.lastName);
    }

    const allParams = params.toString()
    const response = await apiClient.get(`/users?${allParams}`);

    const users: AllUsersApiResponse = response.data;
    return users;
  }
}
