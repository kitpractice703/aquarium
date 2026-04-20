package com.naquarium.entity;

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

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PERFORMANCE', 'EXPERIENCE')")
    private ProgramType type;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private int price;

    public enum ProgramType {
        PERFORMANCE, EXPERIENCE
    }
}