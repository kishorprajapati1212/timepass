import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const axiosInstance = axios.create({ baseURL: API_BASE_URL, timeout: 30000, headers: { "Content-Type": "application/json" } });
axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem("attendx_user");
  if (stored) { try { const { token } = JSON.parse(stored); if (token) config.headers.Authorization = `Bearer ${token}`; } catch (e) {} }
  return config;
}, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) { localStorage.removeItem("attendx_user"); window.location.href = "/login"; }
  return Promise.reject(error);
});
export default axiosInstance;
