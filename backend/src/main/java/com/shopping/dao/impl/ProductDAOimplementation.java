package com.shopping.dao.impl;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.shopping.dao.ProductDAO;
import com.shopping.models.Product;

/**
 * Ported from the original ProductDAOimplementation.
 *
 * Fixes applied vs the original (see Phase 2 analysis, Bug #3):
 *  - addProduct(), getProductById(), updateProduct(), deleteProduct() all referenced the
 *    singular PRODUCT_ID / PRODUCT_NAME columns, which don't match the confirmed real schema
 *    (PRODUCTS_ID / PRODUCTS_NAME, plural) already used correctly by getAllProducts() and by
 *    CartDAO/OrderDAO. All four methods now use the confirmed plural column names.
 *  - updateProduct() had malformed SQL (a stray "=", and PRICE was missing from the SET clause
 *    while the code still bound a price parameter). Rewritten to update all four editable
 *    fields correctly.
 */
@Repository
public class ProductDAOimplementation implements ProductDAO {

    private final JdbcTemplate jdbcTemplate;

    public ProductDAOimplementation(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private Product mapRow(java.sql.ResultSet rs, int rowNum) throws java.sql.SQLException {
        Product p = new Product();
        p.setProductsId(rs.getInt("products_id"));
        p.setProductName(rs.getString("products_name"));
        p.setPrice(rs.getDouble("price"));
        p.setQuantity(rs.getInt("quantity"));
        p.setCategory(rs.getInt("category_id"));
        return p;
    }

    @Override
    public boolean addProduct(Product product) {
        String query = "INSERT INTO PRODUCTS(PRODUCTS_NAME, PRICE, QUANTITY, CATEGORY_ID) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement psmt = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            psmt.setString(1, product.getProductName());
            psmt.setDouble(2, product.getPrice());
            psmt.setInt(3, product.getQuantity());
            psmt.setInt(4, product.getCategory());
            return psmt;
        }, keyHolder);

        if (rows > 0 && keyHolder.getKey() != null) {
            product.setProductsId(keyHolder.getKey().intValue());
        }
        return rows > 0;
    }

    @Override
    public List<Product> getAllProducts() {
        String query = "SELECT * FROM PRODUCTS";
        return jdbcTemplate.query(query, this::mapRow);
    }

    @Override
    public Product getProductById(int productId) {
        String query = "SELECT * FROM PRODUCTS WHERE PRODUCTS_ID = ?";
        List<Product> results = jdbcTemplate.query(query, this::mapRow, productId);
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public boolean updateProduct(Product product) {
        String query = "UPDATE PRODUCTS SET PRODUCTS_NAME = ?, PRICE = ?, QUANTITY = ?, CATEGORY_ID = ? "
                + "WHERE PRODUCTS_ID = ?";
        int rows = jdbcTemplate.update(query,
                product.getProductName(),
                product.getPrice(),
                product.getQuantity(),
                product.getCategory(),
                product.getProductsId());
        return rows > 0;
    }

    @Override
    public boolean deleteProduct(int productId) {
        String query = "DELETE FROM PRODUCTS WHERE PRODUCTS_ID = ?";
        int rows = jdbcTemplate.update(query, productId);
        return rows > 0;
    }
}
