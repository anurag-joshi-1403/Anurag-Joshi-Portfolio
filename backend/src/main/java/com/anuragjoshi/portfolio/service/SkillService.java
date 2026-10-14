package com.anuragjoshi.portfolio.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.anuragjoshi.portfolio.dto.SkillGroupResponse;
import com.anuragjoshi.portfolio.dto.SkillResponse;
import com.anuragjoshi.portfolio.model.Skill;
import com.anuragjoshi.portfolio.repository.SkillRepository;

@Service
public class SkillService {

    /** FR-SKILLS-1 display order. Any other category is listed after these, alphabetically. */
    private static final List<String> CATEGORY_ORDER = List.of("Languages", "Backend", "Frontend", "Databases", "Tools");

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillGroupResponse> getSkillsByCategory() {
        Map<String, List<SkillResponse>> skillsByCategory = new LinkedHashMap<>();
        for (Skill skill : skillRepository.findAllByOrderByIdAsc()) {
            skillsByCategory.computeIfAbsent(skill.getCategory(), category -> new ArrayList<>())
                    .add(SkillResponse.from(skill));
        }

        return skillsByCategory.entrySet().stream()
                .map(entry -> new SkillGroupResponse(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingInt((SkillGroupResponse group) -> categoryRank(group.category()))
                        .thenComparing(SkillGroupResponse::category))
                .toList();
    }

    private static int categoryRank(String category) {
        int rank = CATEGORY_ORDER.indexOf(category);
        return rank >= 0 ? rank : CATEGORY_ORDER.size();
    }
}
