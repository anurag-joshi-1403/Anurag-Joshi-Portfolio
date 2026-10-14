package com.anuragjoshi.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Validation messages are shown to the visitor next to the matching form field. */
public record ContactRequest(
        @NotBlank(message = "Please enter your name.")
        @Size(max = 100, message = "Please keep your name under 100 characters.")
        String name,

        @NotBlank(message = "Please enter your email address.")
        @Email(regexp = ".+@.+\\..+", message = "Please enter a valid email address.")
        @Size(max = 254, message = "Please enter a valid email address.")
        String email,

        @NotBlank(message = "Please enter a message.")
        @Size(max = 5000, message = "Please keep your message under 5,000 characters.")
        String message) {
}
