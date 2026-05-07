package com.naquarium.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 전시 엔티티 (exhibitions 테이블)
 *
 * 홈 화면 테마 섹션에 표시되는 전시 정보를 관리한다.
 * 관리자가 제목·소개·테마 색상을 수정할 수 있다.
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

    /** 부제목 - 선택 입력 */
    @Column(name = "sub_title")
    private String subTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** 전시 대표 색상 (CSS hex 코드, 예: #ffdd57) */
    @Column(name = "theme_color")
    private String themeColor;
}
