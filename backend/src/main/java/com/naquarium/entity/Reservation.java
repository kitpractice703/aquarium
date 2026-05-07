package com.naquarium.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * 예약 엔티티 (reservations 테이블)
 *
 * 입장권 예약과 프로그램(체험·공연) 예약을 단일 테이블로 관리한다.
 * - 입장권 예약: program = null, schedule = null, visitTime = "종일권"
 * - 프로그램 예약: program 참조 존재, 공연의 경우 schedule 참조 추가
 *
 * 연관 관계:
 *   User (N:1) - 예약자
 *   Program (N:1, nullable) - 예약된 프로그램 (입장권이면 null)
 *   PerformanceSchedule (N:1, nullable) - 공연 스케줄 (공연 예약 시에만 연결)
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

    /** LAZY: 예약 목록 조회 시 N+1 방지를 위해 Repository에서 fetch join 사용 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 입장권 예약 시 null, 프로그램 예약 시 해당 프로그램 참조 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = true)
    private Program program;

    /** 공연 예약 시에만 특정 스케줄을 연결한다. 체험 예약에서는 null */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = true)
    private PerformanceSchedule schedule;

    /** 방문 날짜 (YYYY-MM-DD). LocalDate 대신 String으로 저장해 포맷 변환 오버헤드를 줄인다 */
    @Column(name = "visit_date")
    private String visitDate;

    /** 입장권: "종일권" 고정 / 프로그램: "HH:mm" 형식 */
    @Column(name = "visit_time")
    private String visitTime;

    /** 입장권 예약의 성인 인원 수 (프로그램 예약에서는 총 인원) */
    private int adultCount;

    /** 입장권 예약의 청소년 인원 수 (프로그램 예약에서는 0) */
    private int teenCount;

    private int totalPrice;

    /** CONFIRMED: 예약 확정 / CANCELLED: 취소됨 */
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    public enum ReservationStatus {
        CONFIRMED, CANCELLED
    }

    /** 예약 생성 시각 자동 기록 (티켓 번호 생성에도 사용) */
    @CreationTimestamp
    @Column(name = "reserved_at")
    private LocalDateTime reservedAt;
}
