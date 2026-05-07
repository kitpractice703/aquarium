package com.naquarium.dto;

import com.naquarium.entity.Post;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

/**
 * 후기 조회 응답 DTO (공개·관리자 공용)
 *
 * Post 엔티티를 홈 화면 커뮤니티 섹션 및 리뷰 모달에서 사용하는 형식으로 변환한다.
 * user가 null이거나 createdAt이 없는 경우 방어적 기본값을 적용한다.
 */
@Getter
public class ReviewDto {
    private Long id;
    private String title;
    private String content;
    private String writerName;
    private Double rating;
    private String date;

    public ReviewDto(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.writerName = post.getUser() != null ? post.getUser().getUsername() : "알 수 없음";
        this.rating = post.getRating() != null ? post.getRating() : 0.0;
        this.date = post.getCreatedAt() != null
                ? post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : "";
    }
}
