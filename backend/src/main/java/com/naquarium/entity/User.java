package com.naquarium.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원 엔티티 (users 테이블)
 *
 * 로컬 로그인 회원과 Google OAuth2 회원을 단일 테이블로 관리한다.
 * - 로컬 회원: password 존재, provider = "local"
 * - OAuth2 회원: password = null, provider = "google"
 *
 * @Enumerated(EnumType.STRING): 숫자 대신 문자열로 저장해
 * enum 순서 변경 시 데이터 불일치를 방지한다.
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

    /** 로그인 식별자 - 중복 불가 */
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String username;

    /** BCrypt 해시값 저장. OAuth2 회원은 null */
    @Column
    private String password;

    /** 하이픈 포함 형식 (010-0000-0000). 비밀번호 재설정 본인 확인에 사용 */
    @Column
    private String phone;

    /** USER(일반 회원) / ADMIN(관리자) */
    @Enumerated(EnumType.STRING)
    private Role role;

    /** 로그인 방식 구분: "local" | "google" */
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

    /**
     * 마이페이지 회원정보 수정.
     * null 또는 빈 값이 전달되면 기존 값을 유지한다 (부분 업데이트 지원).
     *
     * @param newPassword BCrypt 인코딩된 새 비밀번호 (변경 없으면 null)
     * @param newPhone    새 전화번호 (변경 없으면 null)
     */
    public void updateInfo(String newPassword, String newPhone) {
        if (newPassword != null && !newPassword.isBlank()) {
            this.password = newPassword;
        }
        if (newPhone != null && !newPhone.isBlank()) {
            this.phone = newPhone;
        }
    }

    /**
     * 비밀번호 재설정 전용 setter.
     * updateInfo()와 달리 인코딩 여부를 호출부(UserService)에서 보장해야 한다.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /** 관리자가 역할을 USER ↔ ADMIN으로 변경할 때 사용 */
    public void updateRole(Role newRole) {
        this.role = newRole;
    }
}
