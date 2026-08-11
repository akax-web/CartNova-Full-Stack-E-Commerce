package com.shopping.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.dto.ApiResponse;
import com.shopping.dto.CheckoutRequest;
import com.shopping.models.Invoice;
import com.shopping.models.Order;
import com.shopping.models.OrderItem;
import com.shopping.security.AuthenticatedUser;
import com.shopping.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> checkout(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody CheckoutRequest request) {
        int orderId = orderService.checkout(user.getUserId(), request.getPaymentMethod());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Checkout successful", Map.of("orderId", orderId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(ApiResponse.ok("Orders fetched successfully",
                orderService.getOrdersByUser(user.getUserId())));
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<ApiResponse<List<OrderItem>>> getOrderDetails(
            @AuthenticationPrincipal AuthenticatedUser user, @PathVariable int orderId) {
        return ResponseEntity.ok(ApiResponse.ok("Order details fetched successfully",
                orderService.getOrderDetails(user.getUserId(), orderId)));
    }

    @GetMapping("/{orderId}/invoice")
    public ResponseEntity<ApiResponse<List<Invoice>>> getInvoice(
            @AuthenticationPrincipal AuthenticatedUser user, @PathVariable int orderId) {
        return ResponseEntity.ok(ApiResponse.ok("Invoice generated successfully",
                orderService.generateInvoice(user.getUserId(), orderId)));
    }
}
