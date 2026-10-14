package com.anuragjoshi.portfolio.dto;

import java.time.LocalDate;

import com.anuragjoshi.portfolio.model.Certification;

public record CertificationResponse(Long id, String name, String issuer, LocalDate date, String verifyUrl) {

    public static CertificationResponse from(Certification certification) {
        return new CertificationResponse(
                certification.getId(),
                certification.getName(),
                certification.getIssuer(),
                certification.getIssueDate(),
                certification.getVerifyUrl());
    }
}
