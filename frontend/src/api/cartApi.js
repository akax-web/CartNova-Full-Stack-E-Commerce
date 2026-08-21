import apiClient, { DEMO_MODE } from './axiosClient';
import {
  demoFetchCart,
  demoAddToCart,
  demoUpdateCartItemQuantity,
  demoRemoveCartItem,
} from './demoService';

// GET /api/cart - userId comes from the JWT on the backend, never passed here.
export function fetchCart() {
  if (DEMO_MODE) return demoFetchCart();
  return apiClient.get('/api/cart');
}

// POST /api/cart
export function addToCart(productId, quantity) {
  if (DEMO_MODE) return demoAddToCart(productId, quantity);
  return apiClient.post('/api/cart', { productId, quantity });
}

// PUT /api/cart/{cartItemId}
export function updateCartItemQuantity(cartItemId, quantity) {
  if (DEMO_MODE) return demoUpdateCartItemQuantity(cartItemId, quantity);
  return apiClient.put(`/api/cart/${cartItemId}`, { quantity });
}

// DELETE /api/cart/{cartItemId}
export function removeCartItem(cartItemId) {
  if (DEMO_MODE) return demoRemoveCartItem(cartItemId);
  return apiClient.delete(`/api/cart/${cartItemId}`);
}
