package com.anuragjoshi.portfolio.dto;

import com.anuragjoshi.portfolio.model.Skill;

public record SkillResponse(Long id, String name) {

    public static SkillResponse from(Skill skill) {
        return new SkillResponse(skill.getId(), skill.getName());
    }
}
