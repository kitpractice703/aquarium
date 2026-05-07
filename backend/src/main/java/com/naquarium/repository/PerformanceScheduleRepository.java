package com.naquarium.repository;

import com.naquarium.entity.PerformanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 공연 스케줄 레포지토리
 *
 * 날짜 범위 조회와 프로그램 ID 필터를 조합한 메서드를 제공한다.
 * ExperienceScheduleRepository와 동일한 인터페이스 구조를 유지해 서비스 레이어 분기 처리를 단순화한다.
 */
public interface PerformanceScheduleRepository extends JpaRepository<PerformanceSchedule, Long> {

    /** 특정 프로그램의 전체 스케줄 조회 */
    List<PerformanceSchedule> findByProgramId(Long programId);

    /** 날짜 범위 내 스케줄 조회 (시작 시간 오름차순) - 홈 화면 및 관리자 날짜 필터에 사용 */
    List<PerformanceSchedule> findByStartTimeBetweenOrderByStartTimeAsc(LocalDateTime start, LocalDateTime end);

    /** 특정 프로그램의 날짜 범위 내 스케줄 조회 (시작 시간 오름차순) - 프로그램 예매 모달용 */
    List<PerformanceSchedule> findByProgramIdAndStartTimeBetweenOrderByStartTimeAsc(Long programId, LocalDateTime start, LocalDateTime end);

    /** 날짜 범위 내 스케줄 수 집계 - 대시보드 이번 주 스케줄 카운트용 */
    long countByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
