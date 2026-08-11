import apiClient from './axiosClient';

// Maps 1:1 to POST /api/auth/register (verified endpoint).
export function registerUser({ name, email, password }) {
  return apiClient.post('/api/auth/register', { name, email, password });
}

// Maps 1:1 to POST /api/auth/login (verified endpoint).
export function loginUser({ email, password }) {
  return apiClient.post('/api/auth/login', { email, password });
}
