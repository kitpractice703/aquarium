package com.naquarium.controller;

import com.naquarium.config.TestSecurityConfig;
import com.naquarium.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * AuthController 단위 테스트 (@WebMvcTest)
 * - 실제 DB 없이 MockMvc + Mockito로 HTTP 요청/응답 검증
 * - TestSecurityConfig: CSRF 비활성 + anyRequest().permitAll()
 * - 테스트 대상: 회원가입, 로그인, 내 정보 조회, 로그아웃
 */
@WebMvcTest(AuthController.class)
@Import(TestSecurityConfig.class)
class AuthControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean AuthService authService;
    @MockitoBean AuthenticationManager authenticationManager;

    // ─────────────────────────────────────────────
    // POST /api/auth/signup
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("회원가입 성공 - 정상 요청 시 200 반환")
    void signup_success() throws Exception {
        willDoNothing().given(authService).signup(any());

        String body = objectMapper.writeValueAsString(
                new SignupRequestDto("new@test.com", "password123", "신규유저", "010-1234-5678"));

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(content().string("회원가입이 완료되었습니다!"));
    }

    @Test
    @DisplayName("회원가입 실패 - 이메일 중복 시 409 반환")
    void signup_duplicateEmail_returns409() throws Exception {
        willThrow(new IllegalArgumentException("이미 가입된 아이디(이메일)입니다."))
                .given(authService).signup(any());

        String body = objectMapper.writeValueAsString(
                new SignupRequestDto("exist@test.com", "pw", "기존유저", null));

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(content().string("이미 가입된 아이디(이메일)입니다."));
    }

    // ─────────────────────────────────────────────
    // POST /api/auth/login
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("로그인 성공 - 인증 완료 시 200 반환")
    void login_success() throws Exception {
        UsernamePasswordAuthenticationToken mockAuth =
                new UsernamePasswordAuthenticationToken("user@test.com", null);
        given(authenticationManager.authenticate(any())).willReturn(mockAuth);

        String body = objectMapper.writeValueAsString(
                new LoginRequestDto("user@test.com", "correctPw"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(content().string("로그인 성공"));
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 불일치 시 401 반환")
    void login_wrongPassword_returns401() throws Exception {
        given(authenticationManager.authenticate(any()))
                .willThrow(new BadCredentialsException("비밀번호 불일치"));

        String body = objectMapper.writeValueAsString(
                new LoginRequestDto("user@test.com", "wrongPw"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    // ─────────────────────────────────────────────
    // GET /api/auth/me
    // ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("내 정보 조회 - 로그인 상태면 이메일 반환")
    void getMyInfo_authenticated_returnsEmail() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("user@test.com"));
    }

    @Test
    @DisplayName("내 정보 조회 - 비로그인 시 401 반환")
    void getMyInfo_anonymous_returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    // ─────────────────────────────────────────────
    // POST /api/auth/logout
    // ─────────────────────────────────────────────

    @Test
    @WithMockUser
    @DisplayName("로그아웃 - 세션 무효화 후 200 반환")
    void logout_success() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(content().string("로그아웃 되었습니다."));
    }

    // ─────────────────────────────────────────────
    // 내부 테스트 전용 DTO
    // ─────────────────────────────────────────────

    record SignupRequestDto(String email, String password, String username, String phone) {}
    record LoginRequestDto(String email, String password) {}
}
