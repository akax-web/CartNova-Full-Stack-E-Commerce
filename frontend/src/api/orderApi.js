import apiClient from './axiosClient';

// POST /api/orders/checkout
export function checkout(paymentMethod) {
  return apiClient.post('/api/orders/checkout', { paymentMethod });
}

// GET /api/orders
export function fetchMyOrders() {
  return apiClient.get('/api/orders');
}

// GET /api/orders/{orderId}/items
export function fetchOrderItems(orderId) {
  return apiClient.get(`/api/orders/${orderId}/items`);
}

// GET /api/orders/{orderId}/invoice
export function fetchInvoice(orderId) {
  return apiClient.get(`/api/orders/${orderId}/invoice`);
}
