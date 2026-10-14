package com.anuragjoshi.portfolio.service;

/** The contact message was saved but could not be emailed to the owner. */
public class ContactDeliveryException extends RuntimeException {

    public ContactDeliveryException(String message) {
        super(message);
    }

    public ContactDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
