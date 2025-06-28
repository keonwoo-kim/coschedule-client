import axios from "axios";
import { useUserStore } from "@/store/useUserStore";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
});

instance.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
