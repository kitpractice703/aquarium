package com.aquarium.Naquarium.dto;

import lombok.Data;

/** 비밀번호 재설정 실행 요청 DTO */
@Data
public class PasswordResetRequest {
    private String email;
    private String newPassword;
}