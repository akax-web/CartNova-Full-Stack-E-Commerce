import apiClient, { DEMO_MODE } from './axiosClient';
import { demoFetchProducts, demoFetchProductById } from './demoService';

// GET /api/products (verified endpoint) - the only source of product data.
// In DEMO_MODE (no backend configured) returns local demo data instantly.
export function fetchProducts() {
  if (DEMO_MODE) return demoFetchProducts();
  return apiClient.get('/api/products');
}

// GET /api/products/{id} (verified endpoint)
export function fetchProductById(productId) {
  if (DEMO_MODE) return demoFetchProductById(productId);
  return apiClient.get(`/api/products/${productId}`);
}
