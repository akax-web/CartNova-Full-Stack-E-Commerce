import apiClient from './axiosClient';

// GET /api/cart - userId comes from the JWT on the backend, never passed here.
export function fetchCart() {
  return apiClient.get('/api/cart');
}

// POST /api/cart
export function addToCart(productId, quantity) {
  return apiClient.post('/api/cart', { productId, quantity });
}

// PUT /api/cart/{cartItemId}
export function updateCartItemQuantity(cartItemId, quantity) {
  return apiClient.put(`/api/cart/${cartItemId}`, { quantity });
}

// DELETE /api/cart/{cartItemId}
export function removeCartItem(cartItemId) {
  return apiClient.delete(`/api/cart/${cartItemId}`);
}
