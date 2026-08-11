package com.shopping.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shopping.dao.OrderDAO;
import com.shopping.exception.AccessDeniedCustomException;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.models.Invoice;
import com.shopping.models.Order;
import com.shopping.models.OrderItem;
import com.shopping.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderDAO orderDAO;

    public OrderServiceImpl(OrderDAO orderDAO) {
        this.orderDAO = orderDAO;
    }

    @Override
    public int checkout(int userId, String paymentMethod) {
        return orderDAO.checkOut(userId, paymentMethod);
    }

    @Override
    public List<Order> getOrdersByUser(int userId) {
        return orderDAO.getOrdersByUser(userId);
    }

    @Override
    public List<OrderItem> getOrderDetails(int userId, int orderId) {
        assertOwnership(userId, orderId);
        List<OrderItem> items = orderDAO.getOrderDetails(orderId);
        if (items.isEmpty()) {
            throw new ResourceNotFoundException("No items found for order id: " + orderId);
        }
        return items;
    }

    @Override
    public List<Invoice> generateInvoice(int userId, int orderId) {
        assertOwnership(userId, orderId);
        List<Invoice> invoice = orderDAO.generateInvoice(orderId);
        if (invoice.isEmpty()) {
            throw new ResourceNotFoundException("No invoice found for order id: " + orderId);
        }
        return invoice;
    }

    private void assertOwnership(int userId, int orderId) {
        if (!orderDAO.orderBelongsToUser(orderId, userId)) {
            // Deliberately the same message/behavior as "not found" would give for a stranger's
            // order id - we don't want to reveal that an order id exists but belongs to someone
            // else. See Phase 2 note on {orderId} authorization.
            throw new AccessDeniedCustomException("Order not found or does not belong to you");
        }
    }
}
