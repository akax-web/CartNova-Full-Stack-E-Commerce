package com.shopping.models;

import java.sql.Timestamp;

public class Invoice {
    private int orderId;
    private String customerName;
    private Timestamp orderDate;
    private String productName;
    private int quantity;
    private double price;

    public Invoice() {
    }

    public Invoice(int orderId, String customerName, Timestamp orderDate, String productName, int quantity,
                    double price) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.orderDate = orderDate;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Timestamp getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getAmount() {
        return price * quantity;
    }

    @Override
    public String toString() {
        return "Invoice [orderId=" + orderId + ", customerName=" + customerName + ", orderDate=" + orderDate
                + ", productName=" + productName + ", quantity=" + quantity + ", price=" + price + "]";
    }
}
