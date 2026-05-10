import axios from "axios";
import { toast } from "react-toastify";

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      toast.error("Your session has expired. Please log in again.", {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: "#fee2e2",
          color: "#b91c1c",
          fontWeight: "bold",
        },
      });

      // Delay to let toast show before redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }

    return Promise.reject(error);
  }
);
