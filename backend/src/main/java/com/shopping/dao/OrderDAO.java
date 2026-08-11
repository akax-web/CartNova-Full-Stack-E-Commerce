package com.shopping.dao;

import java.util.List;

import com.shopping.models.Invoice;
import com.shopping.models.Order;
import com.shopping.models.OrderItem;

public interface OrderDAO {
    int checkOut(int userId, String paymentMethod);
    List<Order> getOrdersByUser(int userId);
    List<OrderItem> getOrderDetails(int orderId);
    List<Invoice> generateInvoice(int orderId);
    boolean orderBelongsToUser(int orderId, int userId);
}
