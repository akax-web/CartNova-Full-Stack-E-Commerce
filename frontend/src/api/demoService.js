/**
 * demoService.js
 * ──────────────
 * Provides frontend-only demo data when the Spring Boot backend is not
 * reachable (e.g. GitHub Pages public demo without a live server).
 *
 * Products are served from this file.
 * Cart state is stored in localStorage so it persists across page refreshes.
 *
 * This module is ONLY used when the backend returns a network error.
 * All real API calls still go through axiosClient → Spring Boot first.
 */

export const DEMO_PRODUCTS = [
  {
    productsId: 1,
    productName: 'Samsung Galaxy S25',
    price: 79999,
    quantity: 12,
    description: 'Flagship Android smartphone with AI camera and Snapdragon 8 Elite.',
  },
  {
    productsId: 2,
    productName: 'iPhone 16',
    price: 89999,
    quantity: 8,
    description: 'Apple A18 chip, Action button, and next-generation camera system.',
  },
  {
    productsId: 3,
    productName: 'ASUS Vivobook 15',
    price: 54999,
    quantity: 5,
    description: 'Thin and light laptop with Intel Core i5, 16 GB RAM, 512 GB SSD.',
  },
  {
    productsId: 4,
    productName: 'HP Victus Gaming',
    price: 74999,
    quantity: 3,
    description: 'AMD Ryzen 7 gaming laptop with RTX 4060 GPU and 144 Hz display.',
  },
  {
    productsId: 5,
    productName: 'Lenovo LOQ 15',
    price: 79999,
    quantity: 6,
    description: 'Powerful gaming laptop with Intel Core i7 and NVIDIA RTX 4060.',
  },
  {
    productsId: 6,
    productName: 'Wireless Mouse',
    price: 1299,
    quantity: 50,
    description: 'Ergonomic wireless mouse with 2.4 GHz receiver, 12-month battery.',
  },
  {
    productsId: 7,
    productName: 'Mechanical Keyboard',
    price: 3499,
    quantity: 20,
    description: 'TKL mechanical keyboard with Cherry MX Blue switches and RGB lighting.',
  },
  {
    productsId: 8,
    productName: 'USB-C Charger 65W',
    price: 1799,
    quantity: 35,
    description: 'GaN 65W USB-C fast charger compatible with laptops and phones.',
  },
];

const DEMO_CART_KEY = 'cartnova_demo_cart';

function getDemoCart() {
  try {
    const raw = localStorage.getItem(DEMO_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDemoCart(items) {
  localStorage.setItem(DEMO_CART_KEY, JSON.stringify(items));
}

// ── Products ─────────────────────────────────────────────────────────────────

export function demoFetchProducts() {
  return Promise.resolve({ data: { data: DEMO_PRODUCTS } });
}

export function demoFetchProductById(id) {
  const product = DEMO_PRODUCTS.find((p) => p.productsId === Number(id));
  if (!product) return Promise.reject(new Error('Product not found'));
  return Promise.resolve({ data: { data: product } });
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export function demoFetchCart() {
  const items = getDemoCart().map((item) => {
    const product = DEMO_PRODUCTS.find((p) => p.productsId === item.productId);
    return {
      cartItemId: item.cartItemId,
      productId: item.productId,
      productName: product?.productName || 'Unknown',
      price: product?.price || 0,
      quantity: item.quantity,
    };
  });
  return Promise.resolve({ data: { data: items } });
}

export function demoAddToCart(productId, quantity) {
  const cart = getDemoCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      cartItemId: Date.now(),
      productId,
      quantity,
    });
  }
  saveDemoCart(cart);
  return Promise.resolve({ data: { message: 'Added to cart' } });
}

export function demoUpdateCartItemQuantity(cartItemId, quantity) {
  const cart = getDemoCart();
  const item = cart.find((i) => i.cartItemId === cartItemId);
  if (item) {
    item.quantity = quantity;
    saveDemoCart(cart);
  }
  return Promise.resolve({ data: { message: 'Updated' } });
}

export function demoRemoveCartItem(cartItemId) {
  const cart = getDemoCart().filter((i) => i.cartItemId !== cartItemId);
  saveDemoCart(cart);
  return Promise.resolve({ data: { message: 'Removed' } });
}
