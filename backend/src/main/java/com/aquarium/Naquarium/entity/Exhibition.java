package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 테마 전시 엔티티
 * - 아쿠아리움의 각 전시관(빛의 바다, 균형의 바다 등) 정보를 관리
 * - 프론트엔드 ThemeSection 컴포넌트에서 사용
 */
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

    /** 전시관 상세 설명 (TEXT 타입으로 긴 내용 허용) */
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    /** 전시관별 고유 테마 색상 (HEX 코드) */
    @Column(name = "theme_color")
    private String themeColor;
}