package com.naquarium.dto;

import com.naquarium.entity.Post;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

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
