package com.shopping.dao.impl;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.shopping.dao.CartDAO;
import com.shopping.dao.OrderDAO;
import com.shopping.exception.InsufficientStockException;
import com.shopping.models.CartItem;
import com.shopping.models.Invoice;
import com.shopping.models.Order;
import com.shopping.models.OrderItem;

/**
 * Ported from the original OrderDAOimplementation - this was the best-written part of the
 * original codebase (proper stock validation before commit, order/items/payment insert, cart
 * clear, all-or-nothing). That logic is preserved exactly.
 *
 * Structural changes vs the original (Phase 2, Bug #5 and #6):
 *  - Manual con.setAutoCommit(false)/commit()/rollback() is replaced by a declarative
 *    @Transactional boundary. Spring's DataSourceTransactionManager binds one pooled
 *    connection to the whole method, so every jdbcTemplate call here runs on the same
 *    connection and rolls back together on any exception - same guarantee, cleaner code.
 *  - CartDAO is now injected via the constructor rather than "new CartDAOimplementation()"
 *    inside checkOut(), so the cart read participates in the same managed transaction/connection
 *    instead of silently using a separate one.
 *  - checkOut() now returns the generated orderId (int) instead of boolean, so the frontend can
 *    redirect straight to the order confirmation / invoice screen. A failure throws
 *    InsufficientStockException instead of swallowing the error and returning false, which is
 *    what lets the REST layer return a proper 409 Conflict with a real message instead of a bare
 *    "checkout failed".
 */
@Repository
public class OrderDAOimplementation implements OrderDAO {

    private final JdbcTemplate jdbcTemplate;
    private final CartDAO cartDAO;

    public OrderDAOimplementation(JdbcTemplate jdbcTemplate, CartDAO cartDAO) {
        this.jdbcTemplate = jdbcTemplate;
        this.cartDAO = cartDAO;
    }

    @Override
    @Transactional
    public int checkOut(int userId, String paymentMode) {
        List<CartItem> cartItems = cartDAO.viewCart(userId);
        if (cartItems.isEmpty()) {
            throw new InsufficientStockException("Cart is empty - nothing to check out.");
        }

        double totalAmount = 0;
        for (CartItem item : cartItems) {
            totalAmount += item.getPrice() * item.getQuantity();
        }

        // Validate stock BEFORE writing anything - preserves original ordering/intent.
        for (CartItem item : cartItems) {
            Integer available = jdbcTemplate.queryForObject(
                    "SELECT QUANTITY FROM PRODUCTS WHERE PRODUCTS_ID = ?", Integer.class, item.getProductId());
            if (available == null || available < item.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for product: " + item.getProductName());
            }
        }

        KeyHolder keyHolder = new GeneratedKeyHolder();
        double finalTotal = totalAmount;
        jdbcTemplate.update(connection -> {
            java.sql.PreparedStatement psmt = connection.prepareStatement(
                    "INSERT INTO ORDERS(USERS_ID, TOTAL_AMOUNT) VALUES (?, ?)",
                    java.sql.Statement.RETURN_GENERATED_KEYS);
            psmt.setInt(1, userId);
            psmt.setDouble(2, finalTotal);
            return psmt;
        }, keyHolder);

        int orderId = keyHolder.getKey().intValue();

        for (CartItem item : cartItems) {
            jdbcTemplate.update(
                    "INSERT INTO ORDERS_ITEMS(ORDER_ID, PRODUCTS_ID, QUANTITY, PRICE) VALUES (?, ?, ?, ?)",
                    orderId, item.getProductId(), item.getQuantity(), item.getPrice());
        }

        for (CartItem item : cartItems) {
            jdbcTemplate.update(
                    "UPDATE PRODUCTS SET QUANTITY = QUANTITY - ? WHERE PRODUCTS_ID = ?",
                    item.getQuantity(), item.getProductId());
        }

        jdbcTemplate.update(
                "INSERT INTO PAYMENTS(ORDERS_ID, PAYMENT_MODE, PAYMENT_STATUS) VALUES (?, ?, ?)",
                orderId, paymentMode, "SUCCESS");

        jdbcTemplate.update(
                "DELETE CI FROM CART_ITEMS CI JOIN CART C ON CI.CART_ID = C.CART_ID WHERE C.USER_ID = ?",
                userId);

        return orderId;
    }

    @Override
    public List<Order> getOrdersByUser(int userId) {
        String query = "SELECT * FROM ORDERS WHERE USERS_ID = ? ORDER BY ORDER_DATE DESC";
        return jdbcTemplate.query(query, (rs, rowNum) -> {
            Order order = new Order();
            order.setOrderId(rs.getInt("ORDER_ID"));
            order.setUsersId(rs.getInt("USERS_ID"));
            order.setTotalAmount(rs.getDouble("total_amount"));
            order.setOrderDate(rs.getTimestamp("order_date"));
            return order;
        }, userId);
    }

    @Override
    public List<OrderItem> getOrderDetails(int orderId) {
        String query = "SELECT OI.ORDERS_ITEMS_ID, P.PRODUCTS_NAME, OI.QUANTITY, OI.PRICE FROM ORDERS_ITEMS OI "
                + "JOIN PRODUCTS P ON OI.PRODUCTS_ID = P.PRODUCTS_ID "
                + "WHERE OI.ORDER_ID = ?";
        return jdbcTemplate.query(query, (rs, rowNum) -> {
            OrderItem item = new OrderItem();
            item.setOrderItemId(rs.getInt("ORDERS_ITEMS_ID"));
            item.setProductName(rs.getString("PRODUCTS_NAME"));
            item.setQuantity(rs.getInt("QUANTITY"));
            item.setPrice(rs.getDouble("PRICE"));
            return item;
        }, orderId);
    }

    @Override
    public List<Invoice> generateInvoice(int orderId) {
        String query = "SELECT O.ORDER_ID, U.NAME, O.ORDER_DATE, P.PRODUCTS_NAME, OI.QUANTITY, OI.PRICE FROM ORDERS O "
                + "JOIN USERS U ON O.USERS_ID = U.USER_ID "
                + "JOIN ORDERS_ITEMS OI ON O.ORDER_ID = OI.ORDER_ID "
                + "JOIN PRODUCTS P ON OI.PRODUCTS_ID = P.PRODUCTS_ID "
                + "WHERE O.ORDER_ID = ?";
        return jdbcTemplate.query(query, (rs, rowNum) -> {
            Invoice invoice = new Invoice();
            invoice.setOrderId(rs.getInt("ORDER_ID"));
            invoice.setCustomerName(rs.getString("NAME"));
            invoice.setOrderDate(rs.getTimestamp("ORDER_DATE"));
            invoice.setProductName(rs.getString("PRODUCTS_NAME"));
            invoice.setQuantity(rs.getInt("QUANTITY"));
            invoice.setPrice(rs.getDouble("PRICE"));
            return invoice;
        }, orderId);
    }

    @Override
    public boolean orderBelongsToUser(int orderId, int userId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM ORDERS WHERE ORDER_ID = ? AND USERS_ID = ?",
                Integer.class, orderId, userId);
        return count != null && count > 0;
    }
}
