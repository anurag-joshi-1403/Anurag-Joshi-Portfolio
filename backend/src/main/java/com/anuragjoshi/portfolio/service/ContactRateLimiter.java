package com.anuragjoshi.portfolio.service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Caps contact-form sends per client (IP address) in a fixed time window, so the public form
 * can't be used to flood the owner's inbox. In memory: limits reset when the app restarts,
 * which is fine for a single-instance portfolio.
 */
@Component
public class ContactRateLimiter {

    /** Above this many tracked clients, expired windows are swept out to bound memory. */
    private static final int SWEEP_THRESHOLD = 10_000;

    private final int maxRequests;
    private final Duration window;
    private final Clock clock;
    private final ConcurrentMap<String, Window> windows = new ConcurrentHashMap<>();

    @Autowired
    public ContactRateLimiter(
            @Value("${app.contact.rate-limit.max-requests:5}") int maxRequests,
            @Value("${app.contact.rate-limit.window:PT1H}") Duration window) {
        this(maxRequests, window, Clock.systemUTC());
    }

    ContactRateLimiter(int maxRequests, Duration window, Clock clock) {
        this.maxRequests = maxRequests;
        this.window = window;
        this.clock = clock;
    }

    /**
     * Counts one send from {@code client}.
     *
     * @throws RateLimitExceededException if the client has already used its allowance in the current window
     */
    public void acquire(String client) {
        Instant now = clock.instant();
        Window current = windows.compute(client, (key, existing) ->
                existing == null || existing.hasEnded(now, window)
                        ? new Window(now, 1)
                        : new Window(existing.start(), existing.count() + 1));

        if (windows.size() > SWEEP_THRESHOLD) {
            windows.values().removeIf(entry -> entry.hasEnded(now, window));
        }
        if (current.count() > maxRequests) {
            throw new RateLimitExceededException(Duration.between(now, current.start().plus(window)));
        }
    }

    private record Window(Instant start, int count) {

        boolean hasEnded(Instant now, Duration length) {
            return !now.isBefore(start.plus(length));
        }
    }
}
