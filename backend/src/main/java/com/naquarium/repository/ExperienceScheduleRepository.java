package com.naquarium.repository;

import com.naquarium.entity.ExperienceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 체험 스케줄 레포지토리
 *
 * PerformanceScheduleRepository와 동일한 인터페이스 구조를 유지해
 * AdminService에서 타입별 분기 처리를 일관되게 수행할 수 있다.
 */
public interface ExperienceScheduleRepository extends JpaRepository<ExperienceSchedule, Long> {

    /** 특정 프로그램의 전체 스케줄 조회 */
    List<ExperienceSchedule> findByProgramId(Long programId);

    /** 날짜 범위 내 스케줄 조회 - 관리자 날짜 필터에 사용 */
    List<ExperienceSchedule> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    /** 특정 프로그램의 날짜 범위 내 스케줄 조회 (시작 시간 오름차순) - 프로그램 예매 모달용 */
    List<ExperienceSchedule> findByProgramIdAndStartTimeBetweenOrderByStartTimeAsc(Long programId, LocalDateTime start, LocalDateTime end);

    /** 날짜 범위 내 스케줄 수 집계 - 대시보드 이번 주 스케줄 카운트용 */
    long countByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
