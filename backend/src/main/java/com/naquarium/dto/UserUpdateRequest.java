package com.naquarium.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserUpdateRequest {
    private String currentPassword;
    private String newPassword;
    private String phone;
}