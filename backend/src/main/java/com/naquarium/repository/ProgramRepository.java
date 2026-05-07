package com.naquarium.repository;

import com.naquarium.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 프로그램 레포지토리
 *
 * 타입(PERFORMANCE / EXPERIENCE)별 조회를 지원한다.
 * 스케줄 관리 시 타입에 따라 적절한 스케줄 테이블을 선택하는 데 활용된다.
 */
public interface ProgramRepository extends JpaRepository<Program, Long> {

    /**
     * 타입별 프로그램 목록 조회.
     * @param type PERFORMANCE | EXPERIENCE
     */
    List<Program> findByType(Program.ProgramType type);
}
