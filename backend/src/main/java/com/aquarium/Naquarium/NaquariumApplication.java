package com.aquarium.Naquarium;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Naquarium 아쿠아리움 애플리케이션 진입점
 * - Spring Boot 기반 백엔드 서버
 * - PasswordEncoder Bean을 애플리케이션 레벨에서 등록하여 순환 참조 방지
 */
@SpringBootApplication
public class NaquariumApplication {

    public static void main(String[] args) {
        SpringApplication.run(NaquariumApplication.class, args);
    }

    /**
     * 비밀번호 암호화에 사용되는 BCryptPasswordEncoder Bean 등록
     * SecurityConfig가 아닌 Application 레벨에 배치하여 Bean 순환 참조 문제를 방지
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}