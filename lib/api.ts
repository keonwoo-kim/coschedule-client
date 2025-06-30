import axios from "axios";
import Router from "next/router";
import { useUserStore } from "@/store/useUserStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      const userStore = useUserStore.getState();
      userStore.setToken(null);
      Router.replace("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
