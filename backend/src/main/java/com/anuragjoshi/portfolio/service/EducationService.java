package com.anuragjoshi.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.anuragjoshi.portfolio.dto.EducationResponse;
import com.anuragjoshi.portfolio.repository.EducationRepository;

@Service
public class EducationService {

    private final EducationRepository educationRepository;

    public EducationService(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    @Transactional(readOnly = true)
    public List<EducationResponse> getEducation() {
        return educationRepository.findAllByOrderByStartYearDescIdAsc().stream()
                .map(EducationResponse::from)
                .toList();
    }
}
