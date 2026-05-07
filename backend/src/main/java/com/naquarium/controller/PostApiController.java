package com.naquarium.controller;

import com.naquarium.dto.ReviewDto;
import com.naquarium.service.PostService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 후기 API 컨트롤러 (/api/posts/**)
 *
 * - GET  /api/posts/reviews  후기 목록 조회 (공개, 인증 불필요)
 * - POST /api/posts/reviews  후기 작성 (로그인 필요)
 *
 * SecurityConfig에서 /api/posts/** 를 permitAll로 설정했으나,
 * 후기 작성 시 Controller에서 인증 여부를 직접 확인한다.
 */
@Slf4j
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostApiController {

    private final PostService postService;

    /**
     * OAuth2/일반 로그인 타입에 따라 이메일을 추출하는 헬퍼.
     * ReservationController와 동일한 패턴으로 두 인증 방식을 통합 처리한다.
     */
    private String getEmail(Authentication auth) {
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            return oauth2.getPrincipal().getAttribute("email");
        }
        return auth.getName();
    }

    /** GET /api/posts/reviews - 후기 목록 조회 (최신순) */
    @GetMapping("/reviews")
    public List<ReviewDto> getReviews() {
        return postService.getReviews();
    }

    /**
     * POST /api/posts/reviews - 후기 작성
     *
     * @return 200 OK | 401 Unauthorized | 500 Internal Server Error
     */
    @PostMapping("/reviews")
    public ResponseEntity<String> createReview(@RequestBody WriteDto request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            postService.createReview(getEmail(auth), request.getTitle(), request.getContent(), request.getRating());
            return ResponseEntity.ok("후기가 등록되었습니다.");
        } catch (Exception e) {
            log.error("Failed to create review", e);
            return ResponseEntity.status(500).body("후기 등록 중 오류가 발생했습니다.");
        }
    }

    /** 후기 작성 요청 바디 (내부 클래스로 범위를 이 컨트롤러로 한정) */
    @Data
    static class WriteDto {
        private String title;
        private String content;
        private Double rating;
    }
}
