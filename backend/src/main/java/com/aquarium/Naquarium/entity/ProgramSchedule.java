package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * 프로그램 일정 엔티티
 * - 특정 프로그램의 시간대별 일정 관리
 * - isClosed: 해당 회차 마감 여부
 */
@Entity
@Table(name = "program_schedules")
@Getter @Setter
@NoArgsConstructor
public class ProgramSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;

    /** 연결된 프로그램 (N:1 관계) */
    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(nullable = false)
    private String location;

    /** 프로그램 시작 시각 */
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    /** 마감 여부 (기본값: false) */
    @Column(name = "is_closed")
    private Boolean isClosed = false;
}