package com.naquarium.controller;

import com.naquarium.config.TestSecurityConfig;
import com.naquarium.entity.Post;
import com.naquarium.entity.User;
import com.naquarium.repository.PostRepository;
import com.naquarium.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * PostApiController 단위 테스트 (@WebMvcTest)
 * - TestSecurityConfig: CSRF 비활성 + anyRequest().permitAll()
 * - 테스트 대상: 후기 목록 조회(공개), 후기 작성(로그인 필요)
 */
@WebMvcTest(PostApiController.class)
@Import(TestSecurityConfig.class)
class PostApiControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean PostRepository postRepository;
    @MockitoBean UserRepository userRepository;

    // ─────────────────────────────────────────────
    // GET /api/posts/reviews
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("후기 목록 조회 - 비로그인도 200 반환 (공개 API)")
    void getReviews_anonymous_returns200() throws Exception {
        User user = buildUser("writer@test.com", "작성자");
        Post post = Post.builder()
                .title("정말 좋아요")
                .content("아이들과 함께 방문했는데 최고였습니다.")
                .rating(5.0)
                .category(Post.Category.REVIEW)
                .user(user)
                .build();
        given(postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW))
                .willReturn(List.of(post));

        mockMvc.perform(get("/api/posts/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("정말 좋아요"))
                .andExpect(jsonPath("$[0].writerName").value("작성자"))
                .andExpect(jsonPath("$[0].rating").value(5.0));
    }

    @Test
    @DisplayName("후기 목록 조회 - 후기가 없으면 빈 배열 반환")
    void getReviews_empty_returnsEmptyArray() throws Exception {
        given(postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW))
                .willReturn(List.of());

        mockMvc.perform(get("/api/posts/reviews"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    // ─────────────────────────────────────────────
    // POST /api/posts/reviews
    // ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("후기 작성 성공 - 로그인 상태면 200 반환")
    void createReview_authenticated_returns200() throws Exception {
        User user = buildUser("user@test.com", "테스터");
        given(userRepository.findByEmail("user@test.com")).willReturn(Optional.of(user));

        Map<String, Object> body = Map.of(
                "title", "멋진 아쿠아리움",
                "content", "정말 즐거운 경험이었습니다.",
                "rating", 4.5
        );

        mockMvc.perform(post("/api/posts/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(content().string("후기가 등록되었습니다."));
    }

    @Test
    @DisplayName("후기 작성 - 비로그인 시 401 반환")
    void createReview_anonymous_returns401() throws Exception {
        Map<String, Object> body = Map.of(
                "title", "테스트",
                "content", "내용",
                "rating", 3.0
        );

        mockMvc.perform(post("/api/posts/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized());
    }

    // ─────────────────────────────────────────────
    // 헬퍼
    // ─────────────────────────────────────────────

    private User buildUser(String email, String username) {
        return User.builder()
                .email(email).username(username)
                .password("pw").role(User.Role.USER).provider("local")
                .build();
    }
}
