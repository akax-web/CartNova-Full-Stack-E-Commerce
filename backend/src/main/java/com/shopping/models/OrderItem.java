package com.shopping.models;

public class OrderItem {
    private int orderItemId;
    private int orderId;
    private int productsId;
    private int quantity;
    private double price;
    private String productName;

    public OrderItem() {
    }

    public OrderItem(int orderItemId, int orderId, int productsId, int quantity, double price, String productName) {
        this.orderItemId = orderItemId;
        this.orderId = orderId;
        this.productsId = productsId;
        this.quantity = quantity;
        this.price = price;
        this.productName = productName;
    }

    public int getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(int orderItemId) {
        this.orderItemId = orderItemId;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getProductsId() {
        return productsId;
    }

    public void setProductsId(int productsId) {
        this.productsId = productsId;
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

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getAmount() {
        return price * quantity;
    }

    @Override
    public String toString() {
        return "OrderItem [orderItemId=" + orderItemId + ", orderId=" + orderId + ", productsId=" + productsId
                + ", quantity=" + quantity + ", price=" + price + ", productName=" + productName + "]";
    }
}
