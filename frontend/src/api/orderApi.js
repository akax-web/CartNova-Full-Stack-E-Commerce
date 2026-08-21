import apiClient, { DEMO_MODE } from './axiosClient';
import {
  demoCheckout,
  demoFetchMyOrders,
  demoFetchOrderItems,
  demoFetchInvoice
} from './demoService';

// POST /api/orders/checkout
export function checkout(paymentMethod) {
  if (DEMO_MODE) return demoCheckout(paymentMethod);
  return apiClient.post('/api/orders/checkout', { paymentMethod });
}

// GET /api/orders
export function fetchMyOrders() {
  if (DEMO_MODE) return demoFetchMyOrders();
  return apiClient.get('/api/orders');
}

// GET /api/orders/{orderId}/items
export function fetchOrderItems(orderId) {
  if (DEMO_MODE) return demoFetchOrderItems(orderId);
  return apiClient.get(`/api/orders/${orderId}/items`);
}

// GET /api/orders/{orderId}/invoice
export function fetchInvoice(orderId) {
  if (DEMO_MODE) return demoFetchInvoice(orderId);
  return apiClient.get(`/api/orders/${orderId}/invoice`);
}
