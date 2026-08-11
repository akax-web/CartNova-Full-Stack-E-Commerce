package com.shopping.dao;

import java.util.List;

import com.shopping.models.Product;

public interface ProductDAO {
    boolean addProduct(Product product);
    List<Product> getAllProducts();
    Product getProductById(int productId);
    boolean updateProduct(Product product);
    boolean deleteProduct(int productId);
}
