package com.anuragjoshi.portfolio.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anuragjoshi.portfolio.dto.ContactRequest;
import com.anuragjoshi.portfolio.dto.ContactResponse;
import com.anuragjoshi.portfolio.service.ContactRateLimiter;
import com.anuragjoshi.portfolio.service.ContactService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;
    private final ContactRateLimiter rateLimiter;

    public ContactController(ContactService contactService, ContactRateLimiter rateLimiter) {
        this.contactService = contactService;
        this.rateLimiter = rateLimiter;
    }

    /**
     * 200 only once the email has actually been handed to the mail server. Invalid requests are
     * rejected before this runs, so they don't count towards the rate limit.
     */
    @PostMapping
    public ContactResponse submit(@Valid @RequestBody ContactRequest request, HttpServletRequest httpRequest) {
        // Behind Render/Railway's proxy this is the visitor's IP (server.forward-headers-strategy).
        rateLimiter.acquire(httpRequest.getRemoteAddr());
        contactService.submit(request);
        return new ContactResponse("Thanks for getting in touch. Your message has been sent.");
    }
}
