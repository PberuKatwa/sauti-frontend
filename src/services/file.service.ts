import { authorizedApiClient } from "./api.client";
import type { SingleFileAPiResponse } from "../types/file.types";

export const fileService = {

  async uploadImage(payload: FormData):Promise<SingleFileAPiResponse> {
    try {

      const response = await authorizedApiClient.post(
        "files/upload/images",
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
