package com.shopping.models;

public class Product {
    private int productsId;
    private String productName;
    private double price;
    private int quantity;
    private int category;

    public Product() {
    }

    public Product(int productsId, String productName, double price, int quantity, int category) {
        this.productsId = productsId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    public int getProductsId() {
        return productsId;
    }

    public void setProductsId(int productsId) {
        this.productsId = productsId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Product [productsId=" + productsId + ", productName=" + productName + ", price=" + price
                + ", quantity=" + quantity + ", category=" + category + "]";
    }
}
