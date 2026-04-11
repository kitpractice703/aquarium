package com.naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/** 공연 프로그램 일정 엔티티 */
@Entity
@Table(name = "performance_schedules")
@Getter @Setter
@NoArgsConstructor
public class PerformanceSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(nullable = false)
    private String location;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    /** 마감 여부 (기본값: false) */
    @Column(name = "is_closed")
    private Boolean isClosed = false;
}
