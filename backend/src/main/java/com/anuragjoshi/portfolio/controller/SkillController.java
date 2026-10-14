package com.anuragjoshi.portfolio.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anuragjoshi.portfolio.dto.SkillGroupResponse;
import com.anuragjoshi.portfolio.service.SkillService;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public List<SkillGroupResponse> getSkills() {
        return skillService.getSkillsByCategory();
    }
}
