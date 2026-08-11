package com.shopping.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.dto.ApiResponse;
import com.shopping.dto.CartRequest;
import com.shopping.dto.CartUpdateRequest;
import com.shopping.models.CartItem;
import com.shopping.security.AuthenticatedUser;
import com.shopping.service.CartService;

import jakarta.validation.Valid;

/**
 * Note there is deliberately no {userId} in any of these paths. The user id always comes from
 * the validated JWT (AuthenticatedUser, injected via @AuthenticationPrincipal) - see the Phase 2
 * write-up on why {userId} was dropped from the originally suggested endpoint list.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItem>>> viewCart(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(ApiResponse.ok("Cart fetched successfully", cartService.viewCart(user.getUserId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addToCart(@AuthenticationPrincipal AuthenticatedUser user,
                                                         @Valid @RequestBody CartRequest request) {
        cartService.addToCart(user.getUserId(), request.getProductId(), request.getQuantity());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Product added to cart"));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> updateQuantity(@AuthenticationPrincipal AuthenticatedUser user,
                                                              @PathVariable int cartItemId,
                                                              @Valid @RequestBody CartUpdateRequest request) {
        cartService.updateQuantity(user.getUserId(), cartItemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.ok("Cart quantity updated"));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(@AuthenticationPrincipal AuthenticatedUser user,
                                                              @PathVariable int cartItemId) {
        cartService.removeFromCart(user.getUserId(), cartItemId);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart"));
    }
}
