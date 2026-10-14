package com.anuragjoshi.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anuragjoshi.portfolio.model.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByOrderByIdAsc();
}
