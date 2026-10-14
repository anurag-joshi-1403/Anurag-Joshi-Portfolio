package com.anuragjoshi.portfolio.dto;

import com.anuragjoshi.portfolio.model.Profile;

/** Nullable fields (email, links, etc.) are details the owner hasn't supplied yet. */
public record ProfileResponse(
        String name,
        String title,
        String tagline,
        String bio,
        String interests,
        String objective,
        String location,
        String email,
        String resumeUrl,
        String githubUrl,
        String linkedinUrl) {

    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getName(),
                profile.getTitle(),
                profile.getTagline(),
                profile.getBio(),
                profile.getInterests(),
                profile.getObjective(),
                profile.getLocation(),
                profile.getEmail(),
                profile.getResumeUrl(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl());
    }
}
