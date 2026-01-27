package com.aquarium.Naquarium.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 주소에 대해
                .allowedOrigins("http://localhost:3000, http://localhost:5173") // 리액트 서버(3000번, 5173번)만 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE"); // 모든 동작 허용
    }
}