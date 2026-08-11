package com.shopping.dto;

import jakarta.validation.constraints.Min;

public class CartUpdateRequest {

    @Min(value = 1, message = "Cart quantity must be greater than zero")
    private int quantity;

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
