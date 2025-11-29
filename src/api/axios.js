

import axios from "axios";

// 👇 Base URL for your backend
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://cre8tlystudio.com/api"
    : "https://cre8tlystudio.com/api";

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
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

     if (originalRequest?.url?.includes("/auth/admin/verify-login-2fa")) {
      return Promise.reject(error);
    }

    // If not 401 OR already retried → reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Mark this request as retried
    originalRequest._retry = true;

    // If a refresh is already happening → wait for it
    if (refreshPromise) {
      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }

    // Start a new refresh request
    refreshPromise = refreshTokens();

    try {
      const newToken = await refreshPromise;
      // Apply token to the retry
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);

    } catch (err) {
      console.error("❌ Refresh failed:", err);
      logoutAdmin();
      throw err;
    } finally {
      refreshPromise = null;
    }
  }
);

// Actual refresh function
async function refreshTokens() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Missing refresh token");

  const res = await api.post(
    "/admin/auth/refresh",
    { token: refreshToken },
    { headers: { "x-admin-refresh": "true" } }
  );

  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data.accessToken;
}


function logoutAdmin() {
  localStorage.clear();
  window.location.href = "/login";
}

