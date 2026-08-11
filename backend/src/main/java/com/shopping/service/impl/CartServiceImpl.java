package com.shopping.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shopping.dao.CartDAO;
import com.shopping.dao.ProductDAO;
import com.shopping.exception.AccessDeniedCustomException;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.models.CartItem;
import com.shopping.service.CartService;

@Service
public class CartServiceImpl implements CartService {

    private final CartDAO cartDAO;
    private final ProductDAO productDAO;

    public CartServiceImpl(CartDAO cartDAO, ProductDAO productDAO) {
        this.cartDAO = cartDAO;
        this.productDAO = productDAO;
    }

    @Override
    public List<CartItem> viewCart(int userId) {
        return cartDAO.viewCart(userId);
    }

    @Override
    public void addToCart(int userId, int productId, int quantity) {
        if (productDAO.getProductById(productId) == null) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        cartDAO.addCart(userId, productId, quantity);
    }

    @Override
    public void updateQuantity(int userId, int cartItemId, int quantity) {
        if (!cartDAO.cartItemBelongsToUser(cartItemId, userId)) {
            throw new AccessDeniedCustomException("This cart item does not belong to you");
        }
        cartDAO.updateQuantity(cartItemId, quantity);
    }

    @Override
    public void removeFromCart(int userId, int cartItemId) {
        if (!cartDAO.cartItemBelongsToUser(cartItemId, userId)) {
            throw new AccessDeniedCustomException("This cart item does not belong to you");
        }
        cartDAO.removeFromCart(cartItemId);
    }
}
