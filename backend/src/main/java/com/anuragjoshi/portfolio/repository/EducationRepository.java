package com.anuragjoshi.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anuragjoshi.portfolio.model.Education;

public interface EducationRepository extends JpaRepository<Education, Long> {

    List<Education> findAllByOrderByStartYearDescIdAsc();
}
