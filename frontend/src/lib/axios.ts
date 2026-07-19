import axios from "axios";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Shared promise to handle concurrent 401 requests without duplicate refresh calls
let refreshTokenPromise: Promise<unknown> | null = null;

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // 1. Prevent infinite loop if the refresh endpoint itself returned 401
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // 2. Reuse the active refresh promise or start a new one if none exists
      if (!refreshTokenPromise) {
        refreshTokenPromise = API.get("/auth/refresh-token").finally(() => {
          refreshTokenPromise = null;
        });
      }

      // 3. Wait for refresh to finish, then retry original request
      return refreshTokenPromise
        .then(() => API(originalRequest))
        .catch((refreshError) => {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        });
    }

    return Promise.reject(error);
  }
);

/*
  ==============================================================================
  EXPLANATION OF THE SIMPLIFIED REFRESH TOKEN LOGIC
  ==============================================================================

  1. PROMISE REUSE (No Manual Array Queues):
     - Instead of maintaining a manual array queue (`failedQueue`) of resolve/reject
       callbacks, we store the pending `/auth/refresh-token` request in `refreshTokenPromise`.
     - Concurrent 401 requests automatically attach to the SAME pending promise.
     - When the refresh promise resolves, all waiting requests retry automatically via
       `.then(() => API(originalRequest))`.

  2. INFINITE LOOP PREVENTION:
     - `originalRequest.url?.includes("/auth/refresh-token")` ensures that if refreshing
       fails with a 401, it rejects immediately rather than entering an infinite loop.

  3. AUTOMATIC CLEANUP & REDIRECT:
     - `.finally()` clears `refreshTokenPromise` back to `null` once finished so future
       expired tokens can trigger a fresh refresh call.
     - `.catch()` redirects to `/login` if token refresh fails (e.g., session expired).
  ==============================================================================
*/
