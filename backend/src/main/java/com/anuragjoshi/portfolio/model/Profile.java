package com.anuragjoshi.portfolio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/** The site owner's details. The API serves the first row; drives Hero, About, and Contact. */
@Entity
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title;
    private String tagline;
    private String bio;
    private String interests;
    private String objective;
    private String location;
    private String email;
    private String resumeUrl;
    private String githubUrl;
    private String linkedinUrl;

    protected Profile() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTitle() {
        return title;
    }

    public String getTagline() {
        return tagline;
    }

    public String getBio() {
        return bio;
    }

    public String getInterests() {
        return interests;
    }

    public String getObjective() {
        return objective;
    }

    public String getLocation() {
        return location;
    }

    public String getEmail() {
        return email;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }
}
