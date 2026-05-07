package com.naquarium.config;

import com.naquarium.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security 설정
 *
 * 인증 방식: JWT Stateless + Google OAuth2
 * CSRF 비활성화: SPA(React)와 JWT 조합에서는 쿠키 세션을 사용하지 않으므로 불필요
 * 세션 정책: STATELESS - 서버가 세션을 생성·저장하지 않음
 * 권한 구조: 공개 API → 로그인 필요 API → ADMIN 전용 API
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtProvider jwtProvider;
    private final OAuth2SuccessHandler oauth2SuccessHandler;

    /** 환경변수로 주입받아 개발(localhost)·운영(Vercel) 환경을 분리한다 */
    @Value("${cors.allowed-origins}")
    private String corsAllowedOrigins;

    /**
     * 보안 필터 체인 구성.
     *
     * 필터 적용 순서:
     *   JwtFilter → UsernamePasswordAuthenticationFilter → ... → 인가 처리
     * JwtFilter를 UsernamePasswordAuthenticationFilter 앞에 등록해
     * 토큰 기반 인증이 폼 로그인보다 먼저 처리되도록 한다.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 인증되지 않은 요청이 보호 리소스에 접근하면 401 반환 (기본 리다이렉트 대신)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",          // 로그인·회원가입·세션 확인
                                "/api/public/**",
                                "/api/exhibitions",      // 전시 목록 (공개)
                                "/api/schedules",        // 스케줄 목록 (공개)
                                "/api/programs",         // 프로그램 목록 (공개)
                                "/api/posts/reviews",    // 후기 조회 (공개)
                                "/error",
                                "/oauth2/**",            // OAuth2 인증 시작점
                                "/login/oauth2/**",      // OAuth2 콜백 처리
                                "/api/programs/**",
                                "/api/posts/**",
                                "/api/users/reset-password/**"  // 비밀번호 재설정 (본인 확인)
                        ).permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")  // 관리자 전용
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oauth2SuccessHandler)
                )
                // JWT 필터를 폼 로그인 필터 앞에 삽입
                .addFilterBefore(new JwtFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS 설정.
     * 허용 Origin은 환경변수(cors.allowed-origins)로 관리해
     * 개발·운영 환경을 코드 변경 없이 분리한다.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(corsAllowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        // JWT를 Authorization 헤더로 전달하므로 쿠키 자격증명(Credentials)은 불필요
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * AuthenticationManager 빈 등록.
     * AuthController의 이메일·비밀번호 로그인 처리에 사용된다.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
