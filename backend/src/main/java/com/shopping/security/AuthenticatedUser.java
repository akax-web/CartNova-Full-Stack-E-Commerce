package com.shopping.security;

/**
 * The principal object placed in the SecurityContext after a JWT is validated. Controllers pull
 * the current user's id from here instead of trusting a {userId} path variable - this is what
 * makes "cart belongs to whoever is logged in" actually enforceable (see Phase 2, REST API
 * section - {userId} was deliberately dropped from the cart/order URLs for this reason).
 */
public class AuthenticatedUser {
    private final int userId;
    private final String email;
    private final String role;

    public AuthenticatedUser(int userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public int getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
