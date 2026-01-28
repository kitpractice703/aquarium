package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // [수정] 일반 입장권 예매일 수 있으므로 nullable = true로 변경
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = true)
    private ProgramSchedule schedule;

    // [추가] 방문 날짜 (예: "2026-01-28")
    @Column(name = "visit_date")
    private String visitDate;

    // [추가] 방문 시간 (예: "14:00")
    @Column(name = "visit_time")
    private String visitTime;

    // [추가] 인원 수 & 금액
    private int adultCount;
    private int teenCount;
    private int totalPrice;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @CreationTimestamp
    @Column(name = "reserved_at")
    private LocalDateTime reservedAt;

    public enum ReservationStatus {
        CONFIRMED, CANCELLED
    }
}