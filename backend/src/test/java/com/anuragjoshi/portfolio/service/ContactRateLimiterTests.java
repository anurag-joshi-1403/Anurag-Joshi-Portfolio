package com.anuragjoshi.portfolio.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.assertj.core.api.Assertions.catchThrowableOfType;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

class ContactRateLimiterTests {

    private static final Duration WINDOW = Duration.ofHours(1);

    private final MutableClock clock = new MutableClock(Instant.parse("2026-10-15T10:00:00Z"));
    private final ContactRateLimiter limiter = new ContactRateLimiter(2, WINDOW, clock);

    @Test
    void allowsUpToTheLimitThenRejectsWithTheTimeLeftInTheWindow() {
        limiter.acquire("203.0.113.7");
        clock.advance(Duration.ofMinutes(20));
        limiter.acquire("203.0.113.7");

        RateLimitExceededException rejected = catchThrowableOfType(
                RateLimitExceededException.class, () -> limiter.acquire("203.0.113.7"));

        assertThat(rejected).isNotNull();
        assertThat(rejected.getRetryAfter()).isEqualTo(Duration.ofMinutes(40));
    }

    @Test
    void startsAFreshWindowOnceTheOldOneEnds() {
        limiter.acquire("203.0.113.7");
        limiter.acquire("203.0.113.7");

        clock.advance(WINDOW);

        assertThatNoException().isThrownBy(() -> limiter.acquire("203.0.113.7"));
    }

    @Test
    void countsEachClientSeparately() {
        limiter.acquire("203.0.113.7");
        limiter.acquire("203.0.113.7");

        assertThatNoException().isThrownBy(() -> limiter.acquire("198.51.100.23"));
    }

    /** A clock the test can move forward. */
    private static final class MutableClock extends Clock {

        private Instant now;

        MutableClock(Instant start) {
            this.now = start;
        }

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public Instant instant() {
            return now;
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }
    }
}
