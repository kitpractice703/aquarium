package com.naquarium;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.TimeZone;

/**
 * Naquarium 애플리케이션 진입점
 *
 * - 기본 타임존을 Asia/Seoul로 설정해 DB 날짜/시간 처리 기준을 통일한다.
 * - PasswordEncoder 빈을 최상위에 선언해 순환 의존성을 방지한다.
 *   (SecurityConfig 내부 선언 시 UserDetailsService와 순환 참조 가능)
 */
@SpringBootApplication
public class NaquariumApplication {

  public static void main(String[] args) {
    TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    SpringApplication.run(NaquariumApplication.class, args);
  }

  /**
   * 비밀번호 단방향 암호화 빈.
   * BCrypt 알고리즘(기본 강도 10)을 사용하며, 회원가입·정보 수정·재설정에 공통 적용된다.
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
