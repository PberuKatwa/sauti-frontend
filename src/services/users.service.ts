import type { ApiResponse } from "../types/api.types";
import type { AllUsersApiResponse, BaseUserFilters, UpdateUserDetailsPayload } from "../types/user.types";
import { apiClient } from "./api.client";

export const UsersService = {
  async getAllUsers(page:number, limit:number, filters?:BaseUserFilters):Promise<AllUsersApiResponse> {
    const params = new URLSearchParams();

    if (page) {
      params.append('page', page.toString());
    }

    if (limit) {
      params.append('limit', limit.toString());
    }

    if (filters?.firstName) {
      params.append('firstName', filters.firstName);
    }

    if (filters?.email) {
      params.append('email', filters.email);
    }

    if (filters?.lastName) {
      params.append('lastName', filters.lastName);
    }

    const allParams = params.toString()
    const response = await apiClient.get(`/users?${allParams}`);

    const users: AllUsersApiResponse = response.data;
    return users;
  },

  async updateUser(payload:UpdateUserDetailsPayload):Promise<ApiResponse> {
    const response = await apiClient.put(
      `/users/${payload.userId}`,
      payload,
      { headers: { "Content-Type": "application/json", } }
    )

    const updateRes: ApiResponse = response.data;

    return updateRes;
  }
}
