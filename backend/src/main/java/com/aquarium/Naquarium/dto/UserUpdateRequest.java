package com.aquarium.Naquarium.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserUpdateRequest {
    private String currentPassword; // 본인 확인을 위해 필수
    private String newPassword;     // 변경할 경우에만 입력 (선택)
    private String phone;           // 변경할 전화번호 (선택)
}