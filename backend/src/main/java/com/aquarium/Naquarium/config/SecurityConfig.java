package com.aquarium.Naquarium.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // lambda DSL용
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // [CORS] 프론트엔드(5173)의 요청을 허용합니다.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // [CSRF] 개발 단계에서는 끄는 게 편합니다 (나중에 켤 수 있음)
                .csrf(AbstractHttpConfigurer::disable)
                // [HTTP Basic] 팝업창 뜨는 기본 로그인 방식 끄기
                .httpBasic(AbstractHttpConfigurer::disable)
                // [Form Login] 기본 로그인 페이지 끄기 (React로 만드니까요)
                .formLogin(AbstractHttpConfigurer::disable)
                // [권한 설정]
                .authorizeHttpRequests(auth -> auth
                        // 로그인, 회원가입, 공개 API는 누구나 접근 가능
                        .requestMatchers("/api/auth/**", "/api/public/**", "/error").permitAll()
                        // 그 외 모든 요청은 로그인해야 접근 가능
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                // 로그인 성공 시 프론트엔드(5173) 홈으로 리다이렉트
                .defaultSuccessUrl("http://localhost:5173", true)
                 );

        return http.build();
    }

    // [CORS 설정 상세] "누구를 문지기가 통과시켜 줄 것인가?"
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 1. 허용할 프론트엔드 주소 (필수!)
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // 2. 허용할 HTTP 메서드 (GET, POST 등 다 열어줍니다)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 3. 허용할 헤더 (Authorization 등)
        config.setAllowedHeaders(List.of("*"));

        // 4. 쿠키/세션 정보 허용 (로그인 유지에 필수)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}