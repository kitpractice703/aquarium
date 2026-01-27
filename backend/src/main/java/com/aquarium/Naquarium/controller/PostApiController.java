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
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostApiController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // 1. [조회] 후기 목록 가져오기
    @GetMapping("/reviews")
    public List<PostDto> getReviews() {
        return postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream()
                .map(PostDto::new)
                .collect(Collectors.toList());
    }

    // 2. [작성] 후기 쓰기 (로그인 필수)
    @PostMapping("/reviews")
    public ResponseEntity<String> createReview(@RequestBody WriteDto request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        User user = userRepository.findByEmail(auth.getName())
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
    }

    // ================= DTO =================
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

            // [방어 코드 1] 작성자 정보가 없으면 "알 수 없음" 처리
            if (post.getUser() != null) {
                this.writerName = post.getUser().getUsername();
            } else {
                this.writerName = "알 수 없음";
            }

            // [방어 코드 2] 별점이 없으면 0.0 처리
            this.rating = (post.getRating() != null) ? post.getRating() : 0.0;

            // [방어 코드 3] 날짜가 없으면 빈 문자열 처리 (여기서 에러가 가장 많이 납니다!)
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