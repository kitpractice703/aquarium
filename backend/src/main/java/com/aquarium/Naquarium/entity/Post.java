package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * 게시글 엔티티 (후기 + 자유게시판)
 * - Category 구분: REVIEW(후기), FREE(자유글)
 * - 후기 작성 시 rating(별점) 포함
 */
@Entity
@Table(name = "posts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    /** 작성자 (지연 로딩으로 필요 시에만 조회) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** 게시글 카테고리: REVIEW(관람 후기), FREE(자유글) */
    @Enumerated(EnumType.STRING)
    private Category category;

    /** 별점 (후기 전용, 1~5점) */
    private Double rating;

    /** 자동 생성 타임스탬프 */
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum Category {
        REVIEW, FREE
    }
}