package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 엔티티
 * - 일반 회원가입(provider="local")과 Google OAuth2(provider="google") 모두 지원
 * - 소셜 로그인 사용자는 password가 null일 수 있음
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    /** 로그인 식별자 (이메일 주소, unique) */
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String username;

    /** 암호화된 비밀번호 (소셜 로그인 시 null) */
    @Column
    private String password;

    @Column
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    /** 인증 제공자: "local"(일반 회원가입), "google"(소셜 로그인) */
    private String provider;

    @Builder
    public User(String email, String username, String password, String phone, Role role, String provider) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.provider = provider;
    }

    public enum Role {
        USER, ADMIN
    }

    /** 회원정보 수정 (비밀번호, 전화번호 - 값이 있는 경우에만 갱신) */
    public void updateInfo(String newPassword, String newPhone) {
        if (newPassword != null && !newPassword.isBlank()) {
            this.password = newPassword;
        }
        if (newPhone != null && !newPhone.isBlank()) {
            this.phone = newPhone;
        }
    }

    /** 비밀번호 재설정 전용 setter */
    public void setPassword(String password) {
        this.password = password;
    }
}