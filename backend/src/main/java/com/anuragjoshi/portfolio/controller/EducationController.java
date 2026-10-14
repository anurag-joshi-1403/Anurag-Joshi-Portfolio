package com.anuragjoshi.portfolio.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anuragjoshi.portfolio.dto.EducationResponse;
import com.anuragjoshi.portfolio.service.EducationService;

@RestController
@RequestMapping("/api/education")
public class EducationController {

    private final EducationService educationService;

    public EducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    @GetMapping
    public List<EducationResponse> getEducation() {
        return educationService.getEducation();
    }
}
