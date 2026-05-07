package com.naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * 공연 프로그램 일정 엔티티 (performance_schedules 테이블)
 *
 * 체험 일정(ExperienceSchedule)과 별도 테이블로 분리해
 * 도메인별 독립적인 스케줄 관리를 지원한다.
 *
 * isClosed: 관리자가 임시로 운영을 중단할 때 true로 설정한다.
 * 해당 스케줄의 예약 자체를 삭제하지 않고 플래그만 변경해
 * 기존 예약 데이터를 보존한다.
 */
@Entity
@Table(name = "performance_schedules")
@Getter @Setter
@NoArgsConstructor
public class PerformanceSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(nullable = false)
    private String location;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    /** 운영 중단 여부. true이면 예약 불가 (프론트에서 "closed" 상태로 표시) */
    @Column(name = "is_closed")
    private boolean isClosed = false;
}
