package com.anuragjoshi.portfolio.dto;

import java.util.List;

public record SkillGroupResponse(String category, List<SkillResponse> skills) {
}
