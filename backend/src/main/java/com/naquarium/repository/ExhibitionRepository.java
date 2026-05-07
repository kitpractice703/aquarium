package com.naquarium.repository;

import com.naquarium.entity.Exhibition;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 전시 레포지토리
 *
 * 별도 커스텀 쿼리 없이 JpaRepository의 기본 CRUD를 사용한다.
 * 전시 데이터는 관리자가 직접 관리하며, 전체 조회(findAll)가 주로 사용된다.
 */
public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {}
