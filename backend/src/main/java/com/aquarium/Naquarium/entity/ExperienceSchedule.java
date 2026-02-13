package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * 체험 프로그램 일정 엔티티
 * - 체험 프로그램(VR 체험, 먹이주기 등)의 시간대별 일정 관리
 * - isClosed: 해당 회차 마감 여부
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

    /** 연결된 체험 프로그램 (N:1 관계) */
    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(nullable = false)
    private String location;

    /** 체험 시작 시각 */
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    /** 마감 여부 (기본값: false) */
    @Column(name = "is_closed")
    private Boolean isClosed = false;
}
