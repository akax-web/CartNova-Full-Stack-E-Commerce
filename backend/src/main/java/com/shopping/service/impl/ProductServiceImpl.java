package com.shopping.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shopping.dao.ProductDAO;
import com.shopping.dto.ProductRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.models.Product;
import com.shopping.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductDAO productDAO;

    public ProductServiceImpl(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    @Override
    public List<Product> getAllProducts() {
        return productDAO.getAllProducts();
    }

    @Override
    public Product getProductById(int productId) {
        Product product = productDAO.getProductById(productId);
        if (product == null) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        return product;
    }

    @Override
    public Product addProduct(ProductRequest request) {
        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());

        productDAO.addProduct(product);
        return product;
    }

    @Override
    public Product updateProduct(int productId, ProductRequest request) {
        // Confirms the product exists first, so a bad id returns 404 rather than a silent no-op.
        getProductById(productId);

        Product product = new Product();
        product.setProductsId(productId);
        product.setProductName(request.getProductName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());

        productDAO.updateProduct(product);
        return product;
    }

    @Override
    public void deleteProduct(int productId) {
        getProductById(productId);
        productDAO.deleteProduct(productId);
    }
}
