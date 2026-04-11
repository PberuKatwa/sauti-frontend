import axios from "axios";

const API_URL: string = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const authorizedApiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

authorizedApiClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('access_token');
    const token = raw ? JSON.parse(raw) : null;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
