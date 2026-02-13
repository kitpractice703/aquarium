package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/** 프로그램(공연/체험) 데이터 접근 레포지토리 */
public interface ProgramRepository extends JpaRepository<Program, Long> {
    /** 프로그램 유형별 조회 */
    List<Program> findByType(Program.ProgramType type);
}
