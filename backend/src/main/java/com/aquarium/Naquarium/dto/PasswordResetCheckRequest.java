package com.aquarium.Naquarium.dto;

import lombok.Data;

/** 비밀번호 재설정 자격 확인 요청 DTO (이메일 + 전화번호 일치 검증용) */
@Data
public class PasswordResetCheckRequest {
    private String email;
    private String phone;
}