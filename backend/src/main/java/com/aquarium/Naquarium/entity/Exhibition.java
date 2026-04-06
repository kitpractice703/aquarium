package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 테마 전시관 엔티티 */
@Entity
@Table(name = "exhibitions")
@Getter @Setter
@NoArgsConstructor
public class Exhibition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exhibition_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "sub_title")
    private String subTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    /** 전시관별 고유 테마 색상 (HEX 코드) */
    @Column(name = "theme_color")
    private String themeColor;
}