package com.aquarium.Naquarium;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.TimeZone;

/** Naquarium 애플리케이션 진입점 */
@SpringBootApplication
public class NaquariumApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
        SpringApplication.run(NaquariumApplication.class, args);
    }

    /** SecurityConfig가 아닌 Application 레벨에 배치하여 Bean 순환 참조 방지 */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}