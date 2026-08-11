package com.shopping.service;

import java.util.List;

import com.shopping.dto.ProductRequest;
import com.shopping.models.Product;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(int productId);
    Product addProduct(ProductRequest request);
    Product updateProduct(int productId, ProductRequest request);
    void deleteProduct(int productId);
}
