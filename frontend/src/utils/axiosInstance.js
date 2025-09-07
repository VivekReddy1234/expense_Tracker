import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
  withCredentials: true, // ✅ ensure cookies (jwt) are sent automatically
});

// 🔹 Request interceptor (no localStorage/token needed)
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 🔹 Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
