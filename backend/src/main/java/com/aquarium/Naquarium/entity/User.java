package com.aquarium.Naquarium.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String username; // 이름(닉네임)

    @Column // 구글 로그인 시 비밀번호가 없을 수 있으므로 nullable
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // USER, ADMIN

    private String provider; // "google" 또는 "local"

    @Builder
    public User(String email, String username, String password, Role role, String provider) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
        this.provider = provider;
    }

    // Role Enum 정의
    public enum Role {
        USER, ADMIN
    }
}