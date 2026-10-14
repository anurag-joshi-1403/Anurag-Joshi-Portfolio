package com.anuragjoshi.portfolio.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.anuragjoshi.portfolio.dto.ProfileResponse;
import com.anuragjoshi.portfolio.repository.ProfileRepository;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile() {
        return profileRepository.findFirstByOrderByIdAsc()
                .map(ProfileResponse::from)
                .orElseThrow(() -> new ContentNotFoundException("No profile has been added yet."));
    }
}
