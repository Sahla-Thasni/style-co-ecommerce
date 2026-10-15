import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  const isProtectedRequest =
    config.url?.startsWith("/cart/") ||
    config.url?.startsWith("/orders/") ||
    config.url?.includes("/reviews/eligibility/") ||
    (config.method?.toLowerCase() === "post" &&
      config.url?.includes("/reviews/"));

  if (accessToken && isProtectedRequest) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
export default api;
