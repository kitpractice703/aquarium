package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.Exhibition;
import org.springframework.data.jpa.repository.JpaRepository;

/** 전시관 데이터 접근 레포지토리 */
public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {}