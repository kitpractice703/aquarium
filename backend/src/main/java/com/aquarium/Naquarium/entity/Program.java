package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Enumerated(EnumType.STRING) // DB의 ENUM과 매핑
    @Column(columnDefinition = "ENUM('PERFORMANCE', 'EXPERIENCE')")
    private ProgramType type;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private int price;

    // 내부 Enum 정의 (공연 vs 체험)
    public enum ProgramType {
        PERFORMANCE, EXPERIENCE
    }
}