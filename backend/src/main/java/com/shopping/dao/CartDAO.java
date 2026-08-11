package com.shopping.dao;

import java.util.List;

import com.shopping.models.CartItem;

public interface CartDAO {
    boolean addCart(int userId, int productId, int quantity);
    List<CartItem> viewCart(int userId);
    boolean removeFromCart(int cartItemId);
    boolean updateQuantity(int cartItemId, int quantity);
    boolean cartItemBelongsToUser(int cartItemId, int userId);
}
