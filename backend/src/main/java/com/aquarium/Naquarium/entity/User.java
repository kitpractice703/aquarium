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
    private String username;

    @Column
    private String password;

    // [Point 1] 필드 선언이 있는지 확인
    @Column
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

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

    public void updateInfo(String newPassword, String newPhone) {
        if (newPassword != null && !newPassword.isBlank()) {
            this.password = newPassword;
        }
        if (newPhone != null && !newPhone.isBlank()) {
            this.phone = newPhone;
        }
    }
}