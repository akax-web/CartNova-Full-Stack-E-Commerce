package com.shopping.dao.impl;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.shopping.dao.UserDAO;
import com.shopping.models.User;

/**
 * Ported from the original UserDAOimplementation.
 *
 * Fixes applied vs the original:
 *  - emailExists() queried a non-existent "EMAILS" column (typo for "EMAIL"), which threw a
 *    SQLException that was silently swallowed and always returned false. Fixed to EMAIL.
 *  - login(email, password) is replaced by findByEmail(email); password verification now
 *    happens in the service layer via BCrypt (PasswordEncoder.matches), since passwords are
 *    hashed and can no longer be compared with a SQL WHERE clause.
 */
@Repository
public class UserDAOimplementation implements UserDAO {

    private final JdbcTemplate jdbcTemplate;

    public UserDAOimplementation(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public boolean registerUser(User user) {
        String query = "INSERT INTO USERS(NAME, EMAIL, PASSWORD, ROLE) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement psmt = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            psmt.setString(1, user.getName());
            psmt.setString(2, user.getEmail());
            psmt.setString(3, user.getPassword());
            psmt.setString(4, user.getRole());
            return psmt;
        }, keyHolder);

        if (rows > 0 && keyHolder.getKey() != null) {
            user.setUserId(keyHolder.getKey().intValue());
        }
        return rows > 0;
    }

    @Override
    public User findByEmail(String email) {
        String query = "SELECT * FROM USERS WHERE EMAIL = ?";
        List<User> results = jdbcTemplate.query(query, (rs, rowNum) -> {
            User user = new User();
            user.setUserId(rs.getInt("user_id"));
            user.setName(rs.getString("name"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setRole(rs.getString("role"));
            return user;
        }, email);
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public boolean emailExists(String email) {
        // Fixed: original queried "EMAILS" (typo) which always threw and returned false.
        String query = "SELECT COUNT(*) FROM USERS WHERE EMAIL = ?";
        Integer count = jdbcTemplate.queryForObject(query, Integer.class, email);
        return count != null && count > 0;
    }
}
