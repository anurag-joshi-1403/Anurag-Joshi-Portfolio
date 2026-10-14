package com.anuragjoshi.portfolio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String problem;

    /** Comma-separated in the database; the API returns it as a list. */
    private String techStack;

    private String imageUrl;
    private String githubUrl;
    private String liveUrl;
    private boolean featured;

    protected Project() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getProblem() {
        return problem;
    }

    public String getTechStack() {
        return techStack;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getLiveUrl() {
        return liveUrl;
    }

    public boolean isFeatured() {
        return featured;
    }
}
