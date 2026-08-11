package com.shopping.dao.impl;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.shopping.dao.CartDAO;
import com.shopping.models.CartItem;

/**
 * Ported from the original CartDAOimplementation - the SQL logic itself was correct and is
 * unchanged. The only structural change is JdbcTemplate (pooled connections) instead of a
 * single shared Connection field, which was not safe for concurrent requests (Phase 2, Bug #5).
 *
 * Added cartItemBelongsToUser(): the original had no ownership check on updateQuantity() /
 * removeFromCart() at all - any cartItemId could be updated/removed regardless of who owned it.
 * That was invisible in a single-user console session but is a real authorization hole in a
 * multi-user REST API, so the service layer now checks ownership before mutating.
 */
@Repository
public class CartDAOimplementation implements CartDAO {

    private final JdbcTemplate jdbcTemplate;

    public CartDAOimplementation(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public boolean addCart(int userId, int productId, int quantity) {
        int cartId;
        List<Integer> existing = jdbcTemplate.query(
                "SELECT CART_ID FROM CART WHERE USER_ID = ?",
                (rs, rowNum) -> rs.getInt("cart_id"), userId);

        if (!existing.isEmpty()) {
            cartId = existing.get(0);
        } else {
            jdbcTemplate.update("INSERT INTO CART(USER_ID) VALUES (?)", userId);
            cartId = jdbcTemplate.queryForObject(
                    "SELECT CART_ID FROM CART WHERE USER_ID = ?", Integer.class, userId);
        }

        int rows = jdbcTemplate.update(
                "INSERT INTO CART_ITEMS(CART_ID, PRODUCT_ID, QUANTITY) VALUES (?, ?, ?)",
                cartId, productId, quantity);
        return rows > 0;
    }

    @Override
    public List<CartItem> viewCart(int userId) {
        String query = "SELECT CI.CART_ITEMS_ID, CI.CART_ID, P.PRODUCTS_ID, P.PRODUCTS_NAME, P.PRICE, CI.QUANTITY "
                + "FROM CART_ITEMS CI "
                + "JOIN CART C ON CI.CART_ID = C.CART_ID "
                + "JOIN PRODUCTS P ON CI.PRODUCT_ID = P.PRODUCTS_ID "
                + "WHERE C.USER_ID = ?";
        return jdbcTemplate.query(query, (rs, rowNum) -> {
            CartItem item = new CartItem();
            item.setCartItemId(rs.getInt("CART_ITEMS_ID"));
            item.setCartId(rs.getInt("CART_ID"));
            item.setProductId(rs.getInt("PRODUCTS_ID"));
            item.setProductName(rs.getString("PRODUCTS_NAME"));
            item.setPrice(rs.getDouble("PRICE"));
            item.setQuantity(rs.getInt("QUANTITY"));
            return item;
        }, userId);
    }

    @Override
    public boolean removeFromCart(int cartItemId) {
        int rows = jdbcTemplate.update("DELETE FROM CART_ITEMS WHERE CART_ITEMS_ID = ?", cartItemId);
        return rows > 0;
    }

    @Override
    public boolean updateQuantity(int cartItemId, int quantity) {
        int rows = jdbcTemplate.update(
                "UPDATE CART_ITEMS SET QUANTITY = ? WHERE CART_ITEMS_ID = ?", quantity, cartItemId);
        return rows > 0;
    }

    @Override
    public boolean cartItemBelongsToUser(int cartItemId, int userId) {
        String query = "SELECT COUNT(*) FROM CART_ITEMS CI "
                + "JOIN CART C ON CI.CART_ID = C.CART_ID "
                + "WHERE CI.CART_ITEMS_ID = ? AND C.USER_ID = ?";
        Integer count = jdbcTemplate.queryForObject(query, Integer.class, cartItemId, userId);
        return count != null && count > 0;
    }
}
