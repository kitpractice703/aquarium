package com.aquarium.Naquarium.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * 컨트롤러 슬라이스 테스트(@WebMvcTest) 전용 보안 설정
 * - CSRF 비활성: @WebMvcTest 기본 설정의 403 방지
 * - anyRequest().permitAll(): Spring Security 레이어에서는 모두 허용
 * - 각 컨트롤러가 직접 SecurityContextHolder를 검사하여 401 처리하므로
 *   @WithMockUser(인증) vs 미인증(anonymousUser) 분기가 정상 작동함
 */
@TestConfiguration
@EnableWebSecurity
public class TestSecurityConfig {

    @Bean
    public SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
