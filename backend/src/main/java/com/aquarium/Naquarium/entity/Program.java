package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 프로그램 엔티티 (공연/체험)
 * - PERFORMANCE: 공연 프로그램 (돌고래쇼 등)
 * - EXPERIENCE: 체험 프로그램 (VR, 먹이주기 등)
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

    /** 프로그램 유형: PERFORMANCE(공연), EXPERIENCE(체험) */
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PERFORMANCE', 'EXPERIENCE')")
    private ProgramType type;

    @Column(name = "image_url")
    private String imageUrl;

    /** 1인당 프로그램 가격 (원) */
    @Column(nullable = false)
    private int price;

    public enum ProgramType {
        PERFORMANCE, EXPERIENCE
    }
}