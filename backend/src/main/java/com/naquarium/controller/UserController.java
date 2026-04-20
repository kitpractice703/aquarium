package com.naquarium.controller;

import com.naquarium.dto.PasswordResetCheckRequest;
import com.naquarium.dto.PasswordResetRequest;
import com.naquarium.dto.UserUpdateRequest;
import com.naquarium.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/** 사용자 정보 컨트롤러 - 회원정보 수정, 비밀번호 재설정(2단계) */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/me")
    public ResponseEntity<String> updateMyInfo(@RequestBody UserUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        try {
            userService.updateUser(email, request);
            return ResponseEntity.ok("회원정보가 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Failed to update user info for email: {}", email, e);
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }

    @PostMapping("/reset-password/check")
    public ResponseEntity<?> checkUserForReset(@RequestBody PasswordResetCheckRequest request) {
        try {
            userService.validateUserForPasswordReset(request);
            return ResponseEntity.ok("본인 확인이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("비밀번호 변경 실패: " + e.getMessage());
        }
    }
}