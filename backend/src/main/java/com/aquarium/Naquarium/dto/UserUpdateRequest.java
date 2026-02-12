package com.aquarium.Naquarium.dto;

import lombok.Getter;
import lombok.Setter;

/** 회원정보 수정 요청 DTO */
@Getter @Setter
public class UserUpdateRequest {
    /** 본인 확인을 위한 현재 비밀번호 (필수) */
    private String currentPassword;
    /** 변경할 새 비밀번호 (선택, 미입력 시 기존 유지) */
    private String newPassword;
    /** 변경할 전화번호 (선택, 미입력 시 기존 유지) */
    private String phone;
}