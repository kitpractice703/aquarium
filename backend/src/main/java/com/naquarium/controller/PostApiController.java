package com.naquarium.controller;

import com.naquarium.entity.Post;
import com.naquarium.entity.User;
import com.naquarium.repository.PostRepository;
import com.naquarium.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/** 후기 API 컨트롤러 - 목록 조회(공개), 작성(로그인 필요) */
@Slf4j
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostApiController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    private String getEmail(Authentication auth) {
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            return oauth2.getPrincipal().getAttribute("email");
        }
        return auth.getName();
    }

    @GetMapping("/reviews")
    @Transactional(readOnly = true)
    public List<PostDto> getReviews() {
        return postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream()
                .map(PostDto::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/reviews")
    public ResponseEntity<String> createReview(@RequestBody WriteDto request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            String email = getEmail(auth);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("사용자 정보 없음"));

            Post post = Post.builder()
                    .user(user)
                    .title(request.getTitle())
                    .content(request.getContent())
                    .rating(request.getRating())
                    .category(Post.Category.REVIEW)
                    .build();

            postRepository.save(post);
            return ResponseEntity.ok("후기가 등록되었습니다.");

        } catch (Exception e) {
            log.error("Failed to create review", e);
            return ResponseEntity.status(500).body("후기 등록 중 오류가 발생했습니다.");
        }
    }

    @Data
    static class PostDto {
        private Long id;
        private String title;
        private String content;
        private String writerName;
        private Double rating;
        private String date;

        public PostDto(Post post) {
            this.id = post.getId();
            this.title = post.getTitle();
            this.content = post.getContent();

            if (post.getUser() != null) {
                this.writerName = post.getUser().getUsername();
            } else {
                this.writerName = "알 수 없음";
            }

            this.rating = (post.getRating() != null) ? post.getRating() : 0.0;

            if (post.getCreatedAt() != null) {
                this.date = post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } else {
                this.date = "";
            }
        }
    }

    @Data
    static class WriteDto {
        private String title;
        private String content;
        private Double rating;
    }
}