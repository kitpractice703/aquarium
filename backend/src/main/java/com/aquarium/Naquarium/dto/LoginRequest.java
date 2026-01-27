package com.aquarium.Naquarium.dto;

import lombok.AllArgsConstructor; // 추가
import lombok.Getter;
import lombok.NoArgsConstructor; // 추가
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor // [필수] 기본 생성자 (빈 깡통)
@AllArgsConstructor // [선택] 모든 필드 생성자
public class LoginRequest {
    private String email;
    private String password;
}