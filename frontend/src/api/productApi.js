import apiClient from './axiosClient';

// GET /api/products (verified endpoint) - the only source of product data, no mock data.
export function fetchProducts() {
  return apiClient.get('/api/products');
}

// GET /api/products/{id} (verified endpoint)
export function fetchProductById(productId) {
  return apiClient.get(`/api/products/${productId}`);
}
