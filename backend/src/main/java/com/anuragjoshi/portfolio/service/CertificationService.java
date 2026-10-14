package com.anuragjoshi.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.anuragjoshi.portfolio.dto.CertificationResponse;
import com.anuragjoshi.portfolio.repository.CertificationRepository;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public CertificationService(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    @Transactional(readOnly = true)
    public List<CertificationResponse> getCertifications() {
        return certificationRepository.findAllByOrderByIssueDateDescIdAsc().stream()
                .map(CertificationResponse::from)
                .toList();
    }
}
