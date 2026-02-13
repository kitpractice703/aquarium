package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.PerformanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

/** 공연 프로그램 스케줄 데이터 접근 레포지토리 */
public interface PerformanceScheduleRepository extends JpaRepository<PerformanceSchedule, Long> {

    /** 특정 공연 프로그램의 전체 일정 조회 */
    List<PerformanceSchedule> findByProgramId(Long programId);

    /** 날짜 범위로 일정 조회 (캘린더, 홈 화면 스케줄 표시에 사용) */
    List<PerformanceSchedule> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    /** 특정 프로그램의 날짜별 일정 조회 */
    List<PerformanceSchedule> findByProgramIdAndStartTimeBetween(Long programId, LocalDateTime start, LocalDateTime end);
}
