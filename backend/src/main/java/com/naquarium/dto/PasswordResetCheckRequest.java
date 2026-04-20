package com.naquarium.dto;

import lombok.Data;

@Data
public class PasswordResetCheckRequest {
    private String email;
    private String phone;
}