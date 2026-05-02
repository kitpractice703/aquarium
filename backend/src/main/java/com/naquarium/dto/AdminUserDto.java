package com.naquarium.dto;

import com.naquarium.entity.User;
import lombok.Getter;

@Getter
public class AdminUserDto {
    private Long id;
    private String email;
    private String username;
    private String phone;
    private String role;
    private String provider;

    public AdminUserDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.phone = user.getPhone();
        this.role = user.getRole() != null ? user.getRole().name() : "USER";
        this.provider = user.getProvider();
    }
}
