import type { ApiResponse } from "../types/api.types";
import type { AuthUserApiResponse, CreateUserPayload, ProfileApiResponse } from "../types/user.types";
import { apiClient } from "./api.client";

export const authService = {

  async login(email: string, password: string): Promise<AuthUserApiResponse> {

    const response = await apiClient.post("/auth/login", {
      email,
      password
    });

    const user: AuthUserApiResponse = response.data;
    return user
  },

  async profile(): Promise<ProfileApiResponse> {
    try {
      const response = await apiClient.get("/auth/profile");
      const user:ProfileApiResponse = response.data;
      return user;
    } catch (error) {
      throw error;
    }
  },

  async registerUser(payload:CreateUserPayload): Promise<ProfileApiResponse>{
    const response = await apiClient.post(
      "auth/register",
      payload,
      { headers: { "Content-Type": "application/json", } }
    )

    const user: ProfileApiResponse = response.data;

    return user;
  },

  async forgotPassword(email:string): Promise<ApiResponse>{
    const response = await apiClient.patch(
      `/auth/forgot-password/${email}`,
      { headers: { "Content-Type": "application/json", } }
    )

    const result: ApiResponse = response.data;

    return result;
  },

  async validateToken(token: string): Promise<ApiResponse>{
    const response = await apiClient.get(`/auth/validate-password-token/${token}`);
    const result: ApiResponse = response.data;

    return result;
  },

  async resetPassword(token:string, password:string): Promise<ApiResponse>{
    const response = await apiClient.put(
      `auth/reset-password/${token}`,
      {password:password},
      { headers: { "Content-Type": "application/json", } }
    )

    const result: ApiResponse = response.data;

    return result;
  },


  async logout(): Promise<void>{
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      throw error;
    }
  }

};
