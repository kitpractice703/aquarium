package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.PasswordResetCheckRequest;
import com.aquarium.Naquarium.dto.PasswordResetRequest;
import com.aquarium.Naquarium.dto.UserUpdateRequest;
import com.aquarium.Naquarium.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자 정보 관리 컨트롤러
 * - 회원정보 수정, 비밀번호 재설정 (본인 확인 → 비밀번호 변경 2단계)
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 회원정보 수정 (현재 비밀번호 확인 후 변경) */
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
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }

    /** 비밀번호 재설정 1단계: 이메일 + 전화번호로 본인 확인 */
    @PostMapping("/reset-password/check")
    public ResponseEntity<?> checkUserForReset(@RequestBody PasswordResetCheckRequest request) {
        try {
            userService.validateUserForPasswordReset(request);
            return ResponseEntity.ok("본인 확인이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** 비밀번호 재설정 2단계: 새 비밀번호 설정 */
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