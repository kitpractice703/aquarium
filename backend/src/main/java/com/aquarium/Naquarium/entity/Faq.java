// Faq.java
package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "faqs")
@Getter @Setter
@NoArgsConstructor
public class Faq {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faq_id")
    private Long id;

    private String question;
    @Column(columnDefinition = "TEXT")
    private String answer;
}