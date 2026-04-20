package com.naquarium.entity;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = true)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = true)
    private PerformanceSchedule schedule;

    @Column(name = "visit_date")
    private String visitDate;

    @Column(name = "visit_time")
    private String visitTime;

    private int adultCount;
    private int teenCount;
    private int totalPrice;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    public enum ReservationStatus {
        CONFIRMED, CANCELLED
    }

    @CreationTimestamp
    @Column(name = "reserved_at")
    private LocalDateTime reservedAt;


}