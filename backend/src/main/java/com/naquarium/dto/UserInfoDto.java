package com.naquarium.dto;

import com.naquarium.entity.User;
import lombok.Getter;

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
