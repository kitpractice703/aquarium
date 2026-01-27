package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor // Builder 패턴을 위해 필요
@Builder            // 나중에 객체 생성할 때 아주 편합니다
public class Reservation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long id;

    // [수정 1] fetch = FetchType.LAZY 추가 (성능 최적화)
    // 즉시 로딩(EAGER)은 불필요한 조인을 유발하므로 지연 로딩(LAZY) 권장
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private ProgramSchedule schedule;

    // [수정 2] columnDefinition 제거 (JPA 표준 사용)
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @CreationTimestamp
    @Column(name = "reserved_at")
    private LocalDateTime reservedAt; // 변수명 reservedAt 유지 (좋습니다!)

    public enum ReservationStatus {
        CONFIRMED, CANCELLED
    }
}