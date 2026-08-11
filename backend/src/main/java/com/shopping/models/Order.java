package com.shopping.models;

import java.sql.Timestamp;

public class Order {
    private int orderId;
    private int usersId;
    private double totalAmount;
    private Timestamp orderDate;

    public Order() {
    }

    public Order(int orderId, int usersId, double totalAmount, Timestamp orderDate) {
        this.orderId = orderId;
        this.usersId = usersId;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getUsersId() {
        return usersId;
    }

    public void setUsersId(int usersId) {
        this.usersId = usersId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Timestamp getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;
    }

    @Override
    public String toString() {
        return "Order [orderId=" + orderId + ", usersId=" + usersId + ", totalAmount=" + totalAmount
                + ", orderDate=" + orderDate + "]";
    }
}
