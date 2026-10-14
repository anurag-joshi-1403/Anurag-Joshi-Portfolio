package com.anuragjoshi.portfolio.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anuragjoshi.portfolio.dto.ContactRequest;
import com.anuragjoshi.portfolio.dto.ContactResponse;
import com.anuragjoshi.portfolio.service.ContactService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /** 200 only once the email has actually been handed to the mail server. */
    @PostMapping
    public ContactResponse submit(@Valid @RequestBody ContactRequest request) {
        contactService.submit(request);
        return new ContactResponse("Thanks for getting in touch. Your message has been sent.");
    }
}
