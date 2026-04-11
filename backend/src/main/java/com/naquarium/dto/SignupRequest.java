package com.naquarium.dto;

import lombok.Getter;
import lombok.Setter;

/** 회원가입 요청 DTO */
@Getter @Setter
public class SignupRequest {
    private String email;
    private String password;
    private String username;
    private String phone;
}