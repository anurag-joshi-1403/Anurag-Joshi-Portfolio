package com.anuragjoshi.portfolio.service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.anuragjoshi.portfolio.dto.ContactRequest;
import com.anuragjoshi.portfolio.model.ContactMessage;
import com.anuragjoshi.portfolio.repository.ContactMessageRepository;

/**
 * FR-CONTACT-2: stores each submission, then emails it to the owner with the visitor as Reply-To.
 * The message is saved first, so a mail outage never loses it.
 */
@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);
    private static final DateTimeFormatter SENT_AT_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender mailSender;
    private final String recipient;
    private final String sender;

    public ContactService(
            ContactMessageRepository contactMessageRepository,
            JavaMailSender mailSender,
            @Value("${app.contact.recipient}") String recipient,
            @Value("${spring.mail.username:}") String sender) {
        this.contactMessageRepository = contactMessageRepository;
        this.mailSender = mailSender;
        this.recipient = recipient;
        this.sender = sender;
    }

    public void submit(ContactRequest request) {
        ContactMessage saved = contactMessageRepository.save(new ContactMessage(
                request.name().strip(),
                request.email().strip(),
                request.message().strip(),
                LocalDateTime.now(ZoneOffset.UTC)));

        if (recipient.isBlank()) {
            log.error("CONTACT_RECIPIENT is not set, so contact message {} was saved but not emailed", saved.getId());
            throw new ContactDeliveryException("The contact form isn't fully set up yet.");
        }

        try {
            mailSender.send(buildEmail(saved));
        } catch (MailException ex) {
            log.error("Contact message {} was saved but could not be emailed", saved.getId(), ex);
            throw new ContactDeliveryException("Your message couldn't be sent right now.", ex);
        }
    }

    private SimpleMailMessage buildEmail(ContactMessage contact) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipient);
        if (!sender.isBlank()) {
            email.setFrom(sender);
        }
        email.setReplyTo(contact.getEmail());
        // The name is free text: keep it on one line so it can't break the Subject header.
        email.setSubject("Portfolio contact from " + contact.getName().replaceAll("[\\r\\n]+", " "));
        email.setText("""
                New message from your portfolio contact form.

                Name:  %s
                Email: %s
                Sent:  %s UTC

                %s
                """.formatted(
                contact.getName(),
                contact.getEmail(),
                contact.getSubmittedAt().format(SENT_AT_FORMAT),
                contact.getMessage()));
        return email;
    }
}
