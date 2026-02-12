package com.aquarium.Naquarium.config;

import com.aquarium.Naquarium.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security 보안 설정
 * - CORS, CSRF, 인증/인가 정책, OAuth2 소셜 로그인 설정 담당
 * - 세션 기반 인증 사용 (JWT 미사용)
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    /**
     * HTTP 보안 필터 체인 구성
     * - CSRF 비활성화: REST API 서버이므로 토큰 기반 CSRF 보호 불필요
     * - formLogin/httpBasic 비활성화: 프론트엔드(React)에서 직접 로그인 폼 제공
     * - 인증 실패 시 401 응답 반환 (리다이렉트 대신 JSON 응답 처리를 위함)
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // 미인증 요청에 대해 401 상태코드 반환 (로그인 페이지 리다이렉트 방지)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )

                // URL별 접근 권한 설정: permitAll = 비로그인 접근 허용
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/public/**",
                                "/api/exhibitions",
                                "/api/schedules",
                                "/api/programs",
                                "/api/posts/reviews",
                                "/error",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/api/programs/**",
                                "/api/posts/**",
                                "/api/users/reset-password/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                // Google OAuth2 소셜 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .defaultSuccessUrl("https://aquarium-sand.vercel.app", true)
                );

        return http.build();
    }

    /**
     * CORS 정책 설정
     * - 허용된 Origin: 로컬 개발서버(5173), Vercel 배포 도메인
     * - credentials: true → 세션 쿠키 전송 허용 (withCredentials)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://aquarium-sand.vercel.app"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /** 로그인 인증 처리를 위한 AuthenticationManager Bean 등록 */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}