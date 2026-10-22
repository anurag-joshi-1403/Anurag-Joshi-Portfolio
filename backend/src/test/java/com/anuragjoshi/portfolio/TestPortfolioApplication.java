package com.anuragjoshi.portfolio;

import org.springframework.boot.SpringApplication;

/**
 * Runs the API locally without MySQL or mail credentials: {@code mvn spring-boot:test-run}.
 * Uses the "test" profile, so data lives in an in-memory H2 database seeded by the same
 * Flyway migrations as production. Contact-form emails fail (no SMTP credentials), which
 * exercises the site's error message.
 */
public class TestPortfolioApplication {

    public static void main(String[] args) {
        SpringApplication.from(PortfolioApplication::main)
                .withAdditionalProfiles("test")
                .run(args);
    }
}
