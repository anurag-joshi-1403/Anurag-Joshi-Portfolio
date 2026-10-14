package com.anuragjoshi.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anuragjoshi.portfolio.model.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
