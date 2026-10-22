package com.anuragjoshi.portfolio.controller;

import static org.hamcrest.Matchers.matchesRegex;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/** The contact form's per-visitor limit, end to end. The limit is lowered to 2 for the test. */
@SpringBootTest(properties = "app.contact.rate-limit.max-requests=2")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactRateLimitTests {

    private static final String VALID_REQUEST = """
            {"name": "Priya Sharma", "email": "priya@example.com", "message": "Hello"}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JavaMailSender mailSender;

    private static MockHttpServletRequestBuilder contactFrom(String ip, String body) {
        return post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .with(request -> {
                    request.setRemoteAddr(ip);
                    return request;
                });
    }

    @Test
    void blocksAVisitorPastTheLimitWithA429AndRetryAfter() throws Exception {
        mockMvc.perform(contactFrom("203.0.113.7", VALID_REQUEST)).andExpect(status().isOk());
        mockMvc.perform(contactFrom("203.0.113.7", VALID_REQUEST)).andExpect(status().isOk());

        mockMvc.perform(contactFrom("203.0.113.7", VALID_REQUEST))
                .andExpect(status().isTooManyRequests())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                // About an hour, rounded up; allows for the milliseconds the three requests take.
                .andExpect(header().string(HttpHeaders.RETRY_AFTER, matchesRegex("^(35\\d\\d|3600)$")))
                .andExpect(jsonPath("$.detail")
                        .value("You've sent several messages in a short time. Please try again in 60 minutes."));

        // The blocked request never reached the mail server.
        verify(mailSender, times(2)).send(any(SimpleMailMessage.class));
    }

    @Test
    void doesNotCountInvalidRequestsOrOtherVisitors() throws Exception {
        String invalid = """
                {"name": "", "email": "nope", "message": ""}
                """;
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(contactFrom("198.51.100.23", invalid)).andExpect(status().isBadRequest());
        }

        mockMvc.perform(contactFrom("198.51.100.23", VALID_REQUEST)).andExpect(status().isOk());
        mockMvc.perform(contactFrom("192.0.2.44", VALID_REQUEST)).andExpect(status().isOk());
    }
}
