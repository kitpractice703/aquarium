package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * 예약 엔티티
 * - 입장권: program, schedule 모두 null
 * - 체험 프로그램: program만 존재, schedule은 null
 * - 공연 프로그램: program과 schedule 모두 존재
 */
@Entity
@Table(name = "reservations")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long id;

    /** 예약한 사용자 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 예약된 프로그램 (체험/공연 모두, 입장권만일 경우 null) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = true)
    private Program program;

    /** 공연 스케줄 (공연 예약 시 사용, 입장권/체험은 null) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = true)
    private PerformanceSchedule schedule;

    @Column(name = "visit_date")
    private String visitDate;

    @Column(name = "visit_time")
    private String visitTime;

    /** 대인(만 13세 이상) 인원수 */
    private int adultCount;
    /** 소인(만 12세 이하) 인원수 */
    private int teenCount;
    /** 최종 결제 금액 (원) */
    private int totalPrice;

    /** 예약 상태: CONFIRMED(확정), CANCELLED(취소) */
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @CreationTimestamp
    @Column(name = "reserved_at")
    private LocalDateTime reservedAt;

    public enum ReservationStatus {
        CONFIRMED, CANCELLED
    }
}