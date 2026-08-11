package com.shopping.migration;

import java.util.List;
import java.util.Map;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Runs once at every startup and hashes any USERS.PASSWORD value that isn't already a BCrypt
 * hash (BCrypt hashes always start with "$2a$", "$2b$" or "$2y$"). This is what makes the switch
 * from plaintext to BCrypt (Phase 2 decision) safe to apply to existing data, including the
 * test@gmail.com / 77777 account, without a separate manual migration step.
 *
 * Idempotent and cheap: the WHERE clause means rows that are already hashed are skipped on
 * every subsequent startup, so it's safe to leave this component in permanently.
 */
@Component
public class PasswordMigrationRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public PasswordMigrationRunner(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Make sure the demo/testing account exists before we try to hash it.
        jdbcTemplate.update(
                "INSERT INTO USERS (NAME, EMAIL, PASSWORD, ROLE) " +
                "SELECT 'Akash', 'test@gmail.com', '77777', 'Customer' " +
                "WHERE NOT EXISTS (SELECT 1 FROM USERS WHERE EMAIL = 'test@gmail.com')");

        List<Map<String, Object>> plaintextRows = jdbcTemplate.queryForList(
                "SELECT USER_ID, PASSWORD FROM USERS " +
                "WHERE PASSWORD NOT LIKE '$2a$%' AND PASSWORD NOT LIKE '$2b$%' AND PASSWORD NOT LIKE '$2y$%'");

        for (Map<String, Object> row : plaintextRows) {
            int userId = ((Number) row.get("USER_ID")).intValue();
            String plaintext = (String) row.get("PASSWORD");
            String hashed = passwordEncoder.encode(plaintext);
            jdbcTemplate.update("UPDATE USERS SET PASSWORD = ? WHERE USER_ID = ?", hashed, userId);
        }

        if (!plaintextRows.isEmpty()) {
            System.out.println("[CartNova migration] Hashed " + plaintextRows.size()
                    + " plaintext password(s) with BCrypt.");
        }
    }
}
