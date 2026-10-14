package com.anuragjoshi.portfolio.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.anuragjoshi.portfolio.model.ContactMessage;
import com.anuragjoshi.portfolio.repository.ContactMessageRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactApiTests {

    private static final String VALID_REQUEST = """
            {"name": "Priya Sharma", "email": "priya@example.com", "message": "Hi Anurag, are you open to a freelance project?"}
            """;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @MockitoBean
    private JavaMailSender mailSender;

    @BeforeEach
    void clearMessages() {
        contactMessageRepository.deleteAll();
    }

    @Test
    void validMessageIsSavedAndEmailedToTheOwner() throws Exception {
        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALID_REQUEST))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").isNotEmpty());

        ArgumentCaptor<SimpleMailMessage> sent = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(sent.capture());
        SimpleMailMessage email = sent.getValue();
        assertThat(email.getTo()).containsExactly("owner@example.test");
        assertThat(email.getFrom()).isEqualTo("portfolio@example.test");
        assertThat(email.getReplyTo()).isEqualTo("priya@example.com");
        assertThat(email.getSubject()).isEqualTo("Portfolio contact from Priya Sharma");
        assertThat(email.getText()).contains("are you open to a freelance project?");

        assertThat(contactMessageRepository.findAll())
                .singleElement()
                .extracting(ContactMessage::getEmail)
                .isEqualTo("priya@example.com");
    }

    @Test
    void invalidFieldsReturn400WithAMessagePerFieldAndSendNothing() throws Exception {
        String invalid = """
                {"name": "  ", "email": "not-an-email", "message": ""}
                """;

        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(invalid))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.errors.name").value("Please enter your name."))
                .andExpect(jsonPath("$.errors.email").value("Please enter a valid email address."))
                .andExpect(jsonPath("$.errors.message").value("Please enter a message."));

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        assertThat(contactMessageRepository.count()).isZero();
    }

    @Test
    void malformedJsonReturns400() throws Exception {
        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content("{not json"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    void mailFailureReturns503ButKeepsTheMessage() throws Exception {
        doThrow(new MailSendException("SMTP server unreachable")).when(mailSender).send(any(SimpleMailMessage.class));

        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALID_REQUEST))
                .andExpect(status().isServiceUnavailable())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.detail").value("Your message couldn't be sent right now."));

        assertThat(contactMessageRepository.count()).isEqualTo(1);
    }

    @Test
    void lineBreaksInTheNameCannotReachTheSubjectHeader() throws Exception {
        String request = """
                {"name": "Eve\\r\\nBcc: victim@example.com", "email": "eve@example.com", "message": "Hello"}
                """;

        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk());

        ArgumentCaptor<SimpleMailMessage> sent = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(sent.capture());
        assertThat(sent.getValue().getSubject()).isEqualTo("Portfolio contact from Eve Bcc: victim@example.com");
    }
}
