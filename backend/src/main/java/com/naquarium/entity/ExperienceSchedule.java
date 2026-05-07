package com.naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * 체험 프로그램 일정 엔티티 (experience_schedules 테이블)
 *
 * PerformanceSchedule과 동일한 구조를 가지며 별도 테이블로 분리 관리된다.
 * AdminService에서 프로그램 타입에 따라 두 레포지토리를 분기 호출한다.
 *
 * isClosed: 관리자가 임시로 운영을 중단할 때 true로 설정한다.
 */
@Entity
@Table(name = "experience_schedules")
@Getter @Setter
@NoArgsConstructor
public class ExperienceSchedule {

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
