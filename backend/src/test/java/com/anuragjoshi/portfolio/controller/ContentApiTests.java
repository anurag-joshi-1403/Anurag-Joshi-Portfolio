package com.anuragjoshi.portfolio.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/** The GET endpoints, served from the seed data in V2__seed_initial_content.sql. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContentApiTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void profileReturnsTheOwnerWithPendingLinksAsNull() throws Exception {
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Anurag Joshi"))
                .andExpect(jsonPath("$.title").value("Java Full-Stack Developer"))
                .andExpect(jsonPath("$.bio").isNotEmpty())
                .andExpect(jsonPath("$.githubUrl").value("https://github.com/anurag-joshi-1403"))
                .andExpect(jsonPath("$.resumeUrl").value(nullValue()))
                .andExpect(jsonPath("$.id").doesNotExist());
    }

    @Test
    void skillsAreGroupedInTheFixedCategoryOrder() throws Exception {
        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].category").value(contains("Languages", "Backend", "Frontend", "Databases", "Tools")))
                .andExpect(jsonPath("$[0].skills[0].name").value("Java"))
                .andExpect(jsonPath("$[1].skills[*].name").value(hasItem("Spring Boot")));
    }

    @Test
    void projectsListFeaturedFirstWithTechStackAsAList() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Multi-Agent AI Platform"))
                .andExpect(jsonPath("$[0].featured").value(true))
                .andExpect(jsonPath("$[1].name").value("Student Management System"))
                .andExpect(jsonPath("$[2].name").value("SocialSync"))
                .andExpect(jsonPath("$[2].featured").value(true))
                .andExpect(jsonPath("$[2].liveUrl").value("https://social-sync-webapp.vercel.app"))
                .andExpect(jsonPath("$[3].featured").value(false))
                .andExpect(jsonPath("$[0].techStack[0]").value("Java"))
                .andExpect(jsonPath("$[0].techStack[1]").value("Spring Boot"));
    }

    @Test
    void educationReturnsTheDegreeWithRealDates() throws Exception {
        mockMvc.perform(get("/api/education"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].institution").value("Babu Banarasi Das University, Lucknow"))
                .andExpect(jsonPath("$[0].degree").value("B.Tech"))
                .andExpect(jsonPath("$[0].startYear").value(2023))
                .andExpect(jsonPath("$[0].endYear").value(2027));
    }

    @Test
    void certificationsReturnTheGrastechJavaTraining() throws Exception {
        mockMvc.perform(get("/api/certifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].issuer").value("GRAStech, BBD Campus, Lucknow"))
                .andExpect(jsonPath("$[0].date").value("2026-08-05"))
                .andExpect(jsonPath("$[0].verifyUrl").value(nullValue()));
    }
}
