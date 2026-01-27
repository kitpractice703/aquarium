package com.aquarium.Naquarium.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // [1] 비밀번호 암호화 도구 등록 (필수!)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. 정적 자원 및 메인 페이지 허용
                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/error").permitAll()

                        // 2. 인증/로그인 관련 API 허용
                        .requestMatchers("/api/auth/**").permitAll()

                        // [수정] 3. "GET"으로 요청하는 "모든" API는 누구나 볼 수 있게 허용!
                        // 이렇게 하면 api/exhibitions, api/posts 등에서 로그인 창으로 튕기지 않습니다.
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll()

                        // 4. 그 외(글쓰기, 예약하기 등 POST/PUT/DELETE)는 로그인 필요
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost:5173", true)
                );

        return http.build();
    }

    // CORS 허용 규칙 정의
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 프론트엔드 주소 허용
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // 모든 HTTP 메서드 허용 (GET, POST, PUT, DELETE...)
        configuration.setAllowedMethods(List.of("*"));
        // 모든 헤더 허용
        configuration.setAllowedHeaders(List.of("*"));
        // 쿠키나 인증 정보를 주고받을 수 있게 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
}