package com.naquarium.dto;

import lombok.Getter;
import lombok.Setter;

/** POST /api/auth/signup 요청 바디 */
@Getter @Setter
public class SignupRequest {
    private String email;
    private String password;
    private String username;
    private String phone;
}