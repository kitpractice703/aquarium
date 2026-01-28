package com.aquarium.Naquarium;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class NaquariumApplication {

    public static void main(String[] args) {
        SpringApplication.run(NaquariumApplication.class, args);
    }

    // [FIX] SecurityConfig에서 설정이 꼬이는 것을 방지하기 위해 여기서 직접 등록합니다.
    // 이 코드가 있으면 "PasswordEncoder를 찾을 수 없다"는 에러는 100% 해결됩니다.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}