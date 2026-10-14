package com.anuragjoshi.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anuragjoshi.portfolio.model.Certification;

public interface CertificationRepository extends JpaRepository<Certification, Long> {

    List<Certification> findAllByOrderByIssueDateDescIdAsc();
}
