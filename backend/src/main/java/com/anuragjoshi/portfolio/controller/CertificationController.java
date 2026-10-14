package com.anuragjoshi.portfolio.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anuragjoshi.portfolio.dto.CertificationResponse;
import com.anuragjoshi.portfolio.service.CertificationService;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    @GetMapping
    public List<CertificationResponse> getCertifications() {
        return certificationService.getCertifications();
    }
}
