package com.naquarium.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * PUT /api/users/me 요청 바디 (마이페이지 회원정보 수정)
 * currentPassword는 로컬 회원 본인 확인 필수값이며, OAuth2 회원은 null 허용.
 * newPassword·phone 중 하나만 전달해 부분 업데이트도 가능하다.
 */
@Getter @Setter
public class UserUpdateRequest {
    private String currentPassword;
    private String newPassword;
    private String phone;
}