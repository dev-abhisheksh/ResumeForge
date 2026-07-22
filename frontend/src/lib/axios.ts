import axios from "axios";

// Fallback to live Render backend URL if NEXT_PUBLIC_API_URL is not set on Vercel
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://resumeforge-ayz6.onrender.com";

export const API = axios.create({
  baseURL,
  withCredentials: true,
});

// Shared promise to handle concurrent 401 requests without duplicate refresh calls
let refreshTokenPromise: Promise<unknown> | null = null;

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 1. Prevent infinite loop if the refresh endpoint itself fails
    if (
      originalRequest?.url?.includes("/auth/refresh-token") ||
      originalRequest?.url?.includes("/refresh-token")
    ) {
      refreshTokenPromise = null;
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // 2. Intercept 401 Unauthorized errors for initial token expiration
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // Reuse active refresh promise or create a new one
      if (!refreshTokenPromise) {
        refreshTokenPromise = API.get("/auth/refresh-token").finally(() => {
          refreshTokenPromise = null;
        });
      }

      // Wait for token refresh, then retry original request
      return refreshTokenPromise
        .then(() => API(originalRequest))
        .catch((refreshError) => {
          refreshTokenPromise = null;
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/register")
          ) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        });
    }

    return Promise.reject(error);
  }
);
