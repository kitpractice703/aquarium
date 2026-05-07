package com.naquarium.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * 게시글 엔티티 (posts 테이블)
 *
 * 현재는 후기(REVIEW) 카테고리만 사용한다.
 * 향후 자유게시판(FREE) 등 확장을 고려해 category 필드로 분류한다.
 * rating은 후기 전용 필드이므로 nullable로 선언한다.
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

    /** LAZY: 후기 목록 조회 시 N+1 방지를 위해 Repository에서 @EntityGraph 사용 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private Category category;

    /** 1 ~ 5 점 평점. 후기 외 카테고리에서는 null */
    private Double rating;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum Category {
        REVIEW,  // 관람 후기
        FREE     // 자유게시판 (현재 미사용)
    }
}
