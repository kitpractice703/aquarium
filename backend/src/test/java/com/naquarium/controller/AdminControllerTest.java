package com.naquarium.controller;

import com.naquarium.dto.DashboardStatsDto;
import com.naquarium.service.AdminService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * AdminController 단위 테스트
 * - 핵심: hasRole("ADMIN") 접근 제어가 실제로 동작하는지 검증
 * - 비인증(anonymous) → 401, USER 권한 → 403, ADMIN 권한 → 200
 * - TestSecurityConfig(permitAll) 대신 Admin 전용 설정을 사용하여 실제 보안 규칙을 적용
 */
@WebMvcTest(AdminController.class)
@Import(AdminControllerTest.AdminSecurityConfig.class)
class AdminControllerTest {

    @Autowired MockMvc mockMvc;
    @MockitoBean AdminService adminService;

    // ─────────────────────────────────────────────
    // GET /api/admin/dashboard
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("대시보드 - 비인증 접근 시 401 반환")
    void dashboard_anonymous_returns401() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("대시보드 - USER 권한으로 접근 시 403 반환")
    void dashboard_userRole_returns403() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("대시보드 - ADMIN 권한으로 접근 시 200 반환")
    void dashboard_adminRole_returns200() throws Exception {
        given(adminService.getDashboardStats())
                .willReturn(new DashboardStatsDto(3L, 12L, 150L, List.of()));

        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isOk());
    }

    // ─────────────────────────────────────────────
    // Admin 전용 Security 설정
    // ─────────────────────────────────────────────

    @TestConfiguration
    @EnableWebSecurity
    static class AdminSecurityConfig {

        @Bean
        SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/api/admin/**").hasRole("ADMIN")
                            .anyRequest().permitAll())
                    .exceptionHandling(ex -> ex
                            .authenticationEntryPoint((req, res, e) -> res.sendError(401)));
            return http.build();
        }
    }
}
