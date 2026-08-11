import apiClient from './axiosClient';

// All of these map 1:1 to AdminProductController, which SecurityConfig already restricts to
// ROLE_ADMIN on the backend - no backend change was needed to add this frontend.

// GET /api/admin/products
export function fetchAdminProducts() {
  return apiClient.get('/api/admin/products');
}

// GET /api/admin/products/{id}
export function fetchAdminProductById(productId) {
  return apiClient.get(`/api/admin/products/${productId}`);
}

// POST /api/admin/products
export function createProduct(product) {
  return apiClient.post('/api/admin/products', product);
}

// PUT /api/admin/products/{id}
export function updateProduct(productId, product) {
  return apiClient.put(`/api/admin/products/${productId}`, product);
}

// DELETE /api/admin/products/{id}
export function deleteProduct(productId) {
  return apiClient.delete(`/api/admin/products/${productId}`);
}
