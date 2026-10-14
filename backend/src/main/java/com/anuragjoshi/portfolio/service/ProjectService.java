package com.anuragjoshi.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.anuragjoshi.portfolio.dto.ProjectResponse;
import com.anuragjoshi.portfolio.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects() {
        return projectRepository.findAllByOrderByFeaturedDescIdAsc().stream()
                .map(ProjectResponse::from)
                .toList();
    }
}
