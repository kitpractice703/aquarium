package com.naquarium.dto;

import com.naquarium.entity.User;
import lombok.Getter;

/**
 * /api/auth/me 세션 확인 응답 DTO
 *
 * 프론트엔드 AuthContext의 checkLoginStatus()에서 호출하며,
 * 반환된 role로 isAdmin 여부를 판단한다.
 * role이 null인 경우 "USER"를 기본값으로 반환한다.
 */
@Getter
public class UserInfoDto {
    private Long id;
    private String email;
    private String username;
    private String role;

    public UserInfoDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.role = user.getRole() != null ? user.getRole().name() : "USER";
    }
}
