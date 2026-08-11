package com.shopping.models;

public class Payments {
    private int paymentId;
    private int ordersId;
    private String paymentMode;
    private String paymentStatus;

    public Payments() {
    }

    public Payments(int paymentId, int ordersId, String paymentMode, String paymentStatus) {
        this.paymentId = paymentId;
        this.ordersId = ordersId;
        this.paymentMode = paymentMode;
        this.paymentStatus = paymentStatus;
    }

    public int getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(int paymentId) {
        this.paymentId = paymentId;
    }

    public int getOrdersId() {
        return ordersId;
    }

    public void setOrdersId(int ordersId) {
        this.ordersId = ordersId;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    @Override
    public String toString() {
        return "Payments [paymentId=" + paymentId + ", ordersId=" + ordersId + ", paymentMode=" + paymentMode
                + ", paymentStatus=" + paymentStatus + "]";
    }
}
