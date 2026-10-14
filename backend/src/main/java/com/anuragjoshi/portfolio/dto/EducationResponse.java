package com.anuragjoshi.portfolio.dto;

import com.anuragjoshi.portfolio.model.Education;

public record EducationResponse(
        Long id,
        String institution,
        String degree,
        String field,
        Integer startYear,
        Integer endYear,
        String notes) {

    public static EducationResponse from(Education education) {
        return new EducationResponse(
                education.getId(),
                education.getInstitution(),
                education.getDegree(),
                education.getField(),
                education.getStartYear(),
                education.getEndYear(),
                education.getNotes());
    }
}
