package com.anuragjoshi.portfolio.dto;

import java.util.Arrays;
import java.util.List;

import com.anuragjoshi.portfolio.model.Project;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        String problem,
        List<String> techStack,
        String imageUrl,
        String githubUrl,
        String liveUrl,
        boolean featured) {

    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getProblem(),
                splitTechStack(project.getTechStack()),
                project.getImageUrl(),
                project.getGithubUrl(),
                project.getLiveUrl(),
                project.isFeatured());
    }

    private static List<String> splitTechStack(String techStack) {
        return Arrays.stream(techStack.split(","))
                .map(String::strip)
                .filter(item -> !item.isEmpty())
                .toList();
    }
}
