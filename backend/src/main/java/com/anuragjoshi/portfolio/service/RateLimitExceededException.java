package com.anuragjoshi.portfolio.service;

import java.time.Duration;

/** A client has used up its contact-form allowance for the current window. */
public class RateLimitExceededException extends RuntimeException {

    private final Duration retryAfter;

    public RateLimitExceededException(Duration retryAfter) {
        super("Too many contact messages; retry after " + retryAfter);
        this.retryAfter = retryAfter;
    }

    public Duration getRetryAfter() {
        return retryAfter;
    }
}
