package com.naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 프로그램 엔티티 (programs 테이블)
 *
 * 아쿠아리움에서 운영하는 체험·공연 프로그램을 관리한다.
 * 타입(ProgramType)에 따라 스케줄이 별도 테이블에 저장된다.
 * - PERFORMANCE → performance_schedules
 * - EXPERIENCE  → experience_schedules
 *
 * 스케줄 테이블을 분리한 이유:
 * 공연과 체험은 운영 방식과 예약 흐름이 달라
 * 단일 테이블보다 도메인별로 분리 관리하는 것이 확장에 유리하다.
 */
@Entity
@Table(name = "programs")
@Getter @Setter
@NoArgsConstructor
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * 프로그램 유형.
     * DB 컬럼을 ENUM 타입으로 제약해 잘못된 값 삽입을 방지한다.
     */
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PERFORMANCE', 'EXPERIENCE')")
    private ProgramType type;

    /** 인당 가격 (원). 입장권과 별도로 추가 결제된다 */
    @Column(nullable = false)
    private int price;

    public enum ProgramType {
        PERFORMANCE,    // 공연 - performance_schedules 참조
        EXPERIENCE      // 체험 - experience_schedules 참조
    }
}
