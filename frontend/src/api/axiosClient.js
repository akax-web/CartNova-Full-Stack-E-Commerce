import axios from 'axios';

// Every API call in the app goes through this one client, per requirement #18
// ("central API service/configuration so the backend URL is not repeated everywhere").
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const TOKEN_KEY = 'cartnova_token';
export const USER_KEY = 'cartnova_user';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT to every outgoing request, per requirement #5.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized handling for expired/invalid tokens: clear storage and bounce to /login,
// per requirement #14 ("unauthorized/expired JWT properly").
let onUnauthorized = null;
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

// Pulls the backend's ApiResponse.message (and any field-level validation errors) out of an
// axios error so every page can show a real message instead of "Network Error".
export function extractErrorMessage(error) {
  if (error.response && error.response.data) {
    const body = error.response.data;
    if (body.data && typeof body.data === 'object' && !Array.isArray(body.data)) {
      const fieldMessages = Object.values(body.data).filter(Boolean);
      if (fieldMessages.length > 0) {
        return fieldMessages.join(' ');
      }
    }
    if (body.message) {
      return body.message;
    }
  }
  if (error.message === 'Network Error') {
    return 'Could not reach the CartNova server. Is the backend running?';
  }
  return 'Something went wrong. Please try again.';
}

export default apiClient;
