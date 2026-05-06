import { apiClient } from "./api.client";
import type { BasePaymentsApiResponse, CreatePaymentPayload } from "../types/payment.types";

export const PaymentService = {

  async createPayment(payload: CreatePaymentPayload):Promise<BasePaymentsApiResponse> {

    const response = await apiClient.post(
      `/payments`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    )

    const payment: BasePaymentsApiResponse = response.data;
    return payment;
  }

}
