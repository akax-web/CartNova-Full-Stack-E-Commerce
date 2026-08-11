package com.shopping.service;

import java.util.List;

import com.shopping.models.CartItem;

public interface CartService {
    List<CartItem> viewCart(int userId);
    void addToCart(int userId, int productId, int quantity);
    void updateQuantity(int userId, int cartItemId, int quantity);
    void removeFromCart(int userId, int cartItemId);
}
