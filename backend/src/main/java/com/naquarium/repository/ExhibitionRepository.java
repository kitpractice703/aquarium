package com.naquarium.repository;

import com.naquarium.entity.Exhibition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {}