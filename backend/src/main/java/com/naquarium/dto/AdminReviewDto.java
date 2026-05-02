package com.naquarium.dto;

import com.naquarium.entity.Post;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
public class AdminReviewDto {
    private Long id;
    private String writerName;
    private String writerEmail;
    private String title;
    private String content;
    private Double rating;
    private String createdAt;

    public AdminReviewDto(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.rating = post.getRating();
        if (post.getCreatedAt() != null) {
            this.createdAt = post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        }
        if (post.getUser() != null) {
            this.writerName = post.getUser().getUsername();
            this.writerEmail = post.getUser().getEmail();
        }
    }
}
