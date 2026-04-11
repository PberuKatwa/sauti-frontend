import { apiClient } from "./api.client";
import type { SingleFileAPiResponse } from "../types/file.types";

export const fileService = {

  async uploadImage(payload: FormData):Promise<SingleFileAPiResponse> {
    try {

      const response = await apiClient.post(
        "files/upload/images/whatsapp",
        payload,
        { headers: { "Content-Type": "multipart/form-data", }}
      )

      const file: SingleFileAPiResponse = response.data;
      return file;

    } catch (error) {
      throw error;
    }
  }

}
