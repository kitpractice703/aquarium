package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.entity.Post;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.PostRepository;
import com.aquarium.Naquarium.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 게시글 API 컨트롤러 (후기 CRUD)
 * - 후기 목록 조회: 비로그인 접근 가능 (permitAll)
 * - 후기 작성: 로그인 필요
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostApiController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /** 인증 정보에서 이메일 추출 (일반 로그인 / OAuth2 분기 처리) */
    private String getEmail(Authentication auth) {
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            return oauth2.getPrincipal().getAttribute("email");
        }
        return auth.getName();
    }

    /** 후기 목록 조회 (최신순, @EntityGraph로 user 즉시 로딩) */
    @GetMapping("/reviews")
    @Transactional(readOnly = true)
    public List<PostDto> getReviews() {
        return postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream()
                .map(PostDto::new)
                .collect(Collectors.toList());
    }

    /** 후기 작성 (로그인 필요) */
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
            e.printStackTrace();
            return ResponseEntity.status(500).body("후기 등록 실패: " + e.getMessage());
        }
    }

    /** 후기 응답 DTO (내부 클래스) */
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

    /** 후기 작성 요청 DTO (내부 클래스) */
    @Data
    static class WriteDto {
        private String title;
        private String content;
        private Double rating;
    }
}