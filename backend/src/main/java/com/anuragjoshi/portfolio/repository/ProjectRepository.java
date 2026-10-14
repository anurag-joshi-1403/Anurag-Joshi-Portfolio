package com.anuragjoshi.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anuragjoshi.portfolio.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    /** Featured projects first, then in the order they were added. */
    List<Project> findAllByOrderByFeaturedDescIdAsc();
}
