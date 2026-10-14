package com.anuragjoshi.portfolio.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.anuragjoshi.portfolio.repository.ProfileRepository;

/** NFR-8: a database outage is reported as a clear 503, not a silent failure. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DatabaseOutageTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProfileRepository profileRepository;

    @Test
    void databaseFailureReturns503WithAReadableDetail() throws Exception {
        when(profileRepository.findFirstByOrderByIdAsc())
                .thenThrow(new DataAccessResourceFailureException("Communications link failure"));

        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.detail").value("The database is unavailable right now. Please try again later."));
    }
}
