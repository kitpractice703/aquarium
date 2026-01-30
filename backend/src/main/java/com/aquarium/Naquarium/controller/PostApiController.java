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
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken; // [필수 Import]
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostApiController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // [핵심] 로그인 방식에 따라 이메일을 정확하게 추출하는 메서드 (ReservationController와 동일)
    private String getEmail(Authentication auth) {
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            return oauth2.getPrincipal().getAttribute("email");
        }
        return auth.getName();
    }

    // 1. [조회] 후기 목록 가져오기
    @GetMapping("/reviews")
    @Transactional(readOnly = true)
    public List<PostDto> getReviews() {
        return postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream()
                .map(PostDto::new)
                .collect(Collectors.toList());
    }

    // 2. [작성] 후기 쓰기 (로그인 필수)
    @PostMapping("/reviews")
    public ResponseEntity<String> createReview(@RequestBody WriteDto request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            // [수정] getEmail() 메서드로 진짜 이메일 가져오기
            String email = getEmail(auth);
            System.out.println(">>> 후기 작성 요청 이메일: " + email); // [로그 확인용]

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
            e.printStackTrace(); // 서버 로그에 에러 출력
            return ResponseEntity.status(500).body("후기 등록 실패: " + e.getMessage());
        }
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

            // [방어 코드 3] 날짜 포맷팅
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