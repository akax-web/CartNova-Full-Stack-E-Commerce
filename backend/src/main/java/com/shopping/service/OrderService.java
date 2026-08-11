package com.shopping.service;

import java.util.List;

import com.shopping.models.Invoice;
import com.shopping.models.Order;
import com.shopping.models.OrderItem;

public interface OrderService {
    int checkout(int userId, String paymentMethod);
    List<Order> getOrdersByUser(int userId);
    List<OrderItem> getOrderDetails(int userId, int orderId);
    List<Invoice> generateInvoice(int userId, int orderId);
}
