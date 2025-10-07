import axios from "axios";

// 👇 Base URL for your backend
const BASE_URL = "https://cre8tlystudio.com/api";

// ✅ Create a reusable Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Optional: attach token automatically if you use auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – redirecting to login");
      // e.g., window.location = "/login";
    }
    return Promise.reject(error);
  }
);
