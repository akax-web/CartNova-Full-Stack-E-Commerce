package com.shopping.exception;

/**
 * Thrown when an authenticated user tries to access/modify a cart item or order that belongs
 * to someone else (e.g. guessing a cartItemId or orderId in the URL). The original console app
 * had no such check at all since only one user was ever logged in per session - see Phase 2,
 * "Bug #5/#6" follow-ups on CartDAO/OrderDAO.
 */
public class AccessDeniedCustomException extends RuntimeException {
    public AccessDeniedCustomException(String message) {
        super(message);
    }
}
